// Simple local data store for optimization settings.
// This will dictate what optimization logic is enacted and on which deployments.

const redis = require('redis');

const client = redis.createClient({
    host: 'localhost',
    port: 1234
});

client.on('error', (error) => console.log('Redis Client Error', error));

client.connect();

module.exports = client