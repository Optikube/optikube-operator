const express = require('express');
const path = require('path');
const { evaluateCostAndUpdateHPA } = require('./operators/operator')

const app = express();
const PORT = 8080;

// Imports for routers here
const appsRouter = require('./api/router');

// Start the optimization scheduler wehn the application starts.
optimizationScheduler.start()

//Start server.
app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}...`);
});

// Parse all responses in JSON
app.use(express.json());

// Route handlers
app.use('/api/', appsRouter)



// Catch all route handler for any requests to unknown route.
app.use((req, res) => {
  res.sendStatus(404);
})

// Global error handler
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