const express = require('express');
const { evaluateCostAndUpdateHPA } = require('./operator')

const app = express();

const port = 8080;

const kubecostRoutes = require('./routes/kubecostRoutes.js');
const analysisRoutes = require ('./routes/analysisRoutes.js');
const axios = require('axios');
const hostname = '0.0.0.0';
const PORT = 8080;

app.listen(port, () => {
  console.log(`Server listening on port: ${port}...`);
});

app.use((err, req, res, next) => {
  const defaultErr = {
    log: "Express error handler caught unknown middleware error",
    status: 500,
    message: { err: "An error occurred" },
  };
  const errorObj = Object.assign({}, defaultErr, err);
  console.log(errorObj.log);
  return res.status(errorObj.status).json(errorObj.message);
});


//Needed Endpoints
// -Connect to K8s cluster
// -Retrieve namespaces, deployments, etc.
// -Scaling
  // -Create or update scaled object (HPA and CRD)
  // -Transfer HPA to KEDA management
// Cluster management 
  // 