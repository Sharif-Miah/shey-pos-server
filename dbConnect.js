const mongoose = require('mongoose');

const URI = `mongodb+srv://sheypos:sheypos@cluster0.ejrpgrq.mongodb.net/sheypos`;

mongoose.connect(URI);

let connectionObj = mongoose.connection;

connectionObj.on('connection', () => {
  console.log('MongoDB connection on successfully.');
});

connectionObj.on('error', () => {
  console.log('MongoDB connection failed.');
});
