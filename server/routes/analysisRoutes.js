const router = require("express").Router();
const analysisController = require("../controllers/analysisController");

router.get("/cpu", analysisController.getCPUdata, (req, res) => {
    return res.status(200);
})

module.exports = router;