const express = require('express');
const usersModel = require('../models/userModel');
const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and Password are required' });
    }

    const cleanEmail = email.trim().toLowerCase();

    const user = await usersModel.findOne({
      email: cleanEmail,
      password: password,
      varified: true,
    });

    if (user) {
      res.status(200).json(user);
    } else {
      res.status(400).json({ message: 'Login failed: Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
});

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, Email and Password are required' });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check if user already exists
    const existingUser = await usersModel.findOne({ email: cleanEmail });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    const newUser = new usersModel({
      name: name.trim(),
      email: cleanEmail,
      password: password,
      varified: true,
    });

    await newUser.save();
    res.status(200).json({ message: 'User Registered Successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Registration failed' });
  }
});

module.exports = router;
