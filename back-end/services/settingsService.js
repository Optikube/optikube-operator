// Performs functions like saving optimization settings for redis cache.

const redisClient = require('../data/redisClient');

class SettingsService {
    // Method to save or update optimization settings
    async updateOptimizationSettings(namespace, deploymentName, settings, optimizationScore, optimizeFlag) {
        try {
            const key = `namespace:${namespace}:deployment:${deploymentName}`;
            const globalOptimizeSetKey = `global:optimization_deployments`

            const value = JSON.stringify({ settings, optimizationScore, optimize: optimizeFlag, });
            const result = await redisClient.set(key, value);

            const qualifiedDeploymentName = `${namespace}:${deploymentName}`;

            if (optimizeFlag) {
                await redisClient.sAdd(globalOptimizeSetKey, qualifiedDeploymentName)
            }

            if (!optimizeFlag) {
                await redisClient.sRem(globalOptimizeSetKey, qualifiedDeploymentName)
            }

            // In redis if the set method is successful it returns  "OK".
            return { success: result === 'OK', log: 'Optimization settings successfully updated.' };
        } catch (error) {
            console.error(`Error saving optimization settings for ${key}`, error)
            return { success: false, error: error.message}
        }
    }
    // Retrieves current optimization - potential need for front end displayer as well as when scheduled optimization occurs.
    async getOptimizationSettings(namespace, deploymentName) {
        try {
            const key = `namespace:${namespace}:deployment:${deploymentName}`;
            const globalOptimizeSetKey = `global:optimization_deployments`;
            const targetDeploymentName = `${namespace}:${deploymentName}`;

            const result = await redisClient.get(key);
            const isInGlobalOptimizeSet = await redisClient.smIsMember(globalOptimizeSetKey, targetDeploymentName);
            // In redis if the get method yields no results it return nulls.
            const settings = result ? JSON.parse(result) : null;
            return {
                settings: settings,
                isInGlobalOptimizeSet: isInGlobalOptimizeSet,
            }
        } catch (error) {
            console.error(`Error fetching optimization settings for ${key}`, error)
            return { success: false, error: error.message }
        }
    }
    // Retreieves all deployments tagged for hourly optimization.
    async getDeploymentsForOptimization() {
        const globalOptimizeSetKey = `global:optimization_deployments`;

        try {
            const qualifiedDeploymentNames = await redisClient.sMembers(globalOptimizeSetKey);
            const deployments = [];

            for(const qualifiedDeployment of qualifiedDeploymentNames) {
                const [namespace, deploymentName] = qualifiedDeployment.split(":");
                const settings = await this.getOptimizationSettings(namespace, deploymentName);
                if (settings && settings.optimize) {
                    deployments.push({ namespace, deploymentName, settings })
                }
            }
            return deployments;
        } catch (error) {
            console.error(`Error listing deployments for optimization`, error)
            return { success: false, error: error.message}
        }
    }
    // Deletes existing optimization settings - will work in tandem with deleting KEDA Scaled Object. 
    async deleteOptimizationSettings(namespace, deploymentName) {
        try {
            const key = `namespace:${namespace}:deployment:${deploymentName}`;
            const globalOptimizeSetKey = `global:optimization_deployments`;
            const qualifiedDeploymentName = `${namespace}:${deploymentName}`;
            // Delete deployment settings and record.
            const result = await redisClient.del(key);
            // Remove deployment from global optimization set.
            await redisClient.sRem(globalOptimizeSetKey, qualifiedDeploymentName);
            // In redis if the del method works it returns the number of keys deleted, in this case 1.
            return { success: result === 1, log: 'Optimization settings successfully deleted.'  };
        } catch (error) {
            console.error(`Error deleting optimization settings for ${key}`, error)
            return { success: false, error: error.message}
        }
    }
    async flushRedisDb() {
        try {
            await redisClient.flushDb();
            console.log('Current database cleared successfully.');
            return { success: true, message: 'Current database cleared.' };
        } catch (error) {
            console.error('Error flushing current database', error);
            return { success: false, error: error.message };
        }
    }
}

module.exports = new SettingsService();
