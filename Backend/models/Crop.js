const mongoose = require('mongoose');

const CropSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a crop name'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  quantity: {
    type: Number,
    required: [true, 'Please add quantity']
  },
  unit: {
    type: String,
    required: [true, 'Please specify unit'],
    enum: ['kg', 'quintal', 'ton']
  },
  price: {
    type: Number,
    required: [true, 'Please add price per unit']
  },
  location: {
    type: String,
    required: [true, 'Please add location']
  },
  harvestDate: {
    type: Date,
    required: [true, 'Please add harvest date']
  },
  images: {
    type: [String]
  },
  quality: {
    type: String,
    enum: ['A', 'B', 'C'],
    default: 'B'
  },
  organic: {
    type: Boolean,
    default: false
  },
  farmer: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['available', 'sold', 'reserved'],
    default: 'available'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Crop', CropSchema);