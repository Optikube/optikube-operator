
const kedaService = require('../services/kedaService')

// kedaController.js handles initiation of keda and scaled object logic.
const kedaController = {};
// Creates scaled object for specified deployment.
kedaController.createScaledObject = async (req, res, next) => {
    try {
        const { namespace, deployment, scaledObjectSpec } = req.body;
        const optimizationScore = req.weightedOptimizationScore;

        if (!namespace || !deployment || !scaledObjectSpec || !optimizationScore) {
            throw {
                origin: "kedaController.createScaledObject",
                type: "Validation Error",
                status: 400,
                message: "Missing required parameters."
            };
        }
        res.locals.response["Scaled Object"] = await kedaService.createScaledObject(namespace, deployment, scaledObjectSpec, optimizationScore);

        return next();
    } catch(error) {
        console.error(`${error.type} in ${error.origin}: ${error.message}`);
        next(error);
    }
}
// Retrieves scaled object for specified deployment.
kedaController.readScaledObject = async (req, res, next) => {
    try {
        const {namespace, deployment } = req.query;

        if (!namespace || !deployment) {
            throw {
                origin: "kedaController.readScaledObject",
                type: "Validation Error",
                status: 400,
                message: "Missing required parameters."
            };
        }

        const scaledObject = await kedaService.readScaledObject(namespace, deployment);
        res.locals.scaledObject = scaledObject;
        return next();
    } catch(error) {
        console.error(`${error.type} in ${error.origin}: ${error.message}`);
        next(error);
    }
}
// Updates scaled object for specified deployment.
kedaController.updateScaledObject = async (req, res, next) => {
    try {
        const { namespace, deployment, scaledObjectSpec } = req.body;
        const optimizationScore = req.weightedOptimizationScore;

        if (!namespace || !deployment || !scaledObjectSpec || !optimizationScore) {
            throw {
                origin: "kedaController.updateScaledObject",
                type: "Validation Error",
                status: 400,
                message: "Missing required parameters."
            };
        }

        await kedaService.updateScaledObject(namespace, deployment, scaledObjectSpec, optimizationScore);

        return next();
    } catch(error) {
        console.error(`${error.type} in ${error.origin}: ${error.message}`);
        next(error);
    }
}
// Deletes a scaled object for specified deployment.
kedaController.deleteScaledObject = async (req, res, next) => {
    try {
        // Should we be using req.params?
        const { namespace, scaledObjectName } = req.body;

        if (!namespace || !scaledObjectName ) {
            throw {
                origin: "kedaController.createScaledObject",
                type: "Validation Error",
                status: 400,
                message: "Missing required parameters."
            };
        }
        
        await kedaService.deleteScaledObject(namespace, scaledObjectName)

        return next();
    } catch(error) {
        console.error(`${error.type} in ${error.origin}: ${error.message}`);
        next(error);
    }
}



module.exports = kedaController;