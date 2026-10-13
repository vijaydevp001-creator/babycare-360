const express = require('express');
const { protect } = require('../middleware/auth');
const NutritionLog = require('../models/NutritionLog');

// Simple CRUD for nutrition
const router = express.Router();

router.use(protect);

router.post('/', async (req, res) => {
  try {
    const log = await NutritionLog.create({ ...req.body, parentId: req.user.id });
    res.status(201).json(log);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
});

router.get('/:childId', async (req, res) => {
  try {
    const logs = await NutritionLog.find({ childId: req.params.childId });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

module.exports = router;

