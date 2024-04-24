const kubecostService = require("../services/kubecostService");

kuebcostController = {};

kuebcostController.getKubecostMetricsForCharts = async(req, res, next) => {
    try {
        const { kubecostParams} = req.body.kubecostParams;
        const chartData = kubecostService.getKubecostMetricsForCharts(kubecostParams);
    } catch (error) {
        console.error(`${error.type} in ${error.origin}: ${error.message}`);
        next(error);
    }
};

module.exports = kubecostController;