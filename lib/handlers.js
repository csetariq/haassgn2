/**
 * Master handler - This is where all other handlers are composed
 */

// Dependencies
var usersHandler = require('./users');
var tokensHandler = require('./tokens');

// Container
var handlers = {};

// Generic NOT_FOUND handler
handlers.notFound = function(data, callback) {
    callback(404);
};

handlers.users = usersHandler.handlerController;
handlers.tokens = tokensHandler.handlerController;

// Export
module.exports = handlers;
