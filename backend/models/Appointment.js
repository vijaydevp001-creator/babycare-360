const mongoose = require('mongoose');

const appointmentSchema = mongoose.Schema({
  childId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Child',
    required: true
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  time: String,
  type: {
    type: String,
    enum: ['checkup', 'vaccination', 'consultation', 'followup'],
    required: true
  },
  status: {
    type: String,
    enum: ['scheduled', 'completed', 'cancelled'],
    default: 'scheduled'
  },
  notes: String
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);

