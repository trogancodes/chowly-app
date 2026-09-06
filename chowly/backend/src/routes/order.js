const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all orders for the Waiter Order Table and Kitchen/Bar views
router.get('/', async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        orderItems: {
          include: { menuItem: true }
        },
        visit: {
          include: { customer: true }
        },
        waiter: true,
        chef: true,
        bartender: true
      },
      orderBy: { orderTime: 'desc' }
    });
    res.json(orders);
  } catch (error) {
    console.error('Failed to fetch orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Create a new order
router.post('/', async (req, res) => {
  const { visitId, tableNumber, items } = req.body; // items: [{ menuItemId, quantity, category, notes, subTotal }]
  try {
    const newOrder = await prisma.order.create({
      data: {
        visitId: parseInt(visitId),
        status: 'PENDING',
        paymentStatus: 'PENDING',
        orderItems: {
          create: items.map(item => ({
            menuItemId: parseInt(item.menuItemId),
            quantity: parseInt(item.quantity),
            subTotal: parseFloat(item.subTotal),
            category: item.category || 'food',
            notes: item.notes || null
          }))
        }
      },
      include: { orderItems: true }
    });
    res.status(201).json(newOrder);
  } catch (error) {
    console.error('Failed to create order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Waiter accepts order & assigns status
router.patch('/:id/accept', async (req, res) => {
  const orderId = parseInt(req.params.id);
  const { waiterId } = req.body;
  try {
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: 'ACCEPTED_BY_WAITER',
        waiterId: waiterId ? parseInt(waiterId) : null
      }
    });
    res.json(updatedOrder);
  } catch (error) {
    console.error('Failed to accept order:', error);
    res.status(500).json({ error: 'Failed to accept order' });
  }
});

// Kitchen/Chef assigns order and sets estimated prep time
router.patch('/:id/assign-chef', async (req, res) => {
  const orderId = parseInt(req.params.id);
  const { chefId, prepTime } = req.body; // prepTime in minutes
  try {
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: 'ASSIGNED_TO_CHEF',
        chefId: chefId ? parseInt(chefId) : null,
        prepTime: prepTime ? parseInt(prepTime) : null
      }
    });
    res.json(updatedOrder);
  } catch (error) {
    console.error('Failed to assign chef and prep time:', error);
    res.status(500).json({ error: 'Failed to assign chef and prep time' });
  }
});

// Bartender updates drink processing status
router.patch('/:id/bartender-process', async (req, res) => {
  const orderId = parseInt(req.params.id);
  const { bartenderId } = req.body;
  try {
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: 'BARTENDER_PROCESSING',
        bartenderId: bartenderId ? parseInt(bartenderId) : null
      }
    });
    res.json(updatedOrder);
  } catch (error) {
    console.error('Failed to update bartender status:', error);
    res.status(500).json({ error: 'Failed to update bartender status' });
  }
});

// Waiter marks order as completed / finished attending
router.patch('/:id/complete', async (req, res) => {
  const orderId = parseInt(req.params.id);
  try {
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status: 'COMPLETED' }
    });
    res.json(updatedOrder);
  } catch (error) {
    console.error('Failed to complete order:', error);
    res.status(500).json({ error: 'Failed to complete order' });
  }
});

// Payment webhook / update route to trigger waiter notification
router.post('/:id/payment', async (req, res) => {
  const orderId = parseInt(req.params.id);
  const { paymentMethod, amount, customerId } = req.body;

  try {
    // Update order payment status and create payment record transaction
    const [updatedOrder] = await prisma.$transaction([
      prisma.order.update({
        where: { id: orderId },
        data: { paymentStatus: 'PAID' }
      }),
      prisma.payment.create({
        data: {
          orderId: orderId,
          customerId: parseInt(customerId),
          amount: parseFloat(amount),
          paymentMethod: paymentMethod || 'Cash/Card',
          paymentStatus: 'COMPLETED',
          isPretend: true
        }
      })
    ]);

    res.json({ success: true, order: updatedOrder });
  } catch (error) {
    console.error('Payment processing failed:', error);
    res.status(500).json({ error: 'Payment processing failed' });
  }
});

module.exports = router;