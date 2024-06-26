// Makes HTTP requests to kubecost API
// Handles headers, query parameters, specific to Kubecost


const axios = require('axios');
// This will need to be dynamically set.
const kubecostAddress = process.env.KUBECOST_ADDRESS || 'http://kubecost-cost-analyzer.kubecost.svc.cluster.local:9090/model/allocation';
// This will be the standard endpoint for most of out 

async function fetchDeploymentKubecostMetrics (window) {
    try {
        const params = {
            window: window,
            aggregate: 'controllerKind,controller',
            accumulate: 'true',
            idle: 'true',
        };

        const response = await axios.get(kubecostAddress, { 
            params,
         });
        // It's formatted as an array of objects but only has one object with all deployments by namespace?
        return response.data
    } catch (error) {
        throw {
            origin: "kubecostAdapter.fetchKubecostMetrics",
            type: "Kubecost API Request Error",
            error: error,
            message: `Failed to fetch kubecost data from Kubecost API: ${error.message}`
        }
    }
}

async function fetchChartKubecostMetrics (params) {
    try {
        const response = await axios.get(kubecostAddress, { params,});
        return response.data;
    } catch (error) {
        throw {
            origin: "kubecostAdapter.fetchChartKubecostMetrics",
            type: "Kubecost API Request Error",
            error: error,
            message: `Failed to fetch kubecost data from Kubecost API: ${error.message}`
        }
    }
}

module.exports = fetchChartKubecostMetrics;
module.exports = fetchDeploymentKubecostMetrics;