const Appointment = require('../models/Appointment');

// @desc    Create appointment
// @route   POST /api/appointments
// @access  Private
const createAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.create(req.body);
    const populated = await Appointment.findById(appointment._id)
      .populate('childId doctorId parentId');
    res.status(201).json(populated);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

// @desc    Get appointments for user/child
// @route   GET /api/appointments/child/:childId
// @access  Private
const getAppointments = async (req, res) => {
  try {
    const query = { childId: req.params.childId };
    if (req.user.role === 'doctor') query.doctorId = req.user.id;
    if (req.user.role === 'parent') query.parentId = req.user.id;
    
    const appointments = await Appointment.find(query).populate('childId doctorId parentId');
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

module.exports = {
  createAppointment,
  getAppointments
};

