const k8s = require('@kubernetes/client-node');
const kc = new k8s.KubeConfig();
// Loads the Kubernetes configuratiion from the default location
kc.loadFromCluster();
const k8sApi = kc.makeApiClient(k8s.AppsV1Api);

class DeploymentOperator {
    // Updates specified deployments resources such as request and limits.
    async updateDeploymentResources(namespace, deployment, updatedResources) {
        try {
            // Fetchs the current deployment from Kubernetes and it's configuration.
            const deploymentConfig = await this.getDeployment(deployment, namespace);
            // Destructure the container whose resources will be updated in the deployment.
            const container = deploymentConfig.spec.template.spec.containers[0]
            // Created patch payload with deployment updated resources.
            const body = {
                spec: {
                    template: {
                        spec: {
                            containers: [
                                {   name: container.name,
                                    image: container.image,
                                    resources: updatedResources
                                }
                            ]
                        }
                    }
                }
            };
            // Patches specified deployment in Kubernetes cluster.
            const updatedDeployment = await k8sApi.patchNamespacedDeployment(
                deployment,
                namespace,
                body,
                undefined,  // pretty
                undefined,  // dryRun
                undefined,  // fieldManager
                undefined,  // fieldValidation
                undefined,  // force
                {headers: { "Content-Type": "application/merge-patch+json"}}
            );

            if (updatedDeployment) {
                console.log(`${deployment} resources successfully updated by operator in Kubernetes cluster.`);
            }
            return; 
        } catch (error) {
            console.error('Error updating deployment:', error);
            if (error.response) {
                console.error('HTTP status:', error.response.statusCode);
                console.error('HTTP body:', error.response.body);
            }
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