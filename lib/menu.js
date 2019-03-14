
// dependencies
var tokens = require('./tokens');
var menu = require('./menu_list');

var handlers = {}

handlers.acceptableMethods = ['get'];

handlers.handlerController =  function(data, callback) {
    if (handlers.acceptableMethods.indexOf(data.method) > -1) {
        handlers[data.method](data, callback);
    } else {
        callback(405);
    }
};

handlers.get = function(data, callback) {
    var token = typeof(data.headers.token) == 'string' ? data.headers.token : false;
    tokens.getUser(token, function(email) {
        if (email) {
            console.log('Served menu list to ' + email);
            callback(200, menu);
        } else {
            callback(401, 'Unauthorized to access the service');
        }
    });
};

module.exports = handlers;