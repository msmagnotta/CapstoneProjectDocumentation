/**
 * @file This is the main entry point of the client application.
 * @module index
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

/**
 * Root element to render the React application.
 * @type {ReactDOM.Root}
 */
const root = ReactDOM.createRoot(document.getElementById('root'));

/**
 * Render the application.
 * @param {React.ReactElement} component - The root React component of the application.
 */
const renderApp = (component) => {
  root.render(
    <React.StrictMode>
      {component}
    </React.StrictMode>
  );
};

// Render the main application
renderApp(<App />);

/**
 * Measure and report web vital performance metrics.
 * @see {@link https://bit.ly/CRA-vitals} More information about measuring performance.
 */
reportWebVitals();