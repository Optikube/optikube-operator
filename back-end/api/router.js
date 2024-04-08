const express = require('express');
const appsController = require('../controllers/appsController');
const optimizationController = require('../controllers/optimizationController');
const settingsController = require('../controllers/settingsController');
const kedaController = require('../controllers/kedaController');

const router = express.Router();

router.get('/deployments', appsController.viewAllDeployments, (req, res) => {
    return res.status(200).json(res.locals.deployments)
})

// CRUD routes

router.patch('/settings/update', optimizationController.calculateWeightedOptimizationScore, settingsController.updateOptimizationSettings,kedaController.updateScaledObject, (req, res) => {
    return res.status(200).json({message: "Optimization settings updated successfully."})
})

router.post('/settings/create', optimizationController.calculateWeightedOptimizationScore, settingsController.updateOptimizationSettings, kedaController.createScaledObject, (req, res) => {
    return res.status(200).json({message: "Optimization settings created successfully and autoscaling started."})
})

router.delete('/settings/delete', settingsController.deleteOptimizationSettings, kedaController.deleteScaledObject, (req, res) => {
    return res.status(200).json({message: "Optimization settings removed successfully and autoscaling stopped."})
})

router.get('/settings/read', settingsController.getOptimizationSettings, kedaController.readScaledObject, (req, res) => {
    return res.status(200).json({
        // settings and or KEDA status info we need to send back to user
    })
})

router.post('/settings/optimizeOn')

router.post('/settings/optimizeOff')