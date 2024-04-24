// Applies business logic to the data retrieved with kubecostAdapter.
// Utilizing the data fetched by the adapter in ways that fulfill the application's specific purposes and goals.
const fetchDeploymentKubecostMetrics = require('../adapters/kubecostAdapter')
const fetchChartKubecostMetrics = require('../adapters/kubecostAdapter')

class KubecostService {
    async getKubecostMetricsForOptimization() {
        try {
            const response = await fetchDeploymentKubecostMetrics('6h');
            // It's formatted as an array of objects but only has one object with all deployments by namespace?
            return response.data[0];
        } catch (error) {
            throw {
                origin: "KubecostService.getKubecostMetricsForOptimization",
                type: "KubecostService Error",
                error: error,
                message: `Failed to fetch kubecost data for optimization: ${error.message}`
            }
        }
    }
    async getKubecostMetricsForCharts(params) {
        try {
            const response = await getKubecostMetricsForCharts(params);
            // It's formatted as an array of objects but only has one object with all deployments by namespace?
            return response.data[0];
        } catch (error) {
            throw {
                origin: "KubecostService.getKubecostMetricsForOptimization",
                type: "KubecostService Error",
                error: error,
                message: `Failed to fetch kubecost data for optimization: ${error.message}`
            }
        }
    }
}

module.exports = new KubecostService();