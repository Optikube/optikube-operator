
const kedaService = require('../services/kedaService')

const kedaController = {};

kedaController.createScaledObject = async (req, res, next) => {
    try {
        const { namespace, deployment, kedaSpec } = req.body;
        const optimizationScore = req.weightedOptimizationScore;
        console.log("destructued from req.body", namespace, deployment, kedaSpec)

        const response = await kedaService.createScaledObject(namespace, deployment, kedaSpec, optimizationScore)
        console.log(response);
        return next();
    } catch(error) {
        console.error(`Error occured in kedaController.createScaledObject.`)
        const enhancedError = {
            origin: "kedaController.createScaledObject",
            type: "Error occured creating keda scaled object.",
            error: error,
            status: 500,
        }
        console.error(`Error in ${enhancedError}: ${error.message}`)
        return next(enhancedError);
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
        const { namespace, deployment, kedaSpec }= req.body;
        const optimizationScore = req.weightedOptimizationScore;
        const response = await kedaService.updateScaledObject(namespace, deployment, kedaSpec, optimizationScore);
        console.log(response)
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
        const { namespace, name }= req.body;
        const response = await kedaService.deleteScaledObject(namespace, name)
        console.log(response);
        return next();
    } catch(error) {
        console.error(`Error occured in kedaController.deleteScaledObject.`)
        return res.status(500).json({
            log: `Error occured in kedaController.deleteScaledObject.`,
            message: { error: error.message || "An error occured." },
        });
    }
}



module.exports = kedaController;