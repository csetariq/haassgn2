/**
 * Helper functions
 */

// Dependencies
var util = require('util');
var fs = require('fs');
var path = require('path');
var crypto = require('crypto');
var config = require('./config');

// Container
var helpers = {};

// Convert JSON string to Object
helpers.parseJsonToObject = function(jsonString) {
    try {
        var object = JSON.parse(jsonString);
        return object;
    } catch (err) {
        return {};
    }
};

// Sanitize email address - remove non alpha-numeric characters
helpers.sanitizeEmail = function(email) {
    return email.replace(/[^a-z0-9]/g, '');
}

// Convert to name of JSON file
helpers.asJsonFile = function(fileName) {
    return util.format('%s.json', fileName);
}

// Generate random alpha-numeric key of given length
helpers.generateRandomString = function(stringLength) {
    if (typeof(stringLength) == 'number' && stringLength > 0 ? stringLength : false) {
        var possibleChars = 'abcdefghijklmnopqrtuvwxyz0123456789';
    
        var randomKey = [];
        for (var i = 0; i < stringLength; ++i) {
            randomKey.push(possibleChars[Math.floor(Math.random() * possibleChars.length)]);
        }
    
        return randomKey.join('');
    } else {
        return false;
    }
    
};

// Digest to SHA-256 hash
helpers.hash = function(stringData) {
    if (typeof(stringData) == 'string' && stringData.length > 0) {
        var hash = crypto.createHmac('sha256', config.hashingKey).update(stringData).digest('hex');
        return hash;
    } else {
        return false;
    }
};

// Create data directory
helpers.createDirectories = function() {
    var dataDir = path.join(__dirname, '..', '.data');
    fs.mkdir(dataDir, function(err) {
        var usersDir = path.join(dataDir, 'users');
        fs.mkdir(usersDir, function(err) {});
        var tokensDir = path.join(dataDir, 'tokens');
        fs.mkdir(tokensDir, function(err) {});
        var cartsDir = path.join(dataDir, 'carts');
        fs.mkdir(cartsDir, function(err) {});
    });
}

// Export
module.exports = helpers;
