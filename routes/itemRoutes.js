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
    const newItem = new itemModel(req.body);
    await newItem.save();
    res.send('Item added successfully');
  } catch (error) {
    res.status(404).json(error);
  }
});

module.exports = router;
