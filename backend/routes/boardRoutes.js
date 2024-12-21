const express = require('express');
const {
  newBoard,
  getBoards
} = require('../controllers/boardController');
const router = express.Router();
const { verifyToken } = require("../middleware/authMiddleware");

router.post('/new', verifyToken, newBoard);
router.get('/', verifyToken, getBoards);

module.exports = router;
