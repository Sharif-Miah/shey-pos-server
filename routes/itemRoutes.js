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

// GET /api/items/get-categories
router.get('/get-categories', async (req, res) => {
  try {
    const categories = await itemModel.distinct('category');
    // Filter out empty or whitespace categories and sort alphabetically
    const cleanCategories = categories
      .filter((cat) => typeof cat === 'string' && cat.trim() !== '')
      .map((cat) => cat.trim())
      .sort((a, b) => a.localeCompare(b));
    res.status(200).send(cleanCategories);
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
      category: req.body.category ? req.body.category.trim() : req.body.category,
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
        category: req.body.category ? req.body.category.trim() : req.body.category,
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

// POST /api/items/delete-category
router.post('/delete-category', async (req, res) => {
  try {
    const { category, targetCategory = 'general' } = req.body;
    if (!category) {
      return res.status(400).json({ message: 'Category name is required' });
    }

    const trimmedCategory = category.trim();
    const safeTarget = (targetCategory || 'general').trim();

    // Escape regex special characters to prevent invalid regex syntax
    const escapedCategory = trimmedCategory.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    // ওই ক্যাটাগরির প্রোডাক্টগুলোর ক্যাটাগরি পরিবর্তন করে targetCategory ('general') করে দেওয়া
    const result = await itemModel.updateMany(
      { category: { $regex: new RegExp(`^${escapedCategory}$`, 'i') } },
      { $set: { category: safeTarget } }
    );

    res.status(200).send({
      message: `Category "${trimmedCategory}" deleted successfully. ${result.modifiedCount} items moved to "${safeTarget}".`,
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json(error);
  }
});

module.exports = router;

