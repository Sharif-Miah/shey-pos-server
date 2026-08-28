const express = require('express');
const usersModel = require('../models/userModel');
const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const { email, userId, password } = req.body;
    const identifier = email || userId;

    if (!identifier || !password) {
      return res.status(400).json({ message: 'Email/UserId and Password are required' });
    }

    const user = await usersModel.findOne({
      $or: [{ email: identifier }, { userId: identifier }],
      password: password,
      varified: true,
    });

    if (user) {
      res.status(200).json(user);
    } else {
      res.status(400).json({ message: 'Login failed: Invalid credentials or user not verified' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
});

router.post('/register', async (req, res) => {
  try {
    const { name, email, userId, password } = req.body;

    if (!name || !password || (!email && !userId)) {
      return res.status(400).json({ message: 'Name, Email and Password are required' });
    }

    const userEmail = email || userId;

    // Check if user already exists
    const existingUser = await usersModel.findOne({
      $or: [{ email: userEmail }, { userId: userEmail }],
    });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    const newUser = new usersModel({
      name,
      email: userEmail,
      userId: userId || userEmail,
      password,
      varified: true,
    });

    await newUser.save();
    res.status(200).json({ massage: 'User Registered Successfully', message: 'User Registered Successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Registration failed' });
  }
});

module.exports = router;
