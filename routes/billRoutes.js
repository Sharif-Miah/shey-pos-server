const express = require('express');
const billModel = require('../models/billModel');
const router = express.Router();

router.post('/charge-bill', async (req, res) => {
  try {
    const value = {
      customerName: req.body.customerName,
      customerPhoneNumber: req.body.customerPhoneNumber,
      totalAmount: parseFloat(req.body.totalAmount),
      tax: parseFloat(req.body.tax),
      subTotal: parseFloat(req.body.subTotal),
      paymentMode: req.body.paymentMode,
      cartItems: req.body.cartItems,
    };
    const newBill = new billModel(value);

    await newBill.save();
    res.status(200).json({ massage: 'Bill Item added successfully' });
  } catch (error) {
    res.status(404).json(error);
  }
});

module.exports = router;
