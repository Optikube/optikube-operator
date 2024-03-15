const express = require('express');
const { evaluateCostAndUpdateHPA } = require('./operator')

const app = express();

const port = 8080;

const kubecostRoutes = require('./routes/kubecostRoutes.js');
const analysisRoutes = require ('./routes/analysisRoutes.js');
const axios = require('axios');
const hostname = '0.0.0.0';
const PORT = 8080;

let isRunning = false;
let costExceedsThreshold = false;
let lowerLimit = 20;
let upperLimit = 40;


app.use('/api/analysis', analysisRoutes);
app.use('/api',kubecostRoutes);
app.get('/', (req, res) =>{
  res.send('8080 is working and ready to goooooooo!');
});

const continuousEvaluateCostAndUpdateHPA = async () => {
  if (!isRunning) return;
  else {
    console.log('isRunning: ', isRunning);
    await evaluateCostAndUpdateHPA(costExceedsThreshold, lowerLimit, upperLimit);
    console.log('Evaluating cost and updating HPA.')
    setTimeout(continuousEvaluateCostAndUpdateHPA, 1000)
  }
}

app.get('/start', (req, res) => {
  // invoke cost calculation and invoke hpa autoscale
  if (!isRunning) {
    isRunning = true;
    continuousEvaluateCostAndUpdateHPA().catch(err => console.error(err));
    console.log('Autoscaling started.')
    res.status(200).send('Autoscaling started.');
  } else {
    console.log('Autoscaling already running.')
    res.status(200).send('Autoscaling already running.');
  }
})

app.get('/stop', (req, res) => {
  isRunning = false;
  console.log('isRunning: ', isRunning);
  console.log("Autoscaling stopped.")
  res.status(200).send('Autoscaling stopped.')
})

app.get('/adjust', (req, res) => {
  if (req.query.costExceedsThreshold !== undefined) {
    costExceedsThreshold = req.query.costExceedsThreshold === 'true';
}
  lowerLimit = req.query.lowerLimit ? parseInt(req.query.lowerLimit) : lowerLimit;
  upperLimit = req.query.upperLimit ? parseInt(req.query.upperLimit) : upperLimit;
  console.log('Parameters adjusted.')
  res.status(200).send('Parameters adjusted.')
})

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
