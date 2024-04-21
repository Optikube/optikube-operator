
const kedaService = require('../services/kedaService')

// kedaController.js handles initiation of keda and scaled object logic.
const kedaController = {};
// Creates scaled object for specified deployment.
kedaController.createScaledObject = async (req, res, next) => {
    try {
        const { namespace, deployment, kedaSpec } = req.body;
        const optimizationScore = req.weightedOptimizationScore;

        if (!namespace || !deployment || !kedaSpec || !optimizationScore) {
            throw {
                origin: "kedaController.createScaledObject",
                type: "Validation Error",
                status: 400,
                message: "Missing required parameters."
            };
        }
        await kedaService.createScaledObject(namespace, deployment, kedaSpec, optimizationScore);

        return next();
    } catch(error) {
        console.error(`${error.type} in ${error.origin}: ${error.message}`);
        next(error);
    }
}
// Retrieves scaled object for specified deployment.
kedaController.readScaledObject = async (req, res, next) => {
    try {
        const target = req.body.target;

        if (!target) {
            throw {
                origin: "kedaController.readScaledObject",
                type: "Validation Error",
                status: 400,
                message: "Missing required parameters."
            };
        }

        const scaledObject = await kedaService.readScaledObject(target);
        res.locals.keda = scaledObject.body;
        return next();
    } catch(error) {
        console.error(`${error.type} in ${error.origin}: ${error.message}`);
        next(error);
    }
}
// Updates scaled object for specified deployment.
kedaController.updateScaledObject = async (req, res, next) => {
    try {
        const { namespace, deployment, kedaSpec }= req.body;
        const optimizationScore = req.weightedOptimizationScore;

        if (!namespace || !deployment || !kedaSpec || !optimizationScore) {
            throw {
                origin: "kedaController.updateScaledObject",
                type: "Validation Error",
                status: 400,
                message: "Missing required parameters."
            };
        }

        await kedaService.updateScaledObject(namespace, deployment, kedaSpec, optimizationScore);

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
        const { namespace, name } = req.body;

        if (!namespace || !name ) {
            throw {
                origin: "kedaController.createScaledObject",
                type: "Validation Error",
                status: 400,
                message: "Missing required parameters."
            };
        }
        
        await kedaService.deleteScaledObject(namespace, name)

        return next();
    } catch(error) {
        console.error(`${error.type} in ${error.origin}: ${error.message}`);
        next(error);
    }
}



module.exports = kedaController;