const express = require('express');
const { 
  getCrops, 
  getCrop, 
  createCrop, 
  updateCrop, 
  deleteCrop 
} = require('../controllers/cropController');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router
  .route('/crops')
  .get(getCrops)
  .post(protect, authorize('farmer', 'admin'), createCrop);

router
  .route('/crops/:id')
  .get(getCrop)
  .put(protect, authorize('farmer', 'admin'), updateCrop)
  .delete(protect, authorize('farmer', 'admin'), deleteCrop);

module.exports = router;