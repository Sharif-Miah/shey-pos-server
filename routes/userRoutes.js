const express = require('express');
const usersModel = require('../models/userModel');
const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const user = await usersModel.findOne({
      userId: req.body.userId,
      password: req.body.password,
      varified: true,
    });
    if (user) {
      res.send('User Login Successfully');
    } else {
      res.status(500).json({ message: 'Login faild' }, user);
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post('/register', async (req, res) => {
  try {
    const value = {
      name: req.body.name,
      userId: req.body.userId,
      password: req.body.password,
    };
    const users = new usersModel({ ...req.body, varified: false });

    await users.save();
    res.status(200).json({ massage: 'User Registered Successfully' });
  } catch (error) {
    res.status(404).json(error);
  }
});

// router.post('/register', async (req, res) => {
//   try {
//     const newUser = await usersModel.find();
//     await newUser.save();
//     res.send('User Registered Successfully', newUser);
//   } catch (error) {
//     res.status(500).json(error);
//   }
// });

module.exports = router;
