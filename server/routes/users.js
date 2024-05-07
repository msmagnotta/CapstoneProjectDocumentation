/**
 * @file Defines routes for managing users.
 * @module usersRouter
 */

const express = require('express');
const router = express.Router();

/**
 * Route for retrieving user information.
 * @name GET/users
 * @function
 * @memberof module:usersRouter
 * @inner
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
