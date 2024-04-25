const settingsService = require('../services/settingsService');

// settingsController.js handles initiation of settings logic.
const settingsController = {};

// Updates optimization settings for specified namespace and deployment.
settingsController.updateOptimizationSettings = async (req, res, next) => {
    try {
        const { namespace, deployment, settings } = req.body;
        const optimizationScore = req.weightedOptimizationScore;
        const optimizationStrategy = req.optimizationStrategy;
        console.log("req.body", req.body);
        if (!namespace || !deployment || !settings || !optimizationScore || !optimizationStrategy) {
            throw {
                origin: "settingsController.updateOptimizationSettings",
                type: "Validation Error",
                status: 400,
                message: "Missing required parameters."
            };
        }
        // Assigning response object to res.locals to create stadardized reponse of data.
        res.locals.response = await settingsService.updateOptimizationSettings(namespace, deployment, settings, optimizationScore, true);
        return next();
    } catch (error) {
        console.error(`${error.type} in ${error.origin}: ${error.message}`);
        next(error);
    }
};
// Deletes optimization settings for specified namespace and deployment.
settingsController.deleteOptimizationSettings = async (req, res, next) => {
    try {
        // Assumes namespace and deployment are included in the req.params
        const {namespace, deployment } = req.body;

        if (!namespace || !deployment) {
            throw {
                origin: "settingsController.deleteOptimizationSettings",
                type: "Validation Error",
                status: 400,
                message: "Missing required parameters."
            };
        }

        await settingsService.deleteOptimizationSettings(namespace, deployment);
        return next();
    } catch (error) {
        console.error(`${error.type} in ${error.origin}: ${error.message}`);
        next(error);
    }
};
// Retrieves optimization settings for specified namespace and deployment.
settingsController.getOptimizationSettings = async (req, res, next) => {
    try {
        // delete settings on user removing autoscaling
        const {namespace, deployment } = req.query;

        if (!namespace || !deployment) {
            throw {
                origin: "settingsController.getOptimizationSettings",
                type: "Validation Error",
                status: 400,
                message: "Missing required parameters."
            };
        }
        const response = await settingsService.getOptimizationSettings(namespace, deployment);

        if (response === null) throw new Error('Settings not found')

        res.locals.settings = response;
        return next();
    } catch (error) {
        console.error(`${error.type} in ${error.origin}: ${error.message}`);
        next(error);
    }
};
// Deletes all settings in Redis DB.
settingsController.flushRedisDb = async (req,res, next) => {
    try {
        await settingsService.flushRedisDb()
        return next();
    } catch (error) {
        console.error(`${error.type} in ${error.origin}: ${error.message}`);
        next(error);
    }
}
// Retrieves the global set that details deployments that are being optimized each hour.
settingsController.getGlobalOptimizationSet = async (req,res, next) => {
    try {
        const result = await settingsService.getGlobalOptimizationSet()
        res.locals.result = result;
        return next();
    } catch (error) {
        console.error(`${error.type} in ${error.origin}: ${error.message}`);
        next(error);
    }
}


module.exports = settingsController;