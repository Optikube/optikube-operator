// Handles initiation of settings logic.
// This is a bridge between the frontend and backend.

const settingsService = require('../services/settingsService');


class SetttingsController {
    async updateOptimizationSettings(req, res) {
        try {
            const namespace = req.params.namespace;
            const deployment = req.params.deployment;
            const settings = req.body;

            await settingsService.saveOptimizationSettings(namespace, deployment, settings, true)
            
            res.status(200).json({message: "Optimization settings updated successfully."})
        } catch (error) {
            console.error(error);
            res.status(500).send("Error updating settings in settingsController.updateOptimizationSettings.", error)
        }
    };
};

module.exports = new settingsController();