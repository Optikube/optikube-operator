const redisClient = require('../data/redisClient');

// settingsService.js uses inputs from settingsController.js to perform settings operations in the Redis DB.

class SettingsService {
    // Creates and updates optimization settings for the specified namespace and deployment.
    async updateOptimizationSettings(namespace, deployment, settings, optimizationScore, optimizeFlag) {
        try {
            // Creates a key for redis data store consisting of namespace and deployment.
            const key = `namespace:${namespace}:deployment:${deployment}`;
            // Creates a key for redis data store global set.
            // This used to track which deployments are tagged to be optimized each hour - mainly a scalability feature.
            const globalOptimizeSetKey = `global:optimization_deployments`
            // Construct the value to be stored in the redis data store for corresponding key.
            const value = JSON.stringify({ settings, optimizationScore, optimize: optimizeFlag, });
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
            const key = `namespace:${namespace}:deployment:${deploymentName}`;
            const globalOptimizeSetKey = `global:optimization_deployments`;
            const targetDeploymentName = `${namespace}:${deploymentName}`;

            const result = await redisClient.get(key);
            const isInGlobalOptimizeSet = await redisClient.sIsMember(globalOptimizeSetKey, targetDeploymentName);
 
            // In redis if the get method yields no results it return nulls.
            const settings = result ? JSON.parse(result) : null;
            if (settings) {
                console.log(`Optimization settings successfully retrieved for ${deploymentName}`)
            }
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
        const globalOptimizeSetKey = `global:optimization_deployments`;

        try {
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
            const key = `namespace:${namespace}:deployment:${deploymentName}`;
            const globalOptimizeSetKey = `global:optimization_deployments`;
            const qualifiedDeploymentName = `${namespace}:${deploymentName}`;

            const result = await redisClient.del(key);
            const setResult = await redisClient.sRem(globalOptimizeSetKey, qualifiedDeploymentName);
            // This assumes all deployments to set to be optimized.
            const success = result > 0 && setResult > 0;

            if(!success) {
                console.log(`No optimization settings found for ${deploymentName} for deletion.`)
            } else {
                console.log(`Optimization settings for ${deploymentName} successfully deleted.`)
            }
            return 
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
        const globalOptimizeSetKey = `global:optimization_deployments`;
        try {
            const allOptimizedDeployments = await redisClient.sMembers(globalOptimizeSetKey);
            console.log('All deployments set for optimization:', allOptimizedDeployments);
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
    async isInGlobalOptimizeSet(namespace, deploymentName) {
        try {
            const globalOptimizeSetKey = `global:optimization_deployments`;
            const targetDeploymentName = `${namespace}:${deploymentName}`;

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
