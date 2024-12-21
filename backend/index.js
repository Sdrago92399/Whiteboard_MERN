const mongoose = require('mongoose');
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const boardRoutes = require('./routes/boardRoutes');
const { errorHandler } = require('./middleware/errorMiddleware');
const apiLimiter = require('./middleware/rateLimiter');
const logger = require('./middleware/logger');
const connectDB = require('./config/db');
const { initializeIo } = require('./config/io'); 

dotenv.config();
connectDB();

const app = express();

app.use(express.json());
app.use(logger);
//app.use(apiLimiter);
app.use(cors());

app.use('/api/auth', authRoutes);
app.use('/api/whiteboards', boardRoutes);

app.use(errorHandler);

const server = initializeIo(app, {
  origin: process.env.FRONTEND_URL,
});

// Listening to server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});