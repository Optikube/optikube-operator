
const kedaService = require('../services/kedaService')

const kedaController = {};

kedaController.createScaledObject = async (req, res, next) => {
    try {
        const { settings, kedaSpec } = req.body;
        const optimizationScore = req.weightedOptimizationScore;
        await kedaService.createScaledObject(settings, kedaSpec, optimizationScore)
        return next();
    } catch(error) {
        console.error(`Error occured in kedaController.createScaledObject.`)
        return res.status(500).json({
            log: `Error occured in kedaController.createScaledObject.`,
            message: { error: error.message || "An error occured." },
        });
    }
}

kedaController.readScaledObject = async (req, res, next) => {
    try {
        const target = req.body.target;
        const scaledObject = await kedaService.readScaledObject(target);
        res.locals.keda = scaledObject.body;
        return next();
    } catch(error) {
        console.error(`Error occured in kedaController.readScaledObject.`)
        return res.status(500).json({
            log: `Error occured in kedaController.readScaledObject.`,
            message: { error: error.message || "An error occured." },
        });
    }
}

kedaController.updateScaledObject = async (req, res, next) => {
    try {
        const patchPayload = {
            // Payload to update scaled object
            // take from req.body.settings
        }
        const target = req.body.target;
        await kedaService.updateScaledObject(target, patchPayload);
        return next();
    } catch(error) {
        console.error(`Error occured in kedaController.updateScaledObject.`)
        return res.status(500).json({
            log: `Error occured in kedaController.updateScaledObject.`,
            message: { error: error.message || "An error occured." },
        });
    }
}

kedaController.deleteScaledObject = async (req, res, next) => {
    try {
        const target = req.body.target;
        kedaService.deleteScaledObject(target)
        const response = await k8sApi.deleteScaledObject(
            'keda.sh',
            'v1alpha1',
            req.body.targetNamespace,
            'scaledobjects',
            req.body.name,
            {}
        );
    } catch(error) {
        console.error(`Error occured in kedaController.deleteScaledObject.`)
        return res.status(500).json({
            log: `Error occured in kedaController.deleteScaledObject.`,
            message: { error: error.message || "An error occured." },
        });
    }
}



module.exports = kedaController;