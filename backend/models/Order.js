const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  items: [
    {
      foodItemId: { type: mongoose.Schema.Types.ObjectId, ref: 'FoodItem' },
      name: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true }
    }
  ],
  totalAmount: { type: Number, required: true },
  paymentMethod: { type: String, default: 'UPI' },
  status: { type: String, enum: ['pending', 'completed', 'cancelled'], default: 'completed' },
  date: { type: String, required: true }, // YYYY-MM-DD
  timestamp: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);
