const express = require('express');
const appsController = require('../controllers/appsController');
const optimizationController = require('../controllers/optimizationController');

const router = express.Router();

router.get('/deployments', appsController.viewAllDeployments, (req, res) => {
    return res.status(200).json(res.locals.deployments)
})

// Optimizes routes

router.post('api/optimize/settings',optimizationController.setOptimizationSettings, (req, res) => {
    return res.status(200).json()
})