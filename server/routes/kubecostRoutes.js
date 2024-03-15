// retrieve data from Kubecost APIs (call functions defined in kubecost controller file)


const express = require('express');
const router = express.Router();
const kubecostController = require('../controllers/kubecostClientController.js');


//pods tend to die, may need to change out w new pod name
const theChosenPod = "optikube-deployment-5f77bdfd84-9bzx7";

router.get('/kubecost-data', kubecostController.kubecostAllocationData, (req,res) =>{
   try {
       //json modified to show only pod specific metrics (no __idle__ obj)
    //    res.status(200).json(res.locals.allocation.data.data[0][theChosenPod]);

    //attempting to display slimmed down obj w metrics
       res.status(200).json(res.locals.allocation);
   } catch (error) {
       console.log('could not write allocation data.')
   }
} );

router.get('/namespace-data', kubecostController.kubecostNamespaceData, (req,res) =>{
   try {
    console.log('res.locals from router ->', res.locals.namespaceData.data);
       //json modified to show only pod specific metrics (no __idle__ obj)
    //    res.status(200).json(res.locals.allocation.data.data[0][theChosenPod]);

    //attempting to display slimmed down obj w metrics
       res.status(200).json(res.locals.namespaceData.data);
   } catch (error) {
       console.log('could not write namespace data.')
   }
} );


module.exports = router;
