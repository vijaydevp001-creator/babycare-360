const mongoose = require('mongoose');

const notificationSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: String,
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['appointment', 'vaccine', 'growth', 'reminder'],
    default: 'reminder'
  },
  childId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Child'
  },
  read: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationLogSchema);

