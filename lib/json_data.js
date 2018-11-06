/**
 * Handles IO of JSON files 
 */

// Dependencies
var fs = require('fs');
var path = require('path');
var helpers = require('./helpers');

//  Container
var lib = {};

// Base directory where all data are stored
lib.baseDir = path.join(__dirname, '..', '.data');

// Create a file if not exists
lib.create = function(targetDir, targetFileName, jsonObject, callback) {
    var absolutePath = path.join(lib.baseDir, targetDir, helpers.asJsonFile(targetFileName));

    fs.open(absolutePath, 'wx', function(err, fileDescriptor) {
        if (!err && fileDescriptor) {
            var stringData = JSON.stringify(jsonObject);
            fs.writeFile(fileDescriptor, stringData, function(err) {
                if (!err) {
                    fs.close(fileDescriptor, function(err) {
                        if (!err) {
                            callback(false);
                        } else {
                            callback('Error closing the new file');
                        }
                    });
                } else {
                    callback('Error writing to new file');
                }
            });
        } else {
            callback('Error opening new file for writing - it may already exist');
        }
    });
};

// Update a file only if exists
lib.update = function(targetDir, targetFileName, jsonObject, callback) {
    var absolutePath = path.join(lib.baseDir, targetDir, helpers.asJsonFile(targetFileName));

    fs.open(absolutePath, 'r+', function(err, fileDescriptor) {
        if (!err && fileDescriptor) {

            fs.truncate(fileDescriptor, function(err) {
                if (!err) {
                    var stringData = JSON.stringify(jsonObject);
                    fs.writeFile(fileDescriptor, stringData, function(err) {
                        if (!err) {
                            fs.close(fileDescriptor, function(err) {
                                if (!err) {
                                    callback(false);
                                } else {
                                    callback('Error closing the file');
                                }
                            });
                        } else {
                            callback('Error writing to file');
                        }
                    });
                } else {
                    callback('Unable to truncate exising file');
                }
            });
        } else {
            callback('Error updating - File doesn\'t exist already');
        }
    });
};

// Read an existing file
lib.read = function(targetDir, targetFileName, callback) {
    var absolutePath = path.join(lib.baseDir, targetDir, helpers.asJsonFile(targetFileName));

    fs.open(absolutePath, 'r', function(err, fileDescriptor) {
        if (!err && fileDescriptor) {
            fs.readFile(fileDescriptor, function(err, data) {
                if (!err && data) {
                    var jsonData = helpers.parseJsonToObject(data);
                    fs.close(fileDescriptor, function(err) {
                        if (!err) {
                            callback(false, jsonData);
                        } else {
                            callback('Error closing the file after reading');
                        }
                    });
                } else {
                    callback('Error reading from file');
                }
            });
        } else {
            callback('Error reading - File doesn\'t exist already');
        }
    });
};

// Delete an existing file
lib.delete = function(targetDir, targetFileName, callback) {
    var absolutePath = path.join(lib.baseDir, targetDir, helpers.asJsonFile(targetFileName));

    fs.unlink(absolutePath, function(err) {
        if (!err) {
            callback(false);
        } else {
            callback('Unable to delete file');
        }
    });
};

// Export
module.exports = lib;
