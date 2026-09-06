const express = require("express");
const router = express.Router();
const prisma = require("../prisma");

const orderInclude = {
  visit: { include: { customer: true, restaurant: true } },
  orderItems: { include: { menuItem: { include: { category: true } } } },
  waiter: true,
  chef: true,
  bartender: true,
  payment: true,
  feedbacks: true,
};

// POST /api/orders - a customer submits an order.
// Body: { visitId, items: [{ menuItemId, quantity }] }
// Computes the waiting time shown to the customer as the slowest item's prep time
// plus a small kitchen-queue buffer, and creates one OrderItem row per line.
router.post("/", async (req, res, next) => {
  try {
    const { visitId, items } = req.body;
    if (!visitId || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "visitId and at least one item are required." });
    }

    const menuItems = await prisma.menuItem.findMany({
      where: { id: { in: items.map((i) => i.menuItemId) } },
    });
    if (menuItems.length === 0) return res.status(400).json({ error: "No valid menu items found." });

    const slowestPrep = Math.max(...menuItems.map((m) => m.avgPreparationTimeMins));
    const estimatedWaitTimeMins = slowestPrep + 5; // kitchen-queue buffer

    const order = await prisma.order.create({
      data: {
        visitId,
        estimatedWaitTimeMins,
        status: "PENDING",
        orderItems: {
          create: items.map((i) => {
            const menuItem = menuItems.find((m) => m.id === i.menuItemId);
            return {
              menuItemId: i.menuItemId,
              quantity: i.quantity,
              subTotal: menuItem.price * i.quantity,
            };
          }),
        },
      },
      include: orderInclude,
    });

    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
});

// GET /api/orders - the waiter's order queue for one restaurant.
// ?status=PENDING,PREPARING filters by status; ?restaurantId=1 is required.
router.get("/", async (req, res, next) => {
  try {
    const { status, restaurantId } = req.query;
    if (!restaurantId) return res.status(400).json({ error: "restaurantId query param is required." });

    const where = {
      visit: { restaurantId: parseInt(restaurantId, 10) },
      ...(status ? { status: { in: status.split(",") } } : {}),
    };
    const orders = await prisma.order.findMany({
      where,
      include: orderInclude,
      orderBy: { orderTime: "asc" },
    });
    res.json(orders);
  } catch (err) {
    next(err);
  }
});

// GET /api/orders/visit/:visitId - a customer's own orders (for their tracking screen)
router.get("/visit/:visitId", async (req, res, next) => {
  try {
    const orders = await prisma.order.findMany({
      where: { visitId: parseInt(req.params.visitId, 10) },
      include: orderInclude,
      orderBy: { orderTime: "desc" },
    });
    res.json(orders);
  } catch (err) {
    next(err);
  }
});

// GET /api/orders/:id
router.get("/:id", async (req, res, next) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: parseInt(req.params.id, 10) },
      include: orderInclude,
    });
    if (!order) return res.status(404).json({ error: "Order not found." });
    res.json(order);
  } catch (err) {
    next(err);
  }
});

// PATCH /api/orders/:id/accept - a waiter accepts a newly-placed order.
// Body: { waiterId }
// This is step 1 of the tracked flow the customer sees: "Accepted by waiter".
router.patch("/:id/accept", async (req, res, next) => {
  try {
    const { waiterId } = req.body;
    if (!waiterId) return res.status(400).json({ error: "waiterId is required." });
    const order = await prisma.order.update({
      where: { id: parseInt(req.params.id, 10) },
      data: { waiterId: Number(waiterId), status: "ACCEPTED" },
      include: orderInclude,
    });
    res.json(order);
  } catch (err) {
    next(err);
  }
});
// PATCH /api/orders/:id/assign - waiter updates waiter/chef/bartender together in one save.
// Body: { waiterId?, chefId?, bartenderId? } - any field left out is unchanged.
router.patch("/:id/assign", async (req, res, next) => {
  try {
    const { waiterId, chefId, bartenderId } = req.body;
    const existing = await prisma.order.findUnique({ where: { id: parseInt(req.params.id, 10) } });
    if (!existing) return res.status(404).json({ error: "Order not found." });

    const data = {};
    if (waiterId !== undefined) data.waiterId = waiterId ? Number(waiterId) : null;
    if (chefId !== undefined) data.chefId = chefId ? Number(chefId) : null;
    if (bartenderId !== undefined) data.bartenderId = bartenderId ? Number(bartenderId) : null;

    // Assigning a chef or bartender while still just "accepted" moves the order into prep.
    if (existing.status === "ACCEPTED" && (data.chefId || data.bartenderId)) {
      data.status = "PREPARING";
    }

    const order = await prisma.order.update({
      where: { id: existing.id },
      data,
      include: orderInclude,
    });
    res.json(order);
  } catch (err) {
    next(err);
  }
});
// PATCH /api/orders/:id/assign-chef - records which chef is preparing the food.
// Body: { chefId }
// Step 2 of the flow: "Chef preparing your food". Bumps ACCEPTED -> PREPARING.
router.patch("/:id/assign-chef", async (req, res, next) => {
  try {
    const { chefId } = req.body;
    if (!chefId) return res.status(400).json({ error: "chefId is required." });
    const existing = await prisma.order.findUnique({ where: { id: parseInt(req.params.id, 10) } });
    if (!existing) return res.status(404).json({ error: "Order not found." });

    const order = await prisma.order.update({
      where: { id: existing.id },
      data: {
        chefId: Number(chefId),
        status: existing.status === "ACCEPTED" ? "PREPARING" : existing.status,
      },
      include: orderInclude,
    });
    res.json(order);
  } catch (err) {
    next(err);
  }
});

// PATCH /api/orders/:id/assign-bartender - records which bartender is preparing the drinks.
// Body: { bartenderId }
// Step 3 of the flow: "Bartender preparing your drinks". Bumps ACCEPTED -> PREPARING.
router.patch("/:id/assign-bartender", async (req, res, next) => {
  try {
    const { bartenderId } = req.body;
    if (!bartenderId) return res.status(400).json({ error: "bartenderId is required." });
    const existing = await prisma.order.findUnique({ where: { id: parseInt(req.params.id, 10) } });
    if (!existing) return res.status(404).json({ error: "Order not found." });

    const order = await prisma.order.update({
      where: { id: existing.id },
      data: {
        bartenderId: Number(bartenderId),
        status: existing.status === "ACCEPTED" ? "PREPARING" : existing.status,
      },
      include: orderInclude,
    });
    res.json(order);
  } catch (err) {
    next(err);
  }
});

// PATCH /api/orders/:id/serve - waiter marks the order as served
router.patch("/:id/serve", async (req, res, next) => {
  try {
    const order = await prisma.order.update({
      where: { id: parseInt(req.params.id, 10) },
      data: { status: "SERVED" },
      include: orderInclude,
    });
    res.json(order);
  } catch (err) {
    next(err);
  }
});

// PATCH /api/orders/:id/complete - waiter closes out the table after payment.
// This is the "finish attending to the customer" step: once the payment has come
// through (or the waiter otherwise settles it), the order leaves the active queue.
router.patch("/:id/complete", async (req, res, next) => {
  try {
    const order = await prisma.order.update({
      where: { id: parseInt(req.params.id, 10) },
      data: { status: "COMPLETED" },
      include: orderInclude,
    });
    res.json(order);
  } catch (err) {
    next(err);
  }
});

// PATCH /api/orders/:id/delay - flag a serious delay (waiter-triggered, or the customer's
// complaint flow calls this before submitting feedback)
router.patch("/:id/delay", async (req, res, next) => {
  try {
    const order = await prisma.order.update({
      where: { id: parseInt(req.params.id, 10) },
      data: { status: "DELAYED" },
      include: orderInclude,
    });
    res.json(order);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
