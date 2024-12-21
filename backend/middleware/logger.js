const fs = require('fs');
const path = require('path');
const morgan = require('morgan');

// Define the directory and file path
const logsDir = path.join(__dirname, '../logs');
const logFilePath = path.join(logsDir, 'access.log');

// Create the directory if it doesn't exist
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Create the file stream for logging
const accessLogStream = fs.createWriteStream(logFilePath, { flags: 'a' });

// Set up the logger
const logger = morgan('combined', { stream: accessLogStream });

module.exports = logger;
