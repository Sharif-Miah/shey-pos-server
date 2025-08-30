const mongoose = require('mongoose');

const URI = `mongodb+srv://sheypos:sheypos@cluster0.ejrpgrq.mongodb.net/sheypos`;

// mongoose.connect(URI);

let connectionObj = mongoose.connection;

connectionObj.on('connection', () => {
  console.log('MongoDB connection on successfully.');
});

connectionObj.on('error', () => {
  console.log('MongoDB connection failed.');
});

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB connected : ${conn.connection.host}`);
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
