const express = require('express');
const {
  signup,
  login,
  loginWithToken
} = require('../controllers/authController');
const router = express.Router();
const { verifyToken } = require("../middleware/authMiddleware");

router.post('/signup', signup);
router.post('/login', login);
router.post('/token', verifyToken, loginWithToken);

module.exports = router;
