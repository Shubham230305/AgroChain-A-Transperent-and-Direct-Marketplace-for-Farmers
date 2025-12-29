const express = require('express');
const { 
  createTransaction, 
  getTransactions, 
  updateTransactionHash 
} = require('../controllers/paymentController');

const { protect } = require('../middleware/auth');

const router = express.Router();

router
  .route('/transaction')
  .post(protect, createTransaction);

router
  .route('/transactions')
  .get(protect, getTransactions);

router
  .route('/transaction/:id')
  .put(protect, updateTransactionHash);

module.exports = router;