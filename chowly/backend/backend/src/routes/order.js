const express = require("express");
const router = express.Router();
const prisma = require("../prisma");

const orderInclude = {
  visit: { include: { customer: true, restaurant: true } },
  orderItems: { include: { menuItem: true } },
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

// PATCH /api/orders/:id/assign - waiter opens the order and records who is preparing it.
// Body: { waiterId, chefId?, bartenderId? }
router.patch("/:id/assign", async (req, res, next) => {
  try {
    const { waiterId, chefId, bartenderId } = req.body;
    const order = await prisma.order.update({
      where: { id: parseInt(req.params.id, 10) },
      data: {
        waiterId: waiterId ?? undefined,
        chefId: chefId ?? undefined,
        bartenderId: bartenderId ?? undefined,
        status: "PREPARING",
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
