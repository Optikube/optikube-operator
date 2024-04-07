// Performs functions like saving optimization settings for redis cache.

const redisClient = require('../data/redisClient');

class SettingsService {
    // Method to save or update optimization settings
    async updateOptimizationSettings(namespace, deploymentName, settings, optimizeFlag) {
        try {
            const key = `namespace:${namespace}:deployment:${deploymentName}`;
            const value = JSON.stringify({ settings, optimize: optimizeFlag});
            const result = await redisClient.set(key, value);
            // In redis if the set method is successful it returns  "OK".
            return { success: result === 'OK', log: 'Optimization settings successfully updated.' };
        } catch (error) {
            console.error(`Error saving optimization settings for ${key}`, error)
            return { succes: false, error: error.message}
        }
    }

    // Retrieves current optimization - potential need for front end displayer as well as when scheduled optimization occurs.
    async getOptimizationSettings(namespace, deploymentName) {
        try {
            const key = `namespace:${namespace}:deployment:${deploymentName}`;
            const result = await redisClient.get(key);
            // In redis if the get method yields no results it return nulls.
            return result ? JSON.parse(result) : null;
        } catch (error) {
            console.error(`Error fetching optimization settings for ${key}`, error)
            return { succes: false, error: error.message }
        }
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
    // Deletes existing optimization settings - will work in tandem with deleting KEDA Scaled Object. 
    async deleteOptimizationSettings(namespace, deploymentName) {
        try {
            const key = `namespace:${namespace}:deployment:${deploymentName}`;
            const result = await redisClient.del(key);
            // In redis if the del method works it returns the number of keys deleted, in this case 1.
            return { success: result === 1, log: 'Optimization settings successfully deleted.'  };
        } catch (error) {
            console.error(`Error deleting optimization settings for ${key}`, error)
            return { succes: false, error: error.message}
        }
    }
}

module.exports = new SettingsService();
