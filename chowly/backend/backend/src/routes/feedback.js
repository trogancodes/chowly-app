const express = require("express");
const router = express.Router();
const prisma = require("../prisma");

// POST /api/feedback - customer submits a complaint + rating against a delayed order.
// Body: { orderId, customerId, complaintText, rating }
router.post("/", async (req, res, next) => {
  try {
    const { orderId, customerId, complaintText, rating } = req.body;
    if (!orderId || !customerId || !complaintText || !rating) {
      return res.status(400).json({ error: "orderId, customerId, complaintText and rating are required." });
    }
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: "rating must be between 1 and 5." });
    }

    const feedback = await prisma.feedback.create({
      data: { orderId, customerId, complaintText, rating },
    });

    res.status(201).json(feedback);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
