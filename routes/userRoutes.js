const express = require('express');
const usersModel = require('../models/userModel');
const router = express.Router();

router.get('/login', async (req, res) => {
  try {
    await usersModel.findOne({
      userId: req.body.userId,
      password: req.body.password,
      verifed: true,
    });
    res.send('User Login Successfully');
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post('/register', async (req, res) => {
  try {
    const newUser = await usersModel.find();
    await newUser.save();
    res.send('User Registered Successfully', newUser);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
