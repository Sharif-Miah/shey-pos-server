const mongoose = require('mongoose');

const usersSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    userId: { type: String, required: true },
    password: { type: String, required: true },
    varified: { type: Boolean, required: false },
  },
  {
    timestamps: true,
  }
);

const usersModel = mongoose.model('users', usersSchema);

module.exports = usersModel;
