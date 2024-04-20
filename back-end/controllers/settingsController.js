// Handles initiation of settings logic.
// This is a bridge between the frontend and backend.

const settingsService = require('../services/settingsService');

const settingsController = {};

settingsController.updateOptimizationSettings = async (req, res, next) => {
    try {
        const { namespace, deployment, settings } = req.body;
        const optimizationScore = req.weightedOptimizationScore;
        console.log("req.body", req.body)

        if(!namespace || !deployment || !settings || !optimizationScore) {
            return res.status(400).json({
                error: `Mising required parameters in settingsController.updateOptimizationSettings.`
            });
        }

        await settingsService.updateOptimizationSettings(namespace, deployment, settings, optimizationScore, true);
        return next();
    } catch (error) {
        console.error(`Error occured in settingsController.updateOptimizationSettings.`)
        return res.status(500).json({
            log: `Error occured in settingsController.updateOptimizationSettings.`,
            message: { error: error.message || "An error occured." },
        });
    }
};

settingsController.deleteOptimizationSettings = async (req, res, next) => {
    try {
        const {namespace, deployment } = req.query;

        if(!namespace || !deployment) {
            return res.status(400).json({
                error: "Mising required parameters in settingsController.deleteOptimizationSettings."
            });
        }

        await settingsService.deleteOptimizationSettings(namespace, deployment);
        return next();
    } catch (error) {
        console.error(`Error occured in ${this.deleteOptimizationSettings}.`)
        return res.status(500).json({
            log: `Error occured in ${this.deleteOptimizationSettings}.`,
            message: { error: error.message || "An error occured." },
        });
    }
};

settingsController.getOptimizationSettings = async (req, res, next) => {
    try {
        // delete settings on user removing autoscaling
        const {namespace, deployment } = req.query;

        if(!namespace || !deployment) {
            return res.status(400).json({
                error: `Mising required parameters in ${this.getOptimizationSettings}.`
            });
        }
        const result = await settingsService.getOptimizationSettings(namespace, deployment);

        if (result === null) throw new Error('Settings not found')

        res.locals.result = result;
        return next();
    } catch (error) {
        console.error(`Error occured in ${this.getOptimizationSettings}.`)
        return res.status(500).json({
            log: `Error occured in ${this.getOptimizationSettings}.`,
            message: { error: error.message || "An error occured." },
        });
    }
};

settingsController.flushRedisDb = async (req,res, next) => {
    try {
        const result = await settingsService.flushRedisDb()
        res.locals.result = result;
        return next();
    } catch (error) {
        console.error(`Error occured in ${this.flushRedisDb}.`)
        return res.status(500).json({
            log: `Error occured in ${this.flushRedisDb}.`,
            message: { error: error.message || "An error occured." },
        });
    }
}

settingsController.getGlobalOptimizationSet = async (req,res, next) => {
    try {
        const result = await settingsService.getGlobalOptimizationSet()
        res.locals.result = result;
        return next();
    } catch (error) {
        console.error(`Error occured in ${this.getGlobalOptimizationSet}.`)
        return res.status(500).json({
            log: `Error occured in ${this.getGlobalOptimizationSet}.`,
            message: { error: error.message || "An error occured." },
        });
    }
}

module.exports = settingsController;