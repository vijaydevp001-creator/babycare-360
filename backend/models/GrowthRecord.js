const mongoose = require('mongoose');

const growthRecordSchema = mongoose.Schema({
  childId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Child',
    required: true
  },
  height: {
    type: Number,
    required: true // cm
  },
  weight: {
    type: Number,
    required: true // kg
  },
  headCircumference: Number, // cm
  measuredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  ageInMonths: Number
}, { timestamps: true });

module.exports = mongoose.model('GrowthRecord', growthRecordSchema);

