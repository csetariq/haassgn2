/**
 * Users handler
 */

// Dependencies
var jsonData = require('./json_data');
var helpers = require('./helpers');

// Container
var handlers = {};

handlers.acceptableMethods = ['post', 'put', 'get', 'delete'];

handlers.handlerController =  function(data, callback) {
    if (handlers.acceptableMethods.indexOf(data.method) > -1) {
        handlers[data.method](data, callback);
    } else {
        callback(405);
    }
};

/**
 * Create an user if not exists
 * 
 * Required fields: name, email, address
 * Option fields:   none
 */
handlers.post = function(data, callback) {
    var name = typeof(data.payload.name) == 'string' && data.payload.name.trim().length > 0 ? data.payload.name.trim() : false;
    var email = typeof(data.payload.email) == 'string' && data.payload.email.trim().length > 0 && data.payload.email.trim().match(/\w+@\w+.\w+/) ? data.payload.email.trim().toLowerCase() : false;
    var address = typeof(data.payload.address) == 'string' && data.payload.address.trim().length > 0 ? data.payload.address.trim() : false;

    if (name && email && address) {
        var userData = {
            name: name,
            email: email,
            address: address
        };

        var userFileName = helpers.sanitizeEmail(email);

        jsonData.create('users', userFileName, userData, function(err) {
            if (!err) {
                callback(200, userData);
            } else {
                console.log('Unable to create file');
                callback(500, {error: 'Unable to create user'});
            }
        });
    } else {
        callback(400, 'Missing or invalid parameters');
    }
};

/**
 * Updates an existing user
 * 
 * Required Fields: email
 * Optional Fields: name, address (at least one of them must be present)
 */
handlers.put = function(data, callback) {
    var name = typeof(data.payload.name) == 'string' && data.payload.name.trim().length > 0 ? data.payload.name.trim() : false;
    var email = typeof(data.payload.email) == 'string' && data.payload.email.trim().length > 0 && data.payload.email.trim().match(/\w+@\w+.\w+/) ? data.payload.email.trim().toLowerCase() : false;
    var address = typeof(data.payload.address) == 'string' && data.payload.address.trim().length > 0 ? data.payload.address.trim() : false;

    if (email) {
        if (name && address) {
            var userFileName = helpers.sanitizeEmail(email);

            jsonData.read('users', userFileName, function(err, userData) {
                if (!err) {
                    if (name) {
                        userData.name = name;
                    }

                    if (address) {
                        userData.address = address;
                    }

                    jsonData.update('users', userFileName, userData, function(err) {
                        if (!err) {
                            callback(200, userData);
                        } else {
                            console.log('Unable to update an existing files');
                            callback(500, {error: 'Unable to update user'});
                        }
                    });
                } else {
                    callback(404, {error: 'User does not exist'});
                }
            });
        } else {
            callback(400, {error: 'At least one of the optional field must be present - name, address'});
        }
    } else {
        callback(400, {error: 'Required field is missing - email'});
    }
};

/**
 * Get an existing user
 * 
 * Required fields - email
 * Optional fields - none
 */
handlers.get = function(data, callback) {
    var email = typeof(data.queryStringObject.email) == 'string' && data.queryStringObject.email.trim().length > 0 ? data.queryStringObject.email.trim().toLowerCase() : false;

    if (email) {
        var userFileName = helpers.sanitizeEmail(email);

        jsonData.read('users', userFileName, function(err, userData) {
            if (!err && userData) {
                callback(200, userData);
            } else {
                callback(400, {error: 'User does not exist'});
            }
        });
    } else {
        callback(400, {error: 'Required query param is missing - email'});
    }
};

/**
 * Delete an existing user
 * 
 * Required fields - email
 * Optional fields - none
 */
handlers.delete = function(data, callback) {
    var email = typeof(data.queryStringObject.email) == 'string' && data.queryStringObject.email.trim().length > 0 ? data.queryStringObject.email.trim().toLowerCase() : false;

    if (email) {
        var userFileName = helpers.sanitizeEmail(email);

        jsonData.read('users', userFileName, function(err, userData) {
            if (!err && userData) {
                jsonData.delete('users', userFileName, function(err) {
                    if (!err) {
                        callback(200);
                    } else {
                        callback(500, {error: 'Unable to delete an exising user'});
                    }
                });
            } else {
                callback(404, {error: 'User does not exist'});
            }
        });
    } else {
        callback(400, {error: 'Required query param is missing - email'});
    }
};

// Export
module.exports = handlers;
