require('dotenv').config();
const mongoose = require('mongoose');
const Child = require('./models/Child');

const checkIndices = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const indices = await Child.collection.getIndexes();
  console.log('Indices for Children collection:', indices);
  process.exit(0);
};

checkIndices().catch(err => {
  console.error(err);
  process.exit(1);
});
