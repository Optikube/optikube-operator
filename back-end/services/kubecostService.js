// Applies business logic to the data retrieved with kubecostAdapter.
// Utilizing the data fetched by the adapter in ways that fulfill the application's specific purposes and goals.
const fetchKubecostMetrics1H = require('../adapters/kubecostAdapter')

class KubecostService {
    async getKubecostMetricsForOptimization() {
        try {
            const response = await fetchKubecostMetrics1H();
            // Transform data pull as necessary before optimization service takes over.

        } catch (error) {
            console.error('Error getting Kubecost metrics in getKubecostMetricsForOptimization.', error);
            return {
                succes: false,
                log: 'Error getting Kubecost metrics in getKubecostMetricsForOptimization.',
                error: error.message 
            }
        }

    }
}