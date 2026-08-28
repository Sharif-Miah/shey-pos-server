const express = require('express');
const billModel = require('../models/billModel');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const router = express.Router();

// Stripe Checkout Session Create Endpoint
router.post('/create-checkout-session', async (req, res) => {
  try {
    const { cartItems, tax, customerName, customerPhoneNumber } = req.body;

    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).json({ message: 'Cart items are required' });
    }

    const line_items = cartItems.map((item) => {
      const isValidImage =
        item.image &&
        typeof item.image === 'string' &&
        (item.image.startsWith('http://') || item.image.startsWith('https://'));

      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name || 'Product Item',
            ...(isValidImage ? { images: [item.image] } : {}),
          },
          unit_amount: Math.round(Number(item.price || 0) * 100), // Stripe সেন্টসে হিসাব করে (cents)
        },
        quantity: Number(item.quantity) || 1,
      };
    });

    // ট্যাক্স যোগ করা (যদি থাকে)
    if (tax && Number(tax) > 0) {
      line_items.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Tax / VAT',
          },
          unit_amount: Math.round(Number(tax) * 100),
        },
        quantity: 1,
      });
    }

    const origin =
      req.headers.origin ||
      (req.headers.referer ? new URL(req.headers.referer).origin : null) ||
      'http://localhost:5173';

    // Stripe Session তৈরি
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      metadata: {
        customerName: customerName || '',
        customerPhoneNumber: customerPhoneNumber || '',
      },
      success_url: `${origin}/bills?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cart?payment=cancelled`,
    });

    res.status(200).json({ url: session.url, id: session.id });
  } catch (error) {
    console.error('Stripe error:', error.message);
    res.status(500).json({ message: error.message });
  }
});

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

router.get('/get-all-bill', async (req, res) => {
  try {
    const bill = await billModel.find();
    res.send(bill);
  } catch (error) {
    res.status(404).json(error);
  }
});

module.exports = router;
