require('dotenv').config();
const mongoose = require('mongoose');
const itemModel = require('./models/itemModel');
const itemsData = require('./items.json');

const URI = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/sheypos';

const seedDB = async () => {
  try {
    console.log('Connecting to database for seeding...');
    await mongoose.connect(URI);
    console.log('Database connected successfully.');

    // Clear existing items
    console.log('Clearing existing items...');
    await itemModel.deleteMany({});
    console.log('Existing items cleared.');

    // Insert items from items.json
    console.log(`Inserting ${itemsData.length} items...`);
    await itemModel.insertMany(itemsData);
    console.log('Items seeded successfully!');

    mongoose.connection.close();
    console.log('Database connection closed.');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error.message);
    process.exit(1);
  }
};

seedDB();
