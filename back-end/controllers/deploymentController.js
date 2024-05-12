const deploymentService = require('../services/deploymentService');

// deploymnetController.js handles initiation of deployment logic.
const deploymentController = {};
// Retrieves all deployments in Kubernetes cluster for initial page render.
deploymentController.getAllDeployments = async (req, res, next) => {
    try {
        // Initiate the process of retrieving all active deployments and standardizing response object.
        // Assign standardized response object to res.locals to send to front end.
        res.locals.deployments = await deploymentService.getAllDeployments()
        // Proceed to next piece of middleware in chain.
        return next();
    } catch(error) {
        console.error(`${error.type} in ${error.origin}: ${error.message}`);
        next(error);
    }
}

deploymentController.getDeployment = async (req ,res, next) => {
    try {
        // Destructures user/deployment inputs from front end.
        const {namespace, deployment } = req.body;
        // Initiate the process of retrieving specified deployment and standardizing response object.
        // Assign standardized response object to res.locals to send to front end.
        res.locals.deployment = await deploymentService.getDeployment(deployment, namespace);
        // Proceed to next piece of middleware in chain.
        return next();
    } catch(error) {
        console.error(`${error.type} in ${error.origin}: ${error.message}`);
        next(error);
    }
}

module.exports = deploymentController;