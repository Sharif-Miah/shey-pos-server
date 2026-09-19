require('dotenv').config();
const express = require('express');
const billModel = require('../models/billModel');
const itemModel = require('../models/itemModel');
const stripe = process.env.STRIPE_SECRET_KEY ? require('stripe')(process.env.STRIPE_SECRET_KEY) : null;
const router = express.Router();

const ItemModel = itemModel;
const BillModel = billModel;

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
    const { cartItems } = req.body;
    // ১. পর্যাপ্ত স্টক আছে কি না যাচাই
    if (cartItems && Array.isArray(cartItems)) {
      for (const item of cartItems) {
        const dbItem = await ItemModel.findById(item._id);
        if (!dbItem) {
          return res.status(404).json({ message: `Product ${item.name || 'Item'} not found!` });
        }
        if (dbItem.stock < item.quantity) {
          return res.status(400).json({ 
            message: `Insufficient stock for ${dbItem.name}! Available stock is ${dbItem.stock}` 
          });
        }
      }
    }
    // ২. বিল সেভ করা
    const newBill = new BillModel(req.body);
    await newBill.save();
    // ৩. প্রতিটি আইটেমের স্টক স্বয়ংক্রিয়ভাবে ডাটাবেজ থেকে বিয়োগ ($inc: -quantity)
    if (cartItems && Array.isArray(cartItems)) {
      for (const item of cartItems) {
        await ItemModel.findByIdAndUpdate(item._id, {
          $inc: { stock: -item.quantity }
        });
      }
    }
    res.send('Bill charged and stock updated successfully');
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/get-all-bill', async (req, res) => {
  try {
    const bill = await billModel.find();
    res.send(bill);
  } catch (error) {
    res.status(500).json({ message: error.message, error });
  }
});

// একটি নির্দিষ্ট বিল আইডি দিয়ে বিল আনার এন্ডপয়েন্ট (QR কোড এবং পাবলিক ইনভয়েসের জন্য)
router.get('/get-bill-by-id', async (req, res) => {
  try {
    const billId = req.query.id || req.query.billId;
    if (!billId) {
      return res.status(400).json({ message: 'Bill ID is required' });
    }
    const bill = await billModel.findById(billId);
    if (!bill) {
      return res.status(404).json({ message: 'Bill not found' });
    }
    res.status(200).json(bill);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// URL Param হিসেবেও অ্যাক্সেস করার রাউট: /api/bill/get-bill-by-id/:id
router.get('/get-bill-by-id/:id', async (req, res) => {
  try {
    const billId = req.params.id;
    if (!billId) {
      return res.status(400).json({ message: 'Bill ID is required' });
    }
    const bill = await billModel.findById(billId);
    if (!bill) {
      return res.status(404).json({ message: 'Bill not found' });
    }
    res.status(200).json(bill);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
