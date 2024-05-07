/**
 * @file This module reports web vital performance metrics.
 * @module reportWebVitals
 */

/**
 * Reports web vital performance metrics.
 * @function
 * @param {Function} onPerfEntry - Callback function to handle performance entries.
 * @example
 * // Example usage:
 * reportWebVitals(console.log);
 */
const reportWebVitals = onPerfEntry => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
    });
  }
};

export default reportWebVitals;