const express = require('express');
const path = require('path');
const cors = require('cors');

const optimizationScheduler = require('./services/optimizationScheduler');

const app = express();
const PORT = process.env.SERVER_PORT || 8080;
// Enable CORS for all routes
app.use(cors());
// Parse all responses in JSON
app.use(express.json());
// Imports for routers here
const appsRouter = require('./api/router');

// Start the optimization scheduler wehn the application starts.
optimizationScheduler.start()


// Route handlers
app.use('/api', appsRouter)

// Readiness and Liveness Probes 
app.use('health', (req, res) => {
  res.send('OK');
});
app.use('ready', (req, res) => {
  res.send('OK')
});

// Catch all route handler for any requests to unknown route.
app.use('/', (req, res) => {
  res.sendStatus(404);
})

// Global error handler
app.use((err, req, res, next) => {

  const defaultErr = {
    log: "Express error handler caught unknown middleware error.",
    status: 500,
    message: { err: "An unexpected error occurred." },
    origin: "Unknown",
    type: "Unknown Error"
  };
  
  const errorObj = {...defaultErr, ...err};
  console.error(`Error [${errorObj.type}] at ${errorObj.origin}: ${errorObj.message.err || err.message}`);


  return res.status(errorObj.status).json({
    error: errorObj.message.err || "An error occured",
    location: errorObj.origin,
    type: errorObj.type
  });
  
});

//Start server.
app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}...`);
});
