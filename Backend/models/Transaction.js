const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  buyer: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  seller: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  crop: {
    type: mongoose.Schema.ObjectId,
    ref: 'Crop',
    required: true
  },
  amount: {
    type: Number,
    required: [true, 'Please add transaction amount']
  },
  quantity: {
    type: Number,
    required: [true, 'Please add quantity purchased']
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['blockchain', 'bank', 'cash'],
    default: 'blockchain'
  },
  transactionHash: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Transaction', TransactionSchema);