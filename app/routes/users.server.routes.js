/*
 * users.server.routes.js
 * ----------------------
 *
 * This file contains the definitions for the REST API
 * routes. Each route has seeks a function from the
 * user controller or another node module and assigns
 * that function to an HTTP verb.
 *
 */

// Invoke 'strict' JavaScript mode
'use strict';

const users    = require('../../app/controllers/users.server.controller'),
      passport = require('passport');

// Define the routes' module method
module.exports = function(app) {
    // Define the '/users' route
    app.route('/users')
       .get(users.auth, users.list)
       .post(users.register);

    // Define the '/users/login' route
    app.route('/users/login')
       .post(users.login);

    app.route('/users/logout')
       .get(users.logout)
       .post(users.logout);

    app.route('/users/validate_email')
       .post(users.validateEmail);
};