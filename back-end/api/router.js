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

// Kubecost Data Route
//--------------------
router.get('fetch/kubecost/charts',  (req, res) => {
    return res.status(200).json({message: "Optimization settings and scaled object retrieved", settings: res.locals.settings, scaledObject: res.locals.scaledObject})
})

// CRUD Routes
//-----------
// Calculates optimization score, stores optimization settings, creates KEDA scaled object, returns specified deployment.
router.post('/create', optimizationController.calculateWeightedOptimizationScore, settingsController.updateOptimizationSettings, kedaController.createScaledObject, deploymentController.getDeployment, (req, res) => {
    return res.status(200).json({message: "Deployment and scaled object successfully created.", response: res.locals.deployment})
})
// Recalculates optimization score, updates stored optimization settings, updates KEDA scaled object, returns specified deployment with updates.
router.patch('/update', optimizationController.calculateWeightedOptimizationScore, settingsController.updateOptimizationSettings, kedaController.updateScaledObject, deploymentController.getDeployment,  (req, res) => {
    return res.status(200).json({message: "Deployment and scaled object successfully updated.", response: res.locals.deployment})
})
// Returns specified deployment.
router.get('/read', deploymentController.getDeployment, (req, res) => {
    return res.status(200).json({message: "Deployment successfully retrieved.", response: res.locals.deployment})
})

// Deletes optimization score, deletes stored optimization settings, deletes KEDA scaled object, returns specified deployment with updates.
router.delete('/delete', settingsController.deleteOptimizationSettings, kedaController.deleteScaledObject, deploymentController.getDeployment, (req, res) => {
    return res.status(200).json({message: "Deployment and scaled object successfully deleted.", response: res.locals.deployment})
})

// Development Assistance Routes
//------------------------------
// Flushes redis DB of all entries/settings.
router.delete('/settings/flush', settingsController.flushRedisDb, (req, res) => {
    return res.status(200).json({ message: "Redis database flushed of all data." })
})
// Retrieves global optimization set that details which deployments will be optimized each hour.
router.get('/settings/read/global', settingsController.getGlobalOptimizationSet, (req, res) => {
    return res.status(200).json(res.locals.result)
})
// Old route for testing deploymentController.getDeployment middleware.
router.get('/read/deployment', deploymentController.getDeployment, (req, res) => {
    return res.status(200).json({message: "Deployment successfully retrieved.", response: res.locals.deployment})
})

module.exports = router;