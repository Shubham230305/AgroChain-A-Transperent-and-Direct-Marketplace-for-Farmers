const Crop = require('../models/Crop');

// @desc    Get all crops
// @route   GET /api/marketplace/crops
// @access  Public
exports.getCrops = async (req, res) => {
  try {
    const crops = await Crop.find({ status: 'available' }).populate({
      path: 'farmer',
      select: 'name'
    });

    res.status(200).json({
      success: true,
      count: crops.length,
      data: crops
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get single crop
// @route   GET /api/marketplace/crops/:id
// @access  Public
exports.getCrop = async (req, res) => {
  try {
    const crop = await Crop.findById(req.params.id).populate({
      path: 'farmer',
      select: 'name email phone'
    });

    if (!crop) {
      return res.status(404).json({
        success: false,
        message: 'Crop not found'
      });
    }

    res.status(200).json({
      success: true,
      data: crop
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Create new crop listing
// @route   POST /api/marketplace/crops
// @access  Private (Farmer only)
exports.createCrop = async (req, res) => {
  try {
    // Add user to req.body
    req.body.farmer = req.user.id;

    const crop = await Crop.create(req.body);

    res.status(201).json({
      success: true,
      data: crop
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update crop listing
// @route   PUT /api/marketplace/crops/:id
// @access  Private (Farmer only)
exports.updateCrop = async (req, res) => {
  try {
    let crop = await Crop.findById(req.params.id);

    if (!crop) {
      return res.status(404).json({
        success: false,
        message: 'Crop not found'
      });
    }

    // Make sure user is crop owner
    if (crop.farmer.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this crop'
      });
    }

    crop = await Crop.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: crop
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Delete crop listing
// @route   DELETE /api/marketplace/crops/:id
// @access  Private (Farmer only)
exports.deleteCrop = async (req, res) => {
  try {
    const crop = await Crop.findById(req.params.id);

    if (!crop) {
      return res.status(404).json({
        success: false,
        message: 'Crop not found'
      });
    }

    // Make sure user is crop owner
    if (crop.farmer.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this crop'
      });
    }

    await crop.remove();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};