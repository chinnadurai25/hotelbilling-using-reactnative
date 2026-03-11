const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// @route   GET /api/orders/user/:userId
// @desc    Get orders for a specific user
router.get('/user/:userId', async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.userId }).sort({ timestamp: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   GET /api/orders
// @desc    Get all orders (sales report)
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .sort({ timestamp: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   POST /api/orders
// @desc    Create a new order
router.post('/', async (req, res) => {
  const { items, totalAmount, paymentMethod, date, orderType, table, location, status, user } = req.body;
  
  const order = new Order({
    orderId: req.body.orderId || `ORD-${Date.now()}`,
    items,
    totalAmount,
    paymentMethod,
    orderType,
    table,
    location,
    status: status || 'Pending',
    date: date || new Date().toISOString().split('T')[0],
    user // Add user ID here
  });

  try {
    const newOrder = await order.save();
    res.status(201).json(newOrder);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// @route   GET /api/orders/today
// @desc    Get today's sales
router.get('/today', async (req, res) => {
  const today = new Date().toISOString().split('T')[0];
  try {
    const orders = await Order.find({ date: today });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   PATCH /api/orders/:id
// @desc    Update order status
router.patch('/:id', async (req, res) => {
  const { status } = req.body;
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (status) order.status = status;
    
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// @route   DELETE /api/orders/:id
// @desc    Delete an order
router.delete('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    await order.deleteOne();
    res.json({ message: 'Order removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
