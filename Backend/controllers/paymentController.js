const Transaction = require('../models/Transaction');
const Crop = require('../models/Crop');

// @desc    Create new transaction
// @route   POST /api/payments/transaction
// @access  Private
exports.createTransaction = async (req, res) => {
  try {
    const { cropId, quantity, paymentMethod } = req.body;
    
    // Find the crop
    const crop = await Crop.findById(cropId);
    
    if (!crop) {
      return res.status(404).json({
        success: false,
        message: 'Crop not found'
      });
    }
    
    // Check if enough quantity is available
    if (crop.quantity < quantity) {
      return res.status(400).json({
        success: false,
        message: 'Not enough quantity available'
      });
    }
    
    // Calculate amount
    const amount = crop.price * quantity;
    
    // Create transaction
    const transaction = await Transaction.create({
      buyer: req.user.id,
      seller: crop.farmer,
      crop: cropId,
      amount,
      quantity,
      paymentMethod
    });
    
    // Update crop quantity and status if needed
    crop.quantity -= quantity;
    if (crop.quantity === 0) {
      crop.status = 'sold';
    }
    await crop.save();
    
    res.status(201).json({
      success: true,
      data: transaction
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get user transactions
// @route   GET /api/payments/transactions
// @access  Private
exports.getTransactions = async (req, res) => {
  try {
    let query;
    
    // If user is buyer, get their purchases
    if (req.user.role === 'buyer') {
      query = Transaction.find({ buyer: req.user.id });
    } 
    // If user is farmer, get their sales
    else if (req.user.role === 'farmer') {
      query = Transaction.find({ seller: req.user.id });
    }
    // If admin, get all transactions
    else {
      query = Transaction.find();
    }
    
    // Execute query with population
    const transactions = await query
      .populate({
        path: 'crop',
        select: 'name price'
      })
      .populate({
        path: 'buyer',
        select: 'name'
      })
      .populate({
        path: 'seller',
        select: 'name'
      });
    
    res.status(200).json({
      success: true,
      count: transactions.length,
      data: transactions
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update blockchain transaction hash
// @route   PUT /api/payments/transaction/:id
// @access  Private
exports.updateTransactionHash = async (req, res) => {
  try {
    const { transactionHash } = req.body;
    
    const transaction = await Transaction.findById(req.params.id);
    
    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }
    
    // Verify user is buyer or admin
    if (transaction.buyer.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this transaction'
      });
    }
    
    // Update transaction
    transaction.transactionHash = transactionHash;
    transaction.status = 'completed';
    await transaction.save();
    
    res.status(200).json({
      success: true,
      data: transaction
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};