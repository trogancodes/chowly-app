const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Add this webhook route to your existing file
router.post('/webhook', async (req, res) => {
  const { orderId } = req.body;

  try {
    const order = await prisma.order.update({
      where: { id: parseInt(orderId) },
      data: { paymentStatus: 'PAID' },
      include: { visit: true }
    });

    // Optional: If using WebSockets (e.g., Socket.io), emit live notification to the waiter
    // req.io.to(`waiter-${order.waiterId}`).emit('payment_received', {
    //   orderId: order.id,
    //   tableNumber: order.visit?.tableNumber,
    //   message: `Table ${order.visit?.tableNumber} has made payment!`
    // });

    res.json({ success: true, order });
  } catch (error) {
    console.error('Payment webhook error:', error);
    res.status(500).json({ error: 'Payment webhook processing failed' });
  }
});

module.exports = router;