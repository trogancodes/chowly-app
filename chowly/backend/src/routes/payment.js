const express = require("express");
const router = express.Router();
const prisma = require("../prisma");

// POST /api/payments - the customer "pays" for an order (pretend payment, per the brief).
// Body: { orderId, customerId, paymentMethod }
router.post("/", async (req, res, next) => {
  try {
    const { orderId, customerId, paymentMethod } = req.body;
    if (!orderId || !customerId || !paymentMethod) {
      return res.status(400).json({ error: "orderId, customerId and paymentMethod are required." });
    }

    const order = await prisma.order.findUnique({
      where: { id: parseInt(orderId, 10) },
      include: { orderItems: true },
    });
    if (!order) return res.status(404).json({ error: "Order not found." });

    const amount = order.orderItems.reduce((sum, i) => sum + i.subTotal, 0);

    const payment = await prisma.payment.upsert({
      where: { orderId: order.id },
      update: { amount, paymentMethod, paymentStatus: "COMPLETED" },
      create: {
        orderId: order.id,
        customerId: parseInt(customerId, 10),
        amount,
        paymentMethod,
        paymentStatus: "COMPLETED",
      },
    });

    res.status(201).json(payment);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
