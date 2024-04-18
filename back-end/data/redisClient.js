// Simple local data store for optimization settings.
// This will dictate what optimization logic is enacted and on which deployments.

const redis = require('redis');

console.log('Redis Host:', process.env.REDIS_HOST);
console.log('Redis Port:', process.env.REDIS_PORT);

const client = redis.createClient({
    socket: {
        port: process.env.REDIS_PORT,
        host: process.env.REDIS_HOST
    }
});

client.on('connect', () => console.log('Connected to Redis'));
client.on('error', (error) => console.log('Redis Client Error', error));

client.connect();

module.exports = client