const settingsService = require('../services/settingsService');

// settingsController.js handles initiation of settings logic.
const settingsController = {};

// Updates optimization settings for specified deployment.
settingsController.updateOptimizationSettings = async (req, res, next) => {
    try {
        // Destructures user/deployment inputs from front end.
        const { namespace, deployment, settings } = req.body;
        // Access optimization score and strategy we previously stored in the request body.
        const optimizationScore = req.weightedOptimizationScore;
        const optimizationStrategy = req.optimizationStrategy;
        // Validation check for user/deployment inputs that will be used in the settingsService.
        if (!namespace || !deployment || !settings || !optimizationScore || !optimizationStrategy) {
            throw {
                origin: "settingsController.updateOptimizationSettings",
                type: "Validation Error",
                status: 400,
                message: "Missing required parameters."
            };
        }
        // Initiate process of updating optimization settings with user/deployment inputs.
        await settingsService.updateOptimizationSettings(namespace, deployment, settings, optimizationScore, optimizationStrategy, true);
        // Proceed to next piece of middleware in chain.
        return next();
    } catch (error) {
        console.error(`${error.type} in ${error.origin}: ${error.message}`);
        next(error);
    }
};
// Deletes optimization settings for specified namespace and deployment.
settingsController.deleteOptimizationSettings = async (req, res, next) => {
    try {
        // Destructures user/deployment inputs from front end.
        const {namespace, deployment } = req.body;
        // Validation check for namespace/deployment inputs that will be used in the settingsService.
        if (!namespace || !deployment) {
            throw {
                origin: "settingsController.deleteOptimizationSettings",
                type: "Validation Error",
                status: 400,
                message: "Missing required parameters."
            };
        }
        // Initiate process of updating optimization settings with user/deployment inputs.
        await settingsService.deleteOptimizationSettings(namespace, deployment);
        // Proceed to next piece of middleware chain.
        return next();
    } catch (error) {
        console.error(`${error.type} in ${error.origin}: ${error.message}`);
        next(error);
    }
};
// Retrieves optimization settings for specified namespace and deployment.
settingsController.getOptimizationSettings = async (req, res, next) => {
    try {
        // Destructures user/deployment inputs from front end.
        const {namespace, deployment } = req.query;
        // Validation check for namespace/deployment inputs that will be used in the settingsService.
        if (!namespace || !deployment) {
            throw {
                origin: "settingsController.getOptimizationSettings",
                type: "Validation Error",
                status: 400,
                message: "Missing required parameters."
            };
        }
        // Initiated 
        const response = await settingsService.getOptimizationSettings(namespace, deployment);
        // Condition to check if settings were succesfully retrieved for specified deployment.
        if (response === null) throw new Error('Settings not found')
        // Assign response to res.locals.
        res.locals.settings = response;
        // Proceed to next part of middleware chain.
        return next();
    } catch (error) {
        console.error(`${error.type} in ${error.origin}: ${error.message}`);
        next(error);
    }
};
// Deletes all settings in Redis DB.
settingsController.flushRedisDb = async (req,res, next) => {
    try {
        // Initites the deletion of all settings in settingsService.
        await settingsService.flushRedisDb();
        // Proceed to next part of middleware chain.
        return next();
    } catch (error) {
        console.error(`${error.type} in ${error.origin}: ${error.message}`);
        next(error);
    }
}
// Retrieves the global set that details deployments that are being optimized each hour.
settingsController.getGlobalOptimizationSet = async (req,res, next) => {
    try {
        // Initiates the retrieveal of the global optimization set form settingsService.
        const result = await settingsService.getGlobalOptimizationSet()
        // Assign result to res.locals.
        res.locals.result = result;
        // Proceed to next part of middleware chain.
        return next();
    } catch (error) {
        console.error(`${error.type} in ${error.origin}: ${error.message}`);
        next(error);
    }
}


module.exports = settingsController;