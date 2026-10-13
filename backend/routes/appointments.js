const express = require('express');
const { protect } = require('../middleware/auth');
const { createAppointment, getAppointments } = require('../controllers/appointmentController');

const router = express.Router({ mergeParams: true });

router.use(protect);

router.route('/')
  .post(createAppointment);

router.route('/child/:childId')
  .get(getAppointments);

module.exports = router;

