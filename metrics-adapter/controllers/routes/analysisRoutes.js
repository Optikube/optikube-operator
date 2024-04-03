const router = require("express").Router();
const analysisController = require("../controllers/analysisController");

router.get("/runningPods", analysisController.getRunningPods, (req, res) => {
    res.status(200).json(res.locals.runningPods);
});

router.get("/cpu", analysisController.getCPU, (req, res) => {
  res.status(200).json(res.locals.cpu);
});

module.exports = router;