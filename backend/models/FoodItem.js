const mongoose = require('mongoose');

const FoodItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { 
    type: String, 
    required: true, 
    enum: ['breakfast', 'lunch', 'dinner', 'snacks', 'drinks', 'Breakfast', 'Lunch', 'Dinner', 'Snacks', 'Drinks'] 
  },
  imageUrl: { type: String },
  description: { type: String },
  type: { type: String, enum: ['Veg', 'Non Veg'], default: 'Veg' },
  isAvailable: { type: Boolean, default: true },
  isPopular: { type: Boolean, default: false },
  prepTime: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('FoodItem', FoodItemSchema);
