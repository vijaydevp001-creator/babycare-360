const mongoose = require('mongoose');

const schoolReportSchema = mongoose.Schema({
  childId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Child',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  schoolId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  height: Number,
  weight: Number,
  vision: String,
  dental: String,
  notes: String,
  bmi: Number
}, { timestamps: true });

module.exports = mongoose.model('SchoolReport', schoolReportSchema);

