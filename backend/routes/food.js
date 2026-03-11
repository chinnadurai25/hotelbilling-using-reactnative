const express = require('express');
const router = express.Router();
const FoodItem = require('../models/FoodItem');

// @route   GET /api/food
// @desc    Get all food items
router.get('/', async (req, res) => {
  try {
    const foodItems = await FoodItem.find();
    res.json(foodItems);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   POST /api/food
// @desc    Add a new food item
router.post('/', async (req, res) => {
  const { name, price, category, imageUrl, description, type, isAvailable, isPopular, prepTime } = req.body;

  const foodItem = new FoodItem({
    name,
    price,
    category,
    imageUrl,
    description,
    type,
    isAvailable,
    isPopular,
    prepTime
  });

  try {
    const newFoodItem = await foodItem.save();
    res.status(201).json(newFoodItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// @route   GET /api/food/:id
// @desc    Get a single food item
router.get('/:id', async (req, res) => {
  try {
    const foodItem = await FoodItem.findById(req.params.id);
    if (!foodItem) return res.status(404).json({ message: 'Food item not found' });
    res.json(foodItem);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   PUT /api/food/:id
// @desc    Update a food item
router.put('/:id', async (req, res) => {
  try {
    const updatedFoodItem = await FoodItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedFoodItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// @route   DELETE /api/food/:id
// @desc    Delete a food item
router.delete('/:id', async (req, res) => {
  try {
    const foodItem = await FoodItem.findById(req.params.id);
    if (!foodItem) return res.status(404).json({ message: 'Food item not found' });
    await foodItem.deleteOne();
    res.json({ message: 'Food item deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
