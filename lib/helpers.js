/**
 * Helper functions
 */

// Dependencies
var util = require('util');

// Container
var lib = {};

// Convert JSON string to Object
lib.parseJsonToObject = function(jsonString) {
    try {
        var object = JSON.parse(jsonString);
        return object;
    } catch (err) {
        return {};
    }
};

// Sanitize email address - remove non alpha-numeric characters
lib.sanitizeEmail = function(email) {
    return email.replace(/[^a-z0-9]/g, '');
}

// Convert to name of JSON file
lib.asJsonFile = function(fileName) {
    return util.format('%s.json', fileName);
}

// Export
module.exports = lib;
