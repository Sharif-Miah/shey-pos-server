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
<<<<<<< HEAD
    const newItem = new itemModel(req.body);
=======
>>>>>>> 8bd7ff9e8e1725da97dfba545fd778c6bc10332c
    const value = {
      name: req.body.name,
      price: parseFloat(req.body.price),
      image: req.body.image,
      category: req.body.category,
    };
<<<<<<< HEAD
=======
    const newItem = new itemModel(value);
>>>>>>> 8bd7ff9e8e1725da97dfba545fd778c6bc10332c
    await newItem.save();
    res.status(200).json({ massage: 'Item added successfully' });
  } catch (error) {
    res.status(404).json(error);
  }
});

module.exports = router;
