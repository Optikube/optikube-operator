const redisClient = require('../data/redisClient');

// settingsService.js uses inputs from settingsController.js to perform settings operations in the Redis DB.

class SettingsService {
    // Creates and updates optimization settings for the specified namespace and deployment.
    async updateOptimizationSettings(namespace, deployment, settings, optimizationScore, optimizationStrategy, optimizeFlag) {
        try {
            // Creates a key for redis data store consisting of namespace and deployment.
            const key = `namespace:${namespace}:deployment:${deployment}`;
            // Creates a key for redis data store global set.
            // This used to track which deployments are tagged to be optimized each hour - mainly a scalability feature.
            const globalOptimizeSetKey = `global:optimization_deployments`
            // Construct the value to be stored in the redis data store for corresponding key.
            const value = JSON.stringify({ settings, optimizationScore, optimizationStrategy, optimize: optimizeFlag });
            // Set redis key and value entry.
            const result = await redisClient.set(key, value);
            // Initiate qualified deployment variable to add namespace and deployment to global optimization set if applicable.
            const qualifiedDeployment = `${namespace}:${deployment}`;
            // If deployment is tagged to be optimized add to global optimization set.
            if (optimizeFlag) {
                await redisClient.sAdd(globalOptimizeSetKey, qualifiedDeployment);
                console.log(`${qualifiedDeployment} successfully added to global optimization set.`)
            }
            // If deployment isn't tagged to be optimized remove from global optimization set.
            if (!optimizeFlag) {
                await redisClient.sRem(globalOptimizeSetKey, qualifiedDeployment);
            }
            // If addition to redis data store is succesful log progress or throw an error.
            if ( result === "OK") {
                console.log(`Optimization settings successfully updated for ${deployment}`);
                return;
            } else {
                throw {
                    origin: "Settings.updateOptimizationSettings",
                    type: "Redis Error",
                    status: 500,
                    message: `Failed to add entry for ${key} to Redis data store.`
                }
            }
        } catch (error) {
            throw {
                origin: "SettingsService.updateOptimizationSettings",
                type: "Redis Error",
                error: error,
                message: `Failed to update settings for ${deployment}: ${error.message}`
            }
        }
    }
    // Retrieves updated optimization settings for the specified namespace and deployment.
    async getOptimizationSettings(namespace, deploymentName) {
        try {
            // Creates a key for redis data store consisting of namespace and deployment.
            const key = `namespace:${namespace}:deployment:${deploymentName}`;
            // Creates a key for redis data store global set.
            const globalOptimizeSetKey = `global:optimization_deployments`;
            // Create target deployment to search global optimization for.
            const targetDeploymentName = `${namespace}:${deploymentName}`;
            // Set result of the get request for specified deployment in redis data store.
            const result = await redisClient.get(key);
            // Checks if deployment is in global optimization set - used to track whcih deployments are tagged to be optimized and have a KEDA scaled object.
            const isInGlobalOptimizeSet = await redisClient.sIsMember(globalOptimizeSetKey, targetDeploymentName);
            // Parse result or return null for unsuccssful operation.
            const settings = result ? JSON.parse(result) : null;
            // Succes log if settigns are returned.
            if (settings) {
                console.log(`Optimization settings successfully retrieved for ${deploymentName}`)
            }
            // Returns object with deployment's settings.
            return {
                key,
                ...settings,
                isInGlobalOptimizeSet,
            }
        } catch (error) {
            throw {
                origin: "SettingsService.getOptimizationSettings",
                type: "Redis Error",
                error: error,
                message: `Failed to retrieve settings for ${deploymentName}: ${error.message}`
            }
        }
    }
    // Retreieves all deployments tagged for hourly optimization.
    async getDeploymentsForOptimization() {
        try {
            const globalOptimizeSetKey = `global:optimization_deployments`;
            const qualifiedDeploymentNames = await redisClient.sMembers(globalOptimizeSetKey);
            const deployments = [];
            // console.log("Deployments for optimization - names", qualifiedDeploymentNames);

            for(const qualifiedDeployment of qualifiedDeploymentNames) {
                const [namespace, deploymentName] = qualifiedDeployment.split(":");
                const response = await this.getOptimizationSettings(namespace, deploymentName);
                console.log("response", response);
                const { settings } = response;
          
                if (settings && settings.optimize) {
                    deployments.push({ namespace, deploymentName, ...settings, });
                }
            }
            console.log("Deployments for optimization", deployments);
            return deployments;
        } catch (error) {
            throw {
                origin: "SettingsService.getDeploymentsForOptimization",
                type: "Redis Error",
                error: error,
                message: `Failed to retrieve deployments and settings for hourly optimization ${error.message}`
            }
        }
    }
    // Deletes exsting optimization settings for the specified namespace and deployment. 
    async deleteOptimizationSettings(namespace, deploymentName) {
        try {
            // Establish key for redis data store to search for deployment.
            const key = `namespace:${namespace}:deployment:${deploymentName}`;
            // Creates a key for redis data store global set.
            const globalOptimizeSetKey = `global:optimization_deployments`;
            // Creates value to search global optimization set for.
            const qualifiedDeploymentName = `${namespace}:${deploymentName}`;
            // Result of deleting specified deployment.
            const result = await redisClient.del(key);
            // Result of removing specified deployment from global optimization set.
            const setResult = await redisClient.sRem(globalOptimizeSetKey, qualifiedDeploymentName);
            // This assumes all deployments to set to be optimized.
            // Succes variable established based on both results.
            const success = result > 0 && setResult > 0;
            // Succes or failure log based on success variable.
            if(!success) {
                console.log(`No optimization settings found for ${deploymentName} for deletion.`)
            } else {
                console.log(`Optimization settings for ${deploymentName} successfully deleted.`)
            }
            return; 
        } catch (error) {
            throw {
                origin: "SettingsService.deleteOptimizationSettings",
                type: "Redis Error",
                error: error,
                message: `Failed to delete settings for ${deploymentName}: ${error.message}`
            }
        }
    }
    // Used in testing to clear redis db.
    async flushRedisDb() {
        try {
            // Flushes all data from redis data store.
            await redisClient.flushDb();
            console.log("Current database cleared successfully.");
            return
        } catch (error) {
            throw {
                origin: "SettingsService.flushRedisDb",
                type: "Redis Error",
                error: error,
                message: `Failed to flush Redis DB`
            }
        }
    }
    // Used in testing to see the global optimization set.
    async getGlobalOptimizationSet() {
        try {
             // Establish global optimize set key.
            const globalOptimizeSetKey = `global:optimization_deployments`;
            // Retrieves all members of the globla optimization set.
            const allOptimizedDeployments = await redisClient.sMembers(globalOptimizeSetKey);
            // Return all deployments with KEDA scaled object and tagged for optimization.
            return allOptimizedDeployments;
        } catch (error) {
            throw {
                origin: "SettingsService.getGlobalOptimizationSet",
                type: "Redis Error",
                error: error,
                message: `Failed retrieve global optimization set: ${error.message}`
            }
        }
    }
    // Checks if specified deployment and namespace are in the global optimization set.
    async isInGlobalOptimizeSet(namespace, deploymentName) {
        try {
            // Establish global optimize set key.
            const globalOptimizeSetKey = `global:optimization_deployments`;
            // Establish target deployment.
            const targetDeploymentName = `${namespace}:${deploymentName}`;
            // Return the result (boolean) of method verifying if the deployment is in the global optimization set.
            // If the deployment is in the global optimization set it is tagged to be optimized each hour and has a KEDA scaled object. 
            return await redisClient.sIsMember(globalOptimizeSetKey, targetDeploymentName);
        } catch (error) {
            throw {
                origin: "SettingsService.isInGlobalOptimizeSet",
                type: "Redis Error",
                error: error,
                message: `Failed to confirm if deployment is in global optimization set: ${error.message}`
            }
        }
    }
}

module.exports = new SettingsService();
