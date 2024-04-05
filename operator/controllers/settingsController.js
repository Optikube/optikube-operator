// Handles initiation of settings logic.
// This is a bridge between the frontend and backend.

const settingsService = require('../services/settingsService');


const settingsController = {};

settingsController.updateOptimizationSettings = async (req, res) => {
    try {
        const namespace = req.params.namespace;
        const deployment = req.params.namespace;
        const settings = req.body;

        await settingsService.saveOptimizationSettings(namespace, deployment, settings, true)
    } catch (error) {
        console.error(error);
        res.status(500).send("Error updating settings in settingsController.updateOptimizationSettings.", error)
    }
};