// retrieve data from Kubecost APIs (call functions defined in kubecost controller file)

const express = require('express');
const router = express.Router();
const kubecostController = require('../controllers/kubecostClientController.js');

router.get('/kubecost-data', kubecostController.kubecostAllocationData, (req,res) =>{
    try {
        res.status(200).json(res.locals.allocation.data);
    } catch (error) {
        console.log('could not write allocation data.')
    }
} );

module.exports = router;