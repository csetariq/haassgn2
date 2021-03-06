/**
 * The HTTP server
 */

// Dependecies
var http = require('http');
var url = require('url');
var StringDecoder = require('string_decoder').StringDecoder;
var helpers = require('./helpers');
var handlers = require('./handlers');
var config = require('./config');

// Container
var server = {};

// Instantiate HTTP
server.httpServer = http.createServer(function(req, res) {
    server.unifiedServer(req, res);
});

// Generic request handler
server.unifiedServer = function(req,res) {
    var parsedUrl = url.parse(req.url, true);
    var path = parsedUrl.pathname;
    var trimmedPath = path.replace(/^\/+|\/+$/g, '');
    var queryStringObject = parsedUrl.query;
    var method = req.method.toLowerCase();
    var headers = req.headers;
    var decoder = new StringDecoder('utf-8');

    var buffer = '';

    req.on('data', function(data) {
        buffer += decoder.write(data);
    });

    req.on('end', function() {
        buffer += decoder.end();

        var chosenHandler = typeof(server.router[trimmedPath]) !== 'undefined' ? server.router[trimmedPath] : handlers.notFound;

        var data = {
            'trimmedPath' : trimmedPath,
            'queryStringObject' : queryStringObject,
            'method' : method,
            'headers' : headers,
            'payload' : helpers.parseJsonToObject(buffer)
        };

        chosenHandler(data, function(statusCode, payload) {

            statusCode = typeof(statusCode) == 'number' ? statusCode : 200;

            payload = typeof(payload) == 'object' ? payload : {};

            var payloadString = JSON.stringify(payload);

            res.setHeader('Content-Type', 'application/json');
            res.writeHead(statusCode);
            res.end(payloadString);
        });
    });
};

// Router configuration
server.router = {
    'users': handlers.users,
    'tokens': handlers.tokens,
    'menu': handlers.menu,
    'carts': handlers.carts
}

// Start the HTTP server
server.start = function() {
    server.httpServer.listen(config.httpPort, function() {
        console.log('Server started listening on', config.httpPort);
    });
}

// Export
module.exports = server;
