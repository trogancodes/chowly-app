const express = require("express");
const router = express.Router();
const prisma = require("../prisma");

// POST /api/payments - the customer pays just before leaving.
// Body: { orderId, customerId, paymentMethod }
// This is a PRETEND payment: no card processor is called. It is recorded and clearly
// labelled as pretend, per the assignment brief.
router.post("/", async (req, res, next) => {
  try {
    const { orderId, customerId, paymentMethod } = req.body;
    if (!orderId || !customerId || !paymentMethod) {
      return res.status(400).json({ error: "orderId, customerId and paymentMethod are required." });
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { orderItems: true },
    });
    if (!order) return res.status(404).json({ error: "Order not found." });

    const amount = order.orderItems.reduce((sum, item) => sum + item.subTotal, 0);

    const payment = await prisma.payment.create({
      data: {
        orderId,
        customerId,
        amount,
        paymentMethod,
        paymentStatus: "COMPLETED",
        isPretend: true,
      },
    });

    res.status(201).json(payment);
  } catch (err) {
    if (err.code === "P2002") {
      return res.status(409).json({ error: "This order has already been paid for." });
    }
    next(err);
  }
});

module.exports = router;
