const mongoose = require('mongoose');

const nutritionLogSchema = mongoose.Schema({
  childId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Child',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  meals: [{
    type: String,
    required: true
  }],
  calories: Number,
  notes: String,
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

module.exports = mongoose.model('NutritionLog', nutritionLogSchema);

