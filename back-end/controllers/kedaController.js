const kedaService = require('../services/kedaService')

// kedaController.js handles initiation of KEDA and scaled object logic.
const kedaController = {};
// Creates KEDA scaled object for specified deployment.
kedaController.createScaledObject = async (req, res, next) => {
    try {
        // Destructures user/deployment inputs from front end.
        const { namespace, deployment, scaledObjectSpec } = req.body;
        // Access optimization score and strategy we previously stored in the request body.
        const optimizationScore = req.weightedOptimizationScore;
        // Validation check for user/deployment inputs that will be used in the kedaService.
        if (!namespace || !deployment || !scaledObjectSpec || !optimizationScore) {
            throw {
                origin: "kedaController.createScaledObject",
                type: "Validation Error",
                status: 400,
                message: "Missing required parameters."
            };
        }
        // Initiate process of creating the configuration of KEDA scaled object with user/deployment inputs and optimization score.
        await kedaService.createScaledObject(namespace, deployment, scaledObjectSpec, optimizationScore);
        // Proceed to next piece of middleware in chain.
        return next();
    } catch(error) {
        console.error(`${error.type} in ${error.origin}: ${error.message}`);
        next(error);
    }
}
// Retrieves KEDA scaled object for specified deployment.
kedaController.readScaledObject = async (req, res, next) => {
    try {
        // Destructures user/deployment inputs from front end.
        const {namespace, deployment } = req.query;
        // Validation check for user/deployment inputs that will be used in the kedaService.
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
// Updates KEDA scaled object for specified deployment.
kedaController.updateScaledObject = async (req, res, next) => {
    try {
        // Destructures user/deployment inputs from front end.
        const { namespace, deployment, scaledObjectSpec } = req.body;
        // Access optimization score and strategy we previously stored in the request body.
        const optimizationScore = req.weightedOptimizationScore;
        // Validation check for user/deployment inputs that will be used in the kedaService.
        if (!namespace || !deployment || !scaledObjectSpec || !optimizationScore) {
            throw {
                origin: "kedaController.updateScaledObject",
                type: "Validation Error",
                status: 400,
                message: "Missing required parameters."
            };
        }
        // Initiate process of updating KEDA scaled object with user/deployment inputs and optimization score.
        await kedaService.updateScaledObject(namespace, deployment, scaledObjectSpec, optimizationScore);
        // Proceed to next piece of middleware in chain.
        return next();
    } catch(error) {
        console.error(`${error.type} in ${error.origin}: ${error.message}`);
        next(error);
    }
}
// Deletes KEDA scaled object for specified deployment.
kedaController.deleteScaledObject = async (req, res, next) => {
    try {
        // Destructures user/deployment inputs from front end.
        const { namespace, scaledObjectName } = req.body;
        // Validation check for user/deployment inputs that will be used in the kedaService.
        if (!namespace || !scaledObjectName ) {
            throw {
                origin: "kedaController.createScaledObject",
                type: "Validation Error",
                status: 400,
                message: "Missing required parameters."
            };
        }
        // Initiate process of deleting KEDA scaled object with namespace and scaled object name.
        await kedaService.deleteScaledObject(namespace, scaledObjectName)
        // Proceed to next piece of middleware in chain.
        return next();
    } catch(error) {
        console.error(`${error.type} in ${error.origin}: ${error.message}`);
        next(error);
    }
}


module.exports = kedaController;