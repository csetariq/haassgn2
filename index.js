/**
 * Entry point
 */

//  Dependencies
var server = require('./lib/server');

// Container
var app = {};

app.start = function() {
    server.start();
};

// Start the app
app.start();

// Export
module.exports = app;