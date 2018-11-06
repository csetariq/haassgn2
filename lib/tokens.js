/**
 * Token handler
 */

// Dependencies
var jsonData = require('./json_data');
var helpers = require('./helpers');

// Container
var handlers = {};

handlers.baseDir = 'tokens';

handlers.acceptableMethods = ['post', 'put', 'get', 'delete'];

handlers.handlerController =  function(data, callback) {
    if (handlers.acceptableMethods.indexOf(data.method) > -1) {
        handlers[data.method](data, callback);
    } else {
        callback(405);
    }
};

/**
 * Create new token
 * 
 * Required fields - email, password
 * Optional fields - none
 */
handlers.post = function(data, callback) {
    var email = typeof(data.payload.email) == 'string' && data.payload.email.trim().length > 0 ? data.payload.email.trim() : false;
    var password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;

    if (email && password) {
        var userFileName = helpers.sanitizeEmail(email);

        jsonData.read('users', userFileName, function(err, userData) {
            if (!err && userData) {
                var hashedPassword = helpers.hash(password);
                if (hashedPassword == userData.password) {
                    var tokenData = {
                        id: helpers.generateRandomString(20),
                        email: email,
                        expires: Date.now() + 1000 * 60 * 60
                    };

                    jsonData.create('tokens', tokenData.id, tokenData, function(err) {
                        if (!err) {
                            callback(200, tokenData);
                        } else {
                            callback(500, {error: 'Unable to store token in new file'});
                        }
                    });
                } else {
                    callback(401, {error: 'Unauthorized - incorrect password'});
                }
            } else {
                callback(404, {error: 'User does not exists'});
            }
        });
    } else {
        callback(400, {error: 'Missing or invalid parameters'});
    }
};

/**
 * Extends token expiry
 * 
 * Required fields: id, extend
 * Optional fields: none
 */
handlers.put = function(data, callback) {
    var id = typeof(data.payload.id) == 'string' && data.payload.id.trim().length == 20 ? data.payload.id.trim() : false;
    var extend = typeof(data.payload.extend) == 'boolean' ? data.payload.extend : false;

    if (id && extend) {
        jsonData.read('tokens', id, function(err, tokenData) {
            if (!err && tokenData) {
                tokenData.expires = Date.now() + 1000 * 60 * 60;
                jsonData.update('tokens', id, tokenData, function(err) {
                    if (!err) {
                        callback(200, tokenData);
                    } else {
                        callback(500, {error: 'Unable to update token file'});
                    }
                });
            } else {
                callback(404, {error: 'Token does not exists'});
            }
        });
    } else {
        callback(400, {error: 'Missing or invalid parameters'});
    }
};

handlers.get = function(data, callback) {
    var id = typeof(data.queryStringObject.id) == 'string' && data.queryStringObject.id.trim().length == 20 ? data.queryStringObject.id.trim() : false;

    if (id) {
        jsonData.read('tokens', id, function(err, tokenData) {
            if (!err && tokenData) {
                callback(200, tokenData);
            } else {
                callback(404, {error: 'Token not found'});
            }
        });
    } else {
        callback(400, {error: 'Missing or invalid parameter - id'});
    }
};

handlers.delete = function(data, callback) {
    var id = typeof(data.queryStringObject.id) == 'string' && data.queryStringObject.id.trim().length == 20 ? data.queryStringObject.id.trim() : false;

    if (id) {
        jsonData.read('tokens', id, function(err, tokenData) {
            if (!err && tokenData) {
                jsonData.delete('tokens', id, function(err) {
                    if (!err) {
                        callback(200);
                    } else {
                        callback(500, {error: 'Unable to delete token file'});
                    }
                });
            } else {
                callback(404, {error: 'Token not found'});
            }
        });
    } else {
        callback(400, {error: 'Missing or invalid parameter - id'});
    }
};

handlers.verifyToken = function(id, email, callback) {
    jsonData.read('tokens', id, function(err, tokenData) {
        if (!err, tokenData) {
            if (email == tokenData.email && tokenData.expires > Date.now()) {
                callback(true);
            } else {
                callback(false);
            }
        } else {
            callback(false);
        }
    });
};

// Export
module.exports = handlers;
