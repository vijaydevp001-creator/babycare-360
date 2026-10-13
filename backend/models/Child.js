const mongoose = require('mongoose');

const childSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    required: true
  },
  height: [{ value: Number, date: Date }], // cm
  weight: [{ value: Number, date: Date }], // kg
  vaccinations: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vaccine'
  }],
  nutritionLogs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'NutritionLog'
  }],
  appointments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment'
  }]
}, { timestamps: true });

module.exports = mongoose.model('Child', childSchema);

