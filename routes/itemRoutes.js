const express = require('express');
const itemModel = require('../models/itemModel');
const router = express.Router();

router.get('/get-all-items', async (req, res) => {
  try {
    const items = await itemModel.find();
    res.send(items);
  } catch (error) {
    res.status(500).json(error);
  }
});

const ItemModel = itemModel;

router.post('/add-item', async (req, res) => {
  try {
    const newItem = new ItemModel({
      name: req.body.name,
      price: req.body.price,
      category: req.body.category,
      image: req.body.image,
      barcode: req.body.barcode || undefined,
      stock: Number(req.body.stock) || 0,
      lowStockThreshold: Number(req.body.lowStockThreshold) || 5,
    });
    await newItem.save();
    res.send('Item added successfully');
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/edit-item', async (req, res) => {
  try {
    await ItemModel.findOneAndUpdate(
      { _id: req.body.itemId },
      {
        name: req.body.name,
        price: req.body.price,
        category: req.body.category,
        image: req.body.image,
        barcode: req.body.barcode || undefined,
        stock: Number(req.body.stock) || 0,
        lowStockThreshold: Number(req.body.lowStockThreshold) || 5,
      }
    );
    res.send('Item updated successfully');
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/delete-item', async (req, res) => {
  try {
    await itemModel.findOneAndDelete({ _id: req.body.itemId });
    res.send('Item Deleted Successfully.');
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
