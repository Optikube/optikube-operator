// Applies business logic to the data retrieved with kubecostAdapter.
// Utilizing the data fetched by the adapter in ways that fulfill the application's specific purposes and goals.
const fetchKubecostMetrics1H = require('../adapters/kubecostAdapter')

class KubecostService {
    async getKubecostMetricsForOptimization() {
        try {
            const response = await fetchKubecostMetrics1H();
            // It's formatted as an array of objects but only has one object with all deployments by namespace?
            return response.data[0];
        } catch (error) {
            console.error('Error getting Kubecost metrics in getKubecostMetricsForOptimization.', error);
            return {
                success: false,
                log: 'Error getting Kubecost metrics in getKubecostMetricsForOptimization.',
                error: error.message 
            }
        }

    }
}

module.exports = new KubecostService();