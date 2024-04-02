const express = require('express');
const appsController = require('../controllers/appsController')

const router = express.Router();

router.get('/deployments', appsController.viewAllDeployments, (req, res) => {
    return res.status(200).json(res.locals.deployments)
})