import axios from "axios";

const analysisController = {};
const k8s = require("@kubernetes/client-node");

// Load kubeconfig from default location
const kubeConfig = new k8s.KubeConfig();
kubeConfig.loadFromDefault();

// Create Kubernetes API client
const k8sApi = kubeConfig.makeApiClient(k8s.CoreV1Api);

analysisController.getRunningPods = async (req, res, next) => {
  try {
    const namespace = "php-namespace";
    console.log(">>> namespace: ", namespace);
    const podMetrics = await k8sApi.listNamespacedPod(namespace);
    const podList = podMetrics.body.items;

    const runningPods = podList.filter((pod) => pod.status.phase === "Running");
    console.log(">>> running Pods: ", runningPods.length);
    res.locals.runningPods = runningPods.length;
    return next();
  } catch (error) {
    return next(
      "Error in analysisController.getRunningPods:  " + JSON.stringify(error)
    );
  }
};

analysisController.getCPU = async (req, res, next) => {
  try {
    // http://localhost:9090/assets/model/allocation
    const test = await axios.get(
      "http://localhost:9090/model/allocation?window=3d&offset=20&limit=10&accumulate=true"
    );
  } catch (error) {

  }
}


module.exports = analysisController;
