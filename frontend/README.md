# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

## Official Plugins

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md): Uses [Babel](https://babeljs.io/) for Fast Refresh.
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc): Uses [SWC](https://swc.rs/) for Fast Refresh.

## Environment Setup

Add the following environment variables in a `.env` file at the root of your project:

```env
VITE_NODE_ENV=development
VITE_BASE_URL=http://localhost:5000/api/
```

## Scripts

Here are the scripts extracted from the `package.json` file:

- **`dev`**: Runs the development server with Vite. Use this command to start your development environment.
  ```bash
  npm run dev
  ```

- **`build`**: Builds the application for production. This creates an optimized version of the app in the `dist` folder.
  ```bash
  npm run build
  ```

- **`lint`**: Runs ESLint to analyze the code for errors and enforce code quality. This script ensures unused directives are reported and sets `max-warnings` to zero.
  ```bash
  npm run lint
  ```

- **`preview`**: Previews the production build using Vite. Use this script to test the build locally before deployment.
  ```bash
  npm run preview
  ```

## Dependencies

### Core Dependencies

- `@reduxjs/toolkit`: State management library for Redux.
- `axios`: Promise-based HTTP client for making API requests.
- `fabric`: Canvas library for creating and managing graphics.
- `mdb-react-ui-kit`: UI components for React.
- `react`: React library.
- `react-cookie`: Library for handling cookies in React.
- `react-dom`: React DOM utilities.
- `react-dotenv`: Allows using environment variables in React.
- `react-razorpay`: Razorpay integration library for React.
- `react-redux`: Bindings for React and Redux.
- `socket.io-client`: Real-time communication library.
- `sonner`: Notifications for React applications.
- `universal-cookie`: Universal cookie management library.
- `uuid`: For generating unique identifiers.
- `tailwindcss`: Utility-first CSS framework.

### Development Dependencies

- `@types/react`: TypeScript types for React.
- `@types/react-dom`: TypeScript types for React DOM.
- `@vitejs/plugin-react`: Vite plugin for React.
- `autoprefixer`: PostCSS plugin to add vendor prefixes to CSS.
- `eslint`: Linter for identifying and reporting code issues.
- `eslint-plugin-react`: ESLint plugin for React-specific linting.
- `eslint-plugin-react-hooks`: ESLint plugin for React hooks.
- `eslint-plugin-react-refresh`: ESLint plugin for React Fast Refresh.
- `postcss`: Tool for transforming CSS.
- `vite`: Build tool for modern web projects.
