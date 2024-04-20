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
            console.error(`Error saving optimization settings for ${key} in ${this.updateOptimizationSettings}.`)
            return res.status(500).json({
                log: `Error saving optimization settings for ${key} in ${this.updateOptimizationSettings}.`,
                message: { success: false, error: error.message || "An error occured."}
            })
        }
    }
    // Retrieves current optimization settings for specified deployment
    async getOptimizationSettings(namespace, deploymentName) {
        try {
            const key = `namespace:${namespace}:deployment:${deploymentName}`;
            const globalOptimizeSetKey = `global:optimization_deployments`;
            const targetDeploymentName = `${namespace}:${deploymentName}`;

            const result = await redisClient.get(key);
            const isInGlobalOptimizeSet = await redisClient.sIsMember(globalOptimizeSetKey, targetDeploymentName);
            console.log('globalOptimizeSetKey', globalOptimizeSetKey)
            console.log('targetDeployment', targetDeploymentName)
            console.log('is Deployment in set', isInGlobalOptimizeSet)
            // In redis if the get method yields no results it return nulls.
            const settings = result ? JSON.parse(result) : null;
            return {
                key,
                settings,
                isInGlobalOptimizeSet,
            }
        } catch (error) {
            console.error(`Error fetching optimization settings for ${key} in ${this.getOptimizationSettings}.`)
            return res.status(500).json({
                log: `Error fetching optimization settings for ${key} in ${this.getOptimizationSettings}.`,
                message: { success: false, error: error.message || "An error occured."}
            })
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
            console.error(`Error listing deployments for optimization in ${this.getDeploymentsForOptimization}.`)
            return res.status(500).json({
                log: `Error listing deployments for optimization in ${this.getDeploymentsForOptimization}.`,
                message: { success: false, error: error.message || "An error occured."}
            })
        }
    }
    // Deletes existing optimization settings - will work in tandem with deleting KEDA Scaled Object. 
    async deleteOptimizationSettings(namespace, deploymentName) {
        try {
            const key = `namespace:${namespace}:deployment:${deploymentName}`;
            const globalOptimizeSetKey = `global:optimization_deployments`;
            const qualifiedDeploymentName = `${namespace}:${deploymentName}`;
            // Delete deployment settings and record.
            console.log("Key for record to be deleted:", key);
            const result = await redisClient.del(key);
            console.log("Records deleted optimization setting:", result);
            // Remove deployment from global optimization set.
            console.log("Record to be deleted from global optimization set:", qualifiedDeploymentName);
            const setResult = await redisClient.sRem(globalOptimizeSetKey, qualifiedDeploymentName);
            console.log('Records deleted from global optimization set', setResult)

            const success = result > 0 && setResult > 0;

            if(!success) {
                return { success: false, log: 'No settings found or already deleted.'}
            }
    
            return { success: true, log: 'Optimization settings successfully deleted.'  };
        } catch (error) {
            console.error(`Error deleting optimization settings for ${key} in ${this.deleteOptimizationSettings}.`)
            return res.status(500).json({
                log: `Error deleting optimization settings for ${key} in ${this.deleteOptimizationSettings}.`,
                message: { success: false, error: error.message || "An error occured."}
            })
        }
    }
    // Used in testing to clear redis db.
    async flushRedisDb() {
        try {
            await redisClient.flushDb();
            console.log("Current database cleared successfully.");
            return { success: true, message: "Current database cleared." };
        } catch (error) {
            console.error("Error clearing current databse.")
            return res.status(500).json({
                log: "Error clearing current databse.",
                message: { success: false, error: error.message || "An error occured."}
            })
        }
    }
    // Used in testing to see the global optimization set.
    async getGlobalOptimizationSet() {
        const globalOptimizeSetKey = `global:optimization_deployments`;
        try {
            const allOptimizedDeployments = await redisClient.sMembers(globalOptimizeSetKey);
            console.log('All deployments set for optimization:', allOptimizedDeployments);
            return allOptimizedDeployments;
        } catch (error) {
            console.error(`Error retrieving all optimized deployments in ${this.getGlobalOptimizationSet}.`);
            return res.status(500).json({
                log: `Error retrieving all optimized deployments in ${this.getGlobalOptimizationSet}.`,
                message: { success: false, error: error.message || "An error occured."}
            })
        }
    }
}

module.exports = new SettingsService();
