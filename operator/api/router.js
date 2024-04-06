const express = require('express');
const appsController = require('../controllers/appsController');
const optimizationController = require('../controllers/optimizationController');
const settingsController = require('../controllers/settingsController');

const router = express.Router();

router.get('/deployments', appsController.viewAllDeployments, (req, res) => {
    return res.status(200).json(res.locals.deployments)
})

// Optimizes routes

router.post('/settings/update',settingsController.updateOptimizationSettings, (req, res) => {
    return res.status(200).json()
})

router.post('/settings/optimizeOn')

router.post('/settings/optimizeOff')