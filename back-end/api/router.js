const express = require('express');
const deploymentController = require('../controllers/deploymentController');
const optimizationController = require('../controllers/optimizationController');
const settingsController = require('../controllers/settingsController');
const kedaController = require('../controllers/kedaController');
const kubecostAdapter = require('../adapters/kubecostAdapter')

const router = express.Router();

// Route for initial Render of page.
router.get('/deployments', deploymentController.getAllDeployments, (req, res) => {
    return res.status(200).json({message: "Deployments successfully retrieved.", response: res.locals.deployments})
})

// Kubecost Data Routes
router.get('/fetchKubecost',  (req, res) => {
    return res.status(200).json({message: "Optimization settings and scaled object retrieved", settings: res.locals.settings, scaledObject: res.locals.scaledObject})
})

// CRUD Routes
router.patch('/update', optimizationController.calculateWeightedOptimizationScore, settingsController.updateOptimizationSettings, kedaController.updateScaledObject, deploymentController.getAllDeployments,  (req, res) => {
    return res.status(200).json({message: "Deployment and scaled object successfully updated.", response: res.locals.deployments})
})

router.post('/create', optimizationController.calculateWeightedOptimizationScore, settingsController.updateOptimizationSettings, kedaController.createScaledObject, deploymentController.getAllDeployments, (req, res) => {
    return res.status(200).json({message: "Deployment and scaled object successfully created.", response: res.locals.deployments})
})

router.delete('/delete', settingsController.deleteOptimizationSettings, kedaController.deleteScaledObject, deploymentController.getAllDeployments, (req, res) => {
    return res.status(200).json({message: "Deployment and scaled object successfully deleted.", response: res.locals.deployments})
})

router.get('/read', deploymentController.getAllDeployments, (req, res) => {
    return res.status(200).json({message: "Deployments successfully retrieved.", response: res.locals.deployments})
})

// Development Assistance Routes
router.delete('/settings/flush', settingsController.flushRedisDb, (req, res) => {
    return res.status(200).json({ message: "Redis database flushed of all data." })
})

router.get('/settings/read/global', settingsController.getGlobalOptimizationSet, (req, res) => {
    return res.status(200).json(res.locals.result)
})

module.exports = router;