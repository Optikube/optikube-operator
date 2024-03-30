const router = require("express").Router();
const analysisController = require("../controllers/analysisController");

router.get("/runningPods", analysisController.getRunningPods, (req, res) => {
    res.status(200).json(res.locals.runningPods);
});

module.exports = router;