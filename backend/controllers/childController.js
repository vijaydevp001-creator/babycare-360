const Child = require('../models/Child');

// @desc    Get children for user
// @route   GET /api/children
// @access  Private
const getChildren = async (req, res) => {
  try {
    const children = await Child.find({ userId: req.user.id }).populate('vaccinations nutritionLogs appointments');
    res.json(children);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// @desc    Create child
// @route   POST /api/children
// @access  Private (parent only)
const createChild = async (req, res) => {
  try {
    req.body.userId = req.user.id;
    const child = await Child.create(req.body);
    res.status(201).json(child);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

// @desc    Get single child
// @route   GET /api/children/:id
// @access  Private
const getChild = async (req, res) => {
  try {
    const child = await Child.findById(req.params.id).populate('vaccinations nutritionLogs appointments growth_records');
    if (!child || child.userId.toString() !== req.user.id) {
      return res.status(404).json({ msg: 'Child not found' });
    }
    res.json(child);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// @desc    Update child
// @route   PUT /api/children/:id
// @access  Private
const updateChild = async (req, res) => {
  try {
    const child = await Child.findById(req.params.id);
    if (!child || child.userId.toString() !== req.user.id) {
      return res.status(404).json({ msg: 'Child not found' });
    }
    const updatedChild = await Child.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedChild);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

// @desc    Delete child
// @route   DELETE /api/children/:id
// @access  Private
const deleteChild = async (req, res) => {
  try {
    const child = await Child.findById(req.params.id);
    if (!child || child.userId.toString() !== req.user.id) {
      return res.status(404).json({ msg: 'Child not found' });
    }
    await Child.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Child deleted' });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

module.exports = {
  getChildren,
  createChild,
  getChild,
  updateChild,
  deleteChild
};

