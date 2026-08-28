const mongoose = require('mongoose');

const usersSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    userId: { type: String, required: false },
    password: { type: String, required: true },
    varified: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

const usersModel = mongoose.model('users', usersSchema);

module.exports = usersModel;
