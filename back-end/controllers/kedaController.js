
const kedaService = require('../services/kedaService')

const kedaController = {};

kedaController.createScaledObject = async (req, res, next) => {
    try {
        const settings = req.body.settings;
        const optimizationScore = req.body.optimizationScore
        await kedaService.createScaledObject(settings, optimizationScore)
        return next();
    } catch(err) {
        return next({
            log: "Error occurred in kedaController.createScaledObject",
            status: 400,
            message: { err },
        })
    }
}

kedaController.readScaledObject = async (req, res, next) => {
    try {
        const target = req.body.target;
        const scaledObject = await kedaService.readScaledObject(target);
        res.locals.keda = scaledObject.body;
        return next();
    } catch(err) {
        return next({
            log: "Error occurred in kedaController.readScaledObject",
            status: 400,
            message: { err },
        })
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
    } catch(err) {
        return next({
            log: "Error occurred in kedaController.createScaledObject",
            status: 400,
            message: { err },
        })
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
    } catch(err) {
        return next({
            log: "Error occurred in kedaController.deleteScaledObject",
            status: 400,
            message: { err },
        })
    }
}



module.exports = kedaController;