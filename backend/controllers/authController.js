const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const dotenv = require('dotenv');
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

exports.signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).send('All fields are required');
    }

    const user = await User.findOne({
      $or: [
        { username },
        { email }
      ],
    });

    if (user) {
      if (user.username === username) {
        return res.status(400).send('Username already exists');
      }
      if (user.email === email) {
        return res.status(400).send('Email already exists');
      }
    }

    const passwordRegExp = new RegExp('^[a-zA-Z0-9!@#$%^&*()_+]{6,50}$');
    const usernameRegExp = new RegExp('^[a-z0-9_]{3,50}$');
    const emailRegExp = new RegExp(
      '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$'
    );

    if (!passwordRegExp.test(password)) {
      return res.status(400).send('Password must be 6 characters long');
    }

    if (!usernameRegExp.test(username)) {
      return res
        .status(400)
        .send(
          'Username can only contain lowercase letters, numbers, and underscores.'
        );
    }

    if (!emailRegExp.test(email)) {
      return res.status(400).send('Please enter a valid email address');
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password.toString(), salt);

    const newUser = User({
      username,
      email,
      password: hash
    });
    await newUser.save();

    res.status(200).send('User Created Successfully');

  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).send('User Not Found');
    }

    const isCorrect = await bcrypt.compare(password.toString(), user.password);
    if (!isCorrect) {
      return res.status(400).send('Invalid Credentials');
    }

    const token = jwt.sign(
      { id: user._id, username: user.username, email: user.email },
      JWT_SECRET,
      {
        expiresIn: '1d',
      }
    );

    return res.status(200).json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};

exports.loginWithToken = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user.id });

    if (!user) {
      return res.status(404).send('User Not Found');
    }

    const token = jwt.sign(
      { id: user._id, username: user.username, email: user.email },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(200).json({
      user: {
        id: user._id,
        userName: user.username,
        email: user.email
      },
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
};