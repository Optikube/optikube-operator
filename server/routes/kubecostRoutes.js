// retrieve data from Kubecost APIs (call functions defined in kubecost controller file)


const express = require('express');
const router = express.Router();
const kubecostController = require('../controllers/kubecostClientController.js');


//pods tend to die, may need to change out w new pod name
const theChosenPod = "optikube-deployment-5f77bdfd84-5js5x";
router.get('/kubecost-data', kubecostController.kubecostAllocationData, (req,res) =>{
   try {
       //json modified to show only pod specific metrics (no __idle__)
       res.status(200).json(res.locals.allocation.data.data[0][theChosenPod]);
   } catch (error) {
       console.log('could not write allocation data.')
   }
} );


module.exports = router;
