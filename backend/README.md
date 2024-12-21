# Whiteboard Backend

This is the backend for the Whiteboard project, built with Node.js, Express, and MongoDB. It includes functionality for authentication, database interactions, real-time communications, and more.

## Environment Setup

Create a `.env` file in the root directory with the following variables:

```env
FRONTEND_URL=http://localhost:5173
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/amogus
JWT_SECRET=yee
```

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <repository-folder>
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Scripts

- **Start the server:**
  ```bash
  npm start
  ```
  Starts the server using `node server.js`.

- **Start the server in development mode:**
  ```bash
  npm run dev
  ```
  Starts the server using `nodemon` for auto-reloading.

- **Run ESLint:**
  ```bash
  npm run lint
  ```
  Lints the codebase using ESLint.

## Features

- **Authentication:** Uses `jsonwebtoken` for secure user authentication.
- **Database:** Integrates with MongoDB using `mongoose` for database management.
- **Real-time Communication:** Supports WebSocket communication using `socket.io`.
- **Request Limiting:** Implements rate limiting with `express-rate-limit`.
- **Logging:** Provides HTTP request logging with `morgan`.
- **Security:** Uses `bcrypt` for password hashing.

## Dependencies

### Production Dependencies

- **bcrypt:** For hashing passwords.
- **cors:** For enabling Cross-Origin Resource Sharing.
- **dotenv:** For environment variable management.
- **express:** For server and API creation.
- **express-rate-limit:** For rate limiting.
- **jsonwebtoken:** For token-based authentication.
- **mongoose:** For MongoDB connection and data modeling.
- **morgan:** For HTTP request logging.
- **socket.io:** For real-time, bidirectional communication.

### Development Dependencies

- **@eslint/js:** For JavaScript linting.
- **eslint:** Core ESLint package.
- **globals:** Shared settings for global variables.
- **nodemon:** For automatic server reloading during development.

## Project Structure

```
├── server.js      # Entry point for the backend server
├── routes/        # Contains all API route handlers
├── models/        # MongoDB models
├── controllers/   # Logic for handling API requests
├── middleware/    # Custom middleware functions
├── utils/         # Utility functions
├── config/        # Configuration files
└── .env           # Environment variables (not included in the repository)
```

## Contributing

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature-branch-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Description of changes"
   ```
4. Push to the branch:
   ```bash
   git push origin feature-branch-name
   ```
5. Open a pull request.

## License

This project is licensed under the ISC License.

---

For any queries or suggestions, contact the author at shahbazalam92399@gmail.com.

