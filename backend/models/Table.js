const mongoose = require('mongoose');

const TableSchema = new mongoose.Schema({
  number: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['Free', 'Occupied'],
    default: 'Free'
  },
  seats: {
    type: Number,
    required: true
  },
  currentOrder: {
    orderId: String,
    totalAmount: Number,
    items: Number,
    timestamp: Date
  }
}, { timestamps: true });

module.exports = mongoose.model('Table', TableSchema);
