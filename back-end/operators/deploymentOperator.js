const k8s = require('@kubernetes/client-node');
const kc = new k8s.KubeConfig();
// Loads the Kubernetes configuratiion from the default location
kc.loadFromCluster();
const k8sApi = kc.makeApiClient(k8s.AppsV1Api);

class DeploymentOperator {
    async updateDeploymentResources(namespace, deployment, updatedResources) {
        try {
            const patchPayload = {
                op: 'replace',
                path: '/spec/template/spec/containers/0/resources',
                value: updatedResources,
            };
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

        } catch (error) {
            throw {
                origin: "DeploymentOperator.updateDeploymentResources",
                type: "Deployment Operator Error",
                error: error,
                message: `Failed to update deployment resources in Kubernetes cluster: ${error.message}`
            }
        }
    }


    async fetchDeployment (namespace, deploymentName) {
        try {
            const response = k8sApi.readNamespacedDeployment(deploymentName, namespace);
            return response.body.spec;
        } catch (error) {
            throw {
                origin: "DeploymentOperator.fetchDeployment",
                type: "Deployment Operator Error",
                error: error,
                message: `Failed to fetch deployment in Kubernetes cluster: ${error.message}`
            }
        }
    }
    async getAllDeployments () {
        try {
            const { body } = await k8sApi.listDeploymentForAllNamespaces();
            // console.log("body", body);
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

    async getDeployment (deploymentName, namespace) {
        try {
            const response = await k8sApi.readNamespacedDeployment(deploymentName, namespace);
            // console.log("Response.body", response.body);
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