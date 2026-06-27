require('dotenv').config();
const mongoose = require('mongoose');

const URI = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/sheypos';

let connectionObj = mongoose.connection;

connectionObj.on('connected', () => {
  console.log('MongoDB connection successfully established.');
});

connectionObj.on('error', (err) => {
  console.log('MongoDB connection failed:', err.message);
});

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(URI);
    console.log(`MongoDB connected : ${conn.connection.host}`);
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;

