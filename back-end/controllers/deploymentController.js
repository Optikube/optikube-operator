const deploymentService = require('../services/deploymentService');

const deploymentController = {};

deploymentController.getAllDeployments = async (req, res, next) => {
    try {
        res.locals.deployments = await deploymentService.getAllDeployments()

        return next();
    } catch(error) {
        console.error(`${error.type} in ${error.origin}: ${error.message}`);
        next(error);
    }
}

module.exports = deploymentController;