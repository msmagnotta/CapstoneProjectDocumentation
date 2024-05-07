/**
 * @file Represents the User class used to create user objects.
 * @module User
 */

/**
 * Represents a user in the application.
 * @class
 */
class User {
    /**
     * Create a new user.
     * @constructor
     * @param {string} username - The username of the user.
     * @param {string} session_id - The session ID of the user.
     */
    constructor(username, session_id) {
        this.username = username;
        this.session_id = session_id;
    }
}

// Export the User class
module.exports = User;
