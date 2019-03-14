/**
 * Carts handler
 */

// Dependencies
var jsonData = require('./json_data');
var helpers = require('./helpers');
var tokens = require('./tokens');
var config = require('./config');
var menu = require('./menu_list');

// Container
var handlers = {};

handlers.acceptableMethods = ['put', 'get', 'delete'];

handlers.handlerController =  function(data, callback) {
    if (handlers.acceptableMethods.indexOf(data.method) > -1) {
        handlers[data.method](data, callback);
    } else {
        callback(405);
    }
};

/**
 * Create/Update a shopping cart
 * 
 * Required Fields: token
 */
handlers.put = function(data, callback) {
    var token = typeof(data.headers.token) === 'string' && data.headers.token.trim().length > 0 && data.headers.token.length === config.tokenLength ? data.headers.token.trim() : false;
    if (token) {
        tokens.getUser(token, function(email) {
            if (email) {
                var orders = typeof(data.payload.orders) === 'object' && data.payload.orders.length && data.payload.orders.length > 0 ? data.payload.orders : false;
                
                var cartId = typeof(data.payload.id) == 'string' && data.payload.id.trim().length > 0 ? data.payload.id.trim().toLowerCase() : false;
                if (cartId) {
                    // Update the existing order
                    jsonData.read('carts', cartId, function(err, cartData) {
                        if (err) {
                            callback(400, {error: err});
                        } else {
                            validateAndComputeOrders(orders, function(err, total) {
                                if (err) {
                                    callback(400, {error: err});
                                } else {
                                    var updatedCartData = {
                                        id: cartId,
                                        email: email,
                                        orders: orders,
                                        total: total,
                                        ts: Date.now()
                                    }
                                    jsonData.update('carts', cartId, updatedCartData, function(err) {
                                        if (err) {
                                            callback(500, {error: err});
                                        } else {
                                            delete updatedCartData.email;
                                            delete updatedCartData.ts;
                                            callback(200, updatedCartData);
                                        }
                                    });
            
                                }
                            });
                        }
                    });
                } else {
                    // Create new order
                    var cartId = helpers.generateRandomString(config.cartIdLength);
                    
                    validateAndComputeOrders(orders, function(err, total) {
                        if (err) {
                            callback(400, {error: err});
                        } else {
                            var cartData = {
                                id: cartId,
                                email: email,
                                orders: orders,
                                total: total,
                                ts: Date.now()
                            }
                            jsonData.create('carts', cartId, cartData, function(err) {
                                if (err) {
                                    callback(500, {error: err});
                                } else {
                                    delete cartData.email;
                                    delete cartData.ts;
                                    callback(200, cartData);
                                }
                            });
    
                        }
                    });
                }
            } else {
                callback(401, {error: 'Invalid token'});        
            }
        });
    } else {
        callback(401, {error: 'Invalid token or token not present in the request'});
    }

};

function validateAndComputeOrders(orders, callback) {
    if (!orders) {
        callback('Order list empty');
    } else {
        var total = 0.0;
        var errorProcessing = false;
        orders.forEach(order => {
            var orderName = typeof(order.name) === 'string' && order.name.trim().length > 0 ? order.name.trim() : false;
            var orderQuantity = typeof(order.quantity) === 'number' && order.quantity > 0 ? order.quantity : false;

            if (!orderName || !orderQuantity) {
                callback('Invalid order!' + ' name = >>' + order.name + '<<; quantity = >>' + order.quantity + '<<');
                errorProcessing = true;
            } else {
                var menuItem = menu.find(menuItem => menuItem.name === orderName);
    
                if (!menuItem) {
                    callback('Menu item could not be found');
                    errorProcessing = true;
                } else {
                    total += menuItem.price * orderQuantity;
                }
            }
        });
        if (!errorProcessing) {
            callback(false, total.toFixed(2));
        }
    }
}

/**
 * Get an existing cart
 * 
 * Required Fields - cartId
 */
handlers.get = function(data, callback) {
    var token = typeof(data.headers.token) === 'string' && data.headers.token.trim().length > 0 && data.headers.token.length === config.tokenLength ? data.headers.token.trim() : false;
    var cartId = typeof(data.queu)
    if (token) {
        token.getUser(token, function(email) {
            if(email) {

            } else {
                callback(401, {error: 'Invalid token'});
            }
        });
    } else {
        callback(401, {error: 'Invalid token or token not present in the request'});
    }
}

// Export
module.exports = handlers;
