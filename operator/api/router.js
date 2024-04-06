const express = require('express');
const appsController = require('../controllers/appsController');
const optimizationController = require('../controllers/optimizationController');
const settingsController = require('../controllers/settingsController');
const kedaController = require('../controllers/kedaController');

const router = express.Router();

router.get('/deployments', appsController.viewAllDeployments, (req, res) => {
    return res.status(200).json(res.locals.deployments)
})

// Optimizes routes

router.patch('/settings/update', settingsController.updateOptimizationSettings, kedaController.updateScaledObject, (req, res) => {
    return res.status(200).json({message: "Optimization settings updated successfully."})
})

router.post('/settings/create', settingsController.updateOptimizationSettings, kedaController.createScaledObject, (req, res) => {
    return res.status(200).json({message: "Optimization settings created successfully and autoscaling started."})
})

router.post('/settings/optimizeOn')

router.post('/settings/optimizeOff')