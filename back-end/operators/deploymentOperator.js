const k8s = require('@kubernetes/client-node');
const kc = new k8s.KubeConfig();
// Loads the Kubernetes configuratiion from the default location
kc.loadFromCluster();
const k8sApi = kc.makeApiClient(k8s.AppsV1Api);

class DeploymentOperator {
    // Updates specified deployments resources such as request and limits.
    async updateDeploymentResources(namespace, deployment, updatedResources) {
        try {
            // Created patch payload with deployment updated resources.
            const patchPayload = {
                op: 'replace',
                path: '/spec/template/spec/containers/0/resources',
                value: updatedResources,
            };
            // Patches specified deployment in Kubernetes cluster.
            await k8sApi.patchNamespacedDeployment(
                deployment,
                namespace,
                patchPayload,
                undefined, // pretty
                undefined, // dryRun
                undefined, // fieldManager
                undefined, // force
                { headers: { "Content-type": k8s.PatchUtils.PATCH_FORMAT_JSON_PATCH } }
            );
            return;
        } catch (error) {
            throw {
                origin: "DeploymentOperator.updateDeploymentResources",
                type: "Deployment Operator Error",
                error: error,
                message: `Failed to update deployment resources in Kubernetes cluster: ${error.message}`
            }
        }
    }
    // Retrieves all deployments from Kubernetes cluster.
    async getAllDeployments () {
        try {
            // Destructures response and returns.
            const { body } = await k8sApi.listDeploymentForAllNamespaces();
            return body.items;
        } catch (error) {
            throw {
                origin: "DeploymentOperator.getAllDeployments",
                type: "Deployment Operator Error",
                error: error,
                message: `Failed to fetch all deployment in Kubernetes cluster: ${error.message}`
            }
        }
    }
    // Retrieves specified deployment from Kubernetes cluster.
    async getDeployment (deploymentName, namespace) {
        try {
            // Assigns response and returns.
            const response = await k8sApi.readNamespacedDeployment(deploymentName, namespace);
            return response.body;
        } catch (error) {
            throw {
                origin: "DeploymentOperator.getDeployment",
                type: "Deployment Operator Error",
                error: error,
                message: `Failed to fetch deployment in Kubernetes cluster: ${error.message}`
            }
        }
    }
};

module.exports = new DeploymentOperator();