# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

## Official Plugins

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md): Uses [Babel](https://babeljs.io/) for Fast Refresh.
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc): Uses [SWC](https://swc.rs/) for Fast Refresh.

## Environment Setup

Create a `.env` file in the root directory with the following variables:

```env
VITE_NODE_ENV=development
VITE_BASE_URL=http://localhost:5000/api/
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

- **Start the development server:**
  ```bash
  npm run dev
  ```
  Runs the development server with Vite. Use this command to start your development environment.

- **Build the application for production:**
  ```bash
  npm run build
  ```
  Creates an optimized version of the app in the `dist` folder.

- **Run ESLint:**
  ```bash
  npm run lint
  ```
  Analyzes the code for errors and enforces code quality. Reports unused directives and sets `max-warnings` to zero.

- **Preview the production build:**
  ```bash
  npm run preview
  ```
  Previews the production build using Vite. Use this script to test the build locally before deployment.

## Features

- **Fast Development:** Hot Module Replacement (HMR) for a smooth development experience.
- **Modern Build Tool:** Uses Vite for fast and efficient builds.
- **Code Quality:** ESLint integration to ensure clean and maintainable code.
- **Environment Variables:** Supports `.env` files for environment-specific configurations.

## Dependencies

### Core Dependencies

- **@reduxjs/toolkit:** State management library for Redux.
- **axios:** Promise-based HTTP client for making API requests.
- **fabric:** Canvas library for creating and managing graphics.
- **mdb-react-ui-kit:** UI components for React.
- **react:** React library.
- **react-cookie:** Library for handling cookies in React.
- **react-dom:** React DOM utilities.
- **react-dotenv:** Allows using environment variables in React.
- **react-razorpay:** Razorpay integration library for React.
- **react-redux:** Bindings for React and Redux.
- **socket.io-client:** Real-time communication library.
- **sonner:** Notifications for React applications.
- **universal-cookie:** Universal cookie management library.
- **uuid:** For generating unique identifiers.
- **tailwindcss:** Utility-first CSS framework.

### Development Dependencies

- **@types/react:** TypeScript types for React.
- **@types/react-dom:** TypeScript types for React DOM.
- **@vitejs/plugin-react:** Vite plugin for React.
- **autoprefixer:** PostCSS plugin to add vendor prefixes to CSS.
- **eslint:** Linter for identifying and reporting code issues.
- **eslint-plugin-react:** ESLint plugin for React-specific linting.
- **eslint-plugin-react-hooks:** ESLint plugin for React hooks.
- **eslint-plugin-react-refresh:** ESLint plugin for React Fast Refresh.
- **postcss:** Tool for transforming CSS.
- **vite:** Build tool for modern web projects.

## Project Structure

```
├── src/            # Source files for the application
├── public/         # Static assets
├── vite.config.js  # Vite configuration
├── .eslintrc.js    # ESLint configuration
├── .env            # Environment variables
└── package.json    # Project metadata and scripts
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

For any queries or suggestions, contact the me at shahbazalam92399@gmail.com.

