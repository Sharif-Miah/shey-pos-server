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

router.post('/add-item', async (req, res) => {
  try {
    const value = {
      name: req.body.name,
      price: parseFloat(req.body.price),
      image: req.body.image,
      category: req.body.category,
    };
    const newItem = new itemModel(value);
    await newItem.save();
    res.status(200).json({ massage: 'Item added successfully' });
  } catch (error) {
    res.status(404).json(error);
  }
});

module.exports = router;
