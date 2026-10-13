const mongoose = require('mongoose');

const medicineSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  childId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Child',
    required: true
  },
  dosage: String,
  frequency: String,
  startDate: Date,
  endDate: Date,
  prescribedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  notes: String
}, { timestamps: true });

module.exports = mongoose.model('Medicine', medicineSchema);

