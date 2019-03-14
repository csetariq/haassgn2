/**
 * Environment specific configs
 */
var config = {}

config.staging = {
    httpPort: 3000,
    hashingKey: 'thisIsASecret',
    tokenLength: 20,
    cartIdLength: 20,
    tokenValidityInMillis: 1000 * 60 * 60
};

config.production = {
    httpPort: 5000,
    hashingKey: 'thisIsAnotherSecret',
    tokenLength: 20,
    cartIdLength: 30,
    tokenValidityInMillis: 1000 * 60 * 60
};

config.selected = typeof(process.env.NODE_ENV) == 'string' && typeof(config[process.env.NODE_ENV]) == 'object' ? config[process.env.NODE_ENV] : config.staging; 

module.exports = config.selected;
