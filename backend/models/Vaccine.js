const mongoose = require('mongoose');

const vaccineSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  childId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Child',
    required: true
  },
  dateAdministered: {
    type: Date,
    required: true
  },
  doseNumber: {
    type: Number,
    default: 1
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  notes: String
}, { timestamps: true });

module.exports = mongoose.model('Vaccine', vaccineSchema);

