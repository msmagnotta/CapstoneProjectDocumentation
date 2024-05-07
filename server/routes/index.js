/**
 * @file Defines routes for the application's index page.
 * @module indexRouter
 */

const express = require('express');
const router = express.Router();

/**
 * Route for serving the home page.
 * @name GET/
 * @function
 * @memberof module:indexRouter
 * @inner
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
router.get('/', function(req, res, next) {
  res.send('It is working')
});

module.exports = router;
