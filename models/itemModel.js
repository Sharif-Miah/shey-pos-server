const mongoose = require('mongoose');

const itemsSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    image: { type: String, required: true },

    // নতুন ফিল্ডসমূহ:
    barcode: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    stock: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    lowStockThreshold: {
      type: Number,
      default: 5,
    },
  },
  {
    timestamps: true,
  }
);

const itemsModel = mongoose.model('items', itemsSchema);

module.exports = itemsModel;

