/**
 * Master handler - This is where all other handlers are composed
 */

// Dependencies
var usersHandler = require('./users');
var tokensHandler = require('./tokens');
var menuHandler = require('./menu');
var cartsHandler = require('./carts');

// Container
var handlers = {};

// Generic NOT_FOUND handler
handlers.notFound = function(data, callback) {
    callback(404);
};

handlers.users = usersHandler.handlerController;
handlers.tokens = tokensHandler.handlerController;
handlers.menu = menuHandler.handlerController;
handlers.carts = cartsHandler.handlerController;

// Export
module.exports = handlers;
