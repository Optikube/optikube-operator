// Performs functions like saving optimization settings for redis cache.

const redisClient = require('../data/redisClient');

class SettingsService {
    // Method to save or update optimization settings
    async saveOptimizationSettings(namespace, deploymentName, settings, optimizeFlag) {
        const key = `namespace:${namespace}:deloyment:${deploymentName}`;
        const value = JSON.stringify({ settings, optimize: optimizeFlag});
        await redisClient.set(key, value);
        return { success: true };
    }

    // Retrieves current optimization - potential need for front end displayer as well as when scheduled optimization occurs.
    async getOptimizationSettings(namespace, deploymentName) {
        const key = `namespace:${namespace}:deployment:${deploymentName}`;
        const result = await redisClient.get(key);
        return result ? JSON.parse(result) : null;
    }

    async listDeploymentsForOptimization(namespace) {
        const pattern = `namespace:${namespace}:deployment:*`;
        const keys = await redisClient.keys(pattern);
        const deployments = [];
        for (const key of keys) {
            const value = await redisClient.get(key);
            const { settings, optimize } = JSON.parse(value);
            if (optimize) {
                const [, , , deploymentName] = key.split(':'); // Extract deployment name from key
                deployments.push({ deploymentName, settings });
            }
        }
        return deployments;
    }

    async deleteOptimizationSettings(namespace, deploymentName) {
        const key = `namespace:${namespace}:deployment:${deploymentName}`;
        const result = await redisClient.del(key);
        return { success: true };
    }
}

module.exports = new SettingsService();
