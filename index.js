/**
 * Entry point
 */

//  Dependencies
var helpers = require('./lib/helpers');
var server = require('./lib/server');

// Container
var app = {};

app.start = function() {
    helpers.createDirectories();
    server.start();
};

// Start the app
app.start();

// Export
module.exports = app;