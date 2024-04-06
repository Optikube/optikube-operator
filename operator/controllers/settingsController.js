// Handles initiation of settings logic.
// This is a bridge between the frontend and backend.

const settingsService = require('../services/settingsService');

const settingsController = {};

settingsController.updateOptimizationSettings = async (req, res, next) => {
    try {
        const namespace = req.body.namespace;
        const deployment = req.body.deployment;
        const settings = req.body.settings;

        await settingsService.saveOptimizationSettings(namespace, deployment, settings, true)
        return next();
    } catch (error) {
        return next({
            log: "Error occurred in settingsController.updateOptimizationSettings",
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