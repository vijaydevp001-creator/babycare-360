const express = require('express');
const { protect } = require('../middleware/auth');
const { addGrowthRecord, getGrowthRecords } = require('../controllers/growthController');

const router = express.Router({ mergeParams: true });

router.use(protect);

router.route('/')
  .post(addGrowthRecord);

router.route('/:childId')
  .get(getGrowthRecords);

module.exports = router;

