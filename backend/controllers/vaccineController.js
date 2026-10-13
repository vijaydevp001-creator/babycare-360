const Vaccine = require('../models/Vaccine');

// @desc    Add vaccination
// @route   POST /api/vaccines
// @access  Private
const addVaccine = async (req, res) => {
  try {
    const vaccine = await Vaccine.create(req.body);
    const populated = await Vaccine.findById(vaccine._id).populate('childId');
    res.status(201).json(populated);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

// @desc    Get vaccines for child
// @route   GET /api/vaccines/:childId
// @access  Private
const getVaccines = async (req, res) => {
  try {
    const vaccines = await Vaccine.find({ childId: req.params.childId });
    res.json(vaccines);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

module.exports = {
  addVaccine,
  getVaccines
};

