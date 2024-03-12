const express = require('express');
const evaluateCostAndUpdateHPA = require('./operator.js')

const app = express();

const port = 8080;

const kubecostRoutes = require('./routes/kubecostRoutes.js');
const axios = require('axios');
const hostname = '0.0.0.0';
const PORT = 8080;

let isRunning = false;
let costExceedsThreshold = false;
let lowerLimit = 50;
let upperLimit = 80;

app.use('/api',kubecostRoutes);
app.get('/', (req, res) =>{
  res.send('working?');
});

const continuousEvaluateCostAndUpdateHPA = async () => {
  while (isRunning) {
    await evaluateCostAndUpdateHPA(costExceedsThreshold, lowerLimit, upperLimit);
    // delay between invocation
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}

app.get('/start', (req, res) => {
  // invoke cost calculation and invoke hpa autoscale
  if (!isRunning) {
    isRunning = true;
    continuousEvaluateCostAndUpdateHPA().catch(err => console.error(err));
    res.status(200).send('Autoscaling started.');
  } else {
    res.status(200).send('Autoscaling already running.');
  }
})

app.get('/stop', (req, res) => {
  isRunning = false;
  res.status(200).send('Autoscaling stopped.')
})

app.get('/adjust', (req, res) => {
  if (req.query.costExceedsThreshold !== undefined) {
    costExceedsThreshold = req.query.costExceedsThreshold === 'true';
}
  lowerLimit = req.query.lowerLimit ? parseInt(req.query.lowerLimit) : lowerLimit;
  upperLimit = req.query.upperLimit ? parseInt(req.query.upperLimit) : upperLimit;
  res.status(200).send('Parameters adjusted.')
})

app.listen(port, () => {
  console.log(`Server listening on port: ${port}...`);
});
