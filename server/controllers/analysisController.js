const analysisController = {};
const { JSONPath } = require('jsonpath');
const k8s = require('@kubernetes/client-node');

// Load kubeconfig from default location
const kubeConfig = new k8s.KubeConfig();
kubeConfig.loadFromDefault();

// Create Kubernetes API client
const k8sApi = kubeConfig.makeApiClient(k8s.CoreV1Api);


analysisController.getCPUdata = async (req, res, next) => {
    try {
        const namespace = "kube-system";
        const podMetrics = await k8sApi.listNamespacedPod(namespace);
        const podList = podMetrics.body.items;

        podList.forEach((pod) => {
            const podName = pod.metadata.name;
            const podUsage = pod.podUsage.cpu || '0';
            console.log(`Pod: ${podName}, CPU Usage: ${podUsage}`);
        })
        return next();
    } catch (error) {
        return next("Error in analysisController.getCPUdata:  " + JSON.stringify(err));
    }
}

module.exports = analysisController;