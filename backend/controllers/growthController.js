const GrowthRecord = require('../models/GrowthRecord');

// @desc    Add growth record
// @route   POST /api/growth
// @access  Private
const addGrowthRecord = async (req, res) => {
  try {
    const growthRecord = await GrowthRecord.create({
      ...req.body,
      childId: req.body.childId
    });
    const populated = await GrowthRecord.findById(growthRecord._id).populate('childId');
    res.status(201).json(populated);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

// @desc    Get growth records for child
// @route   GET /api/growth/:childId
// @access  Private
const getGrowthRecords = async (req, res) => {
  try {
    const records = await GrowthRecord.find({ childId: req.params.childId });
    res.json(records);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

module.exports = {
  addGrowthRecord,
  getGrowthRecords
};

