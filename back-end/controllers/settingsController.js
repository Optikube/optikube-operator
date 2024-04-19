// Handles initiation of settings logic.
// This is a bridge between the frontend and backend.

const settingsService = require('../services/settingsService');

const settingsController = {};

settingsController.updateOptimizationSettings = async (req, res, next) => {
    try {
        const namespace = req.body.namespace;
        const deployment = req.body.deployment;
        const settings = req.body.settings;
        const optimizationScore = req.weightedOptimizationScore

        await settingsService.updateOptimizationSettings(namespace, deployment, settings, optimizationScore, true)
        return next();
    } catch (err) {
        return next({
            log: "Error occurred in settingsController.updateOptimizationSettings",
            status: 400,
            message: { err },
        })
    }
}

settingsController.deleteOptimizationSettings = async (req, res, next) => {
    try {
        // delete settings on user removing autoscaling
        const {namespace, deployment } = req.query.namespace;
        await settingsService.deleteOptimizationSettings(namespace, deployment)
        return next();
    } catch (err) {
        return next({
            log: "Error occurred in settingsController.deleteOptimizationSettings",
            status: 500,
            message: { err },
        })
    }
}

settingsController.getOptimizationSettings = async (req, res, next) => {
    try {
        // delete settings on user removing autoscaling
        const namespace = req.query.namespace;
        const deployment = req.query.deployment;
        const result = await settingsService.getOptimizationSettings(namespace, deployment)
        if (result === null) throw new Error('Settings not found')
        res.locals.result = result;
        return next();
    } catch (err) {
        return next({
            log: "Error occurred in settingsController.updateOptimizationSettings",
            status: 400,
            message: { err },
        })
    }
}

settingsController.flushRedisDb = async (req,res, next) => {
    try {
        const result = await settingsService.flushRedisDb()
        res.locals.result = result;
        return next();
    } catch {
        return next({
            log: "Error occurred in settingsController.flushRedisDb",
            status: 500,
            message: { err },
        })
    }
}

settingsController.getGlobalOptimizationSet = async (req,res, next) => {
    try {
        const result = await settingsService.checkOptimizationSet()
        res.locals.result = result;
        return next();
    } catch {
        return next({
            log: "Error occurred in settingsController.getGlobalOptimizationSet",
            status: 400,
            message: { err },
        })
    }
}

// class settingsController {
//     async updateOptimizationSettings(req, res, next) {
//         try {
//             const namespace = req.params.namespace;
//             const deployment = req.params.deployment;
//             const settings = req.body;

//             await settingsService.saveOptimizationSettings(namespace, deployment, settings, true)
            
//             res.status(200).json({message: "Optimization settings updated successfully."})
//         } catch (error) {
//             console.error(error);
//             res.status(500).send("Error updating settings in settingsController.updateOptimizationSettings.", error)
//         }
//     };
// };

module.exports = settingsController;