const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// @route   GET /api/orders
// @desc    Get all orders (sales report)
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().sort({ timestamp: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   POST /api/orders
// @desc    Create a new order
router.post('/', async (req, res) => {
  const { items, totalAmount, paymentMethod, date } = req.body;
  
  const order = new Order({
    orderId: `ORD-${Date.now()}`,
    items,
    totalAmount,
    paymentMethod,
    date: date || new Date().toISOString().split('T')[0]
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

module.exports = router;
