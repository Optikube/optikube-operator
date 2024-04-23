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

// router.patch('/settings/update', optimizationController.calculateWeightedOptimizationScore, settingsController.updateOptimizationSettings,kedaController.updateScaledObject, (req, res) => {
//     return res.status(200).json({message: "Optimization settings updated successfully."})
// })

// router.post('/settings/create', optimizationController.calculateWeightedOptimizationScore, settingsController.updateOptimizationSettings, kedaController.createScaledObject, (req, res) => {
//     return res.status(200).json({message: "Optimization settings created successfully and autoscaling started."})
// })

// router.delete('/settings/delete', settingsController.deleteOptimizationSettings, kedaController.deleteScaledObject, (req, res) => {
//     return res.status(200).json({message: "Optimization settings removed successfully and autoscaling stopped."})
// })

// router.get('/settings/read', settingsController.getOptimizationSettings, kedaController.getOptimizationSettings, (req, res) => {
//     return res.status(200).json({ settings: res.locals.result })
// })


router.patch('/update', optimizationController.calculateWeightedOptimizationScore, settingsController.updateOptimizationSettings, kedaController.updateScaledObject, (req, res) => {
    return res.status(200).json({message: "Optimization settings and scaled obeject updated successfully."})
})

router.post('/create', optimizationController.calculateWeightedOptimizationScore, settingsController.updateOptimizationSettings, kedaController.createScaledObject, (req, res) => {
    return res.status(200).json({message: "Optimization settings and scaled object created successfully.", response: res.locals.response})
})

router.delete('/delete', settingsController.deleteOptimizationSettings, kedaController.deleteScaledObject, (req, res) => {
    return res.status(200).json({message: "Optimization settings and scaled object deleted successfully."})
})

router.get('/read', settingsController.getOptimizationSettings, kedaController.readScaledObject, (req, res) => {
    return res.status(200).json({message: "Optimization settings and scaled object retrieved", settings: res.locals.settings, scaledObject: res.locals.scaledObject})
})

router.delete('/settings/flush', settingsController.flushRedisDb, (req, res) => {
    return res.status(200).json({ message: "Redis database flushed of all data." })
})

router.get('/settings/read/global', settingsController.getGlobalOptimizationSet, (req, res) => {
    return res.status(200).json(res.locals.result)
})

module.exports = router;