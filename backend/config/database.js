const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error('MONGO_URI is not configured');
  }

  const conn = await mongoose.connect(uri);
  console.log(`MongoDB Connected: ${conn.connection.host}`);
};

module.exports = connectDB;
