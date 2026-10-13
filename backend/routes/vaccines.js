const express = require('express');
const { protect } = require('../middleware/auth');
const { addVaccine, getVaccines } = require('../controllers/vaccineController');

const router = express.Router({ mergeParams: true });

router.use(protect);

router.route('/')
  .post(addVaccine);

router.route('/:childId')
  .get(getVaccines);

module.exports = router;

