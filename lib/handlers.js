/**
 * Master handler - This is where all other handlers are composed
 */

// Dependencies
var usersHandler = require('./users');

// Container
var handlers = {};

// Generic NOT_FOUND handler
handlers.notFound = function(data, callback) {
    callback(404);
};

handlers.users = usersHandler.handlerController;

// Export
module.exports = handlers;
