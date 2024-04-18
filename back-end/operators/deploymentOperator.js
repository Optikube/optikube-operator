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
                patch,
                undefined, // pretty
                undefined, // dryRun
                undefined, // fieldManager
                undefined, // force
                { headers: { "Content-type": k8s.PatchUtils.PATCH_FORMAT_JSON_PATCH } }
            );

        } catch (error) {
            console.error(`Error getting updated deployment:${deployment} resources in updateDeploymentResources.`, error);
            return {
                succes: false,
                log: 'Error updating deployment resources.',
                error: error.message 
            }
        }
    }


    async fetchDeployment (namespace, deploymentName) {
        try {
            const response = k8sApi.readNamespacedDeployment(deploymentName, namespace);
            return response.body.spec;
        } catch (error) {
            console.error(`Error getting spec for deployment:${deployment} resources in updateDeploymentResources.`, error);
            return {
                succes: false,
                log: 'Error getting calculating weightedOptimzationScore.',
                error: error.message 
            }
        }
    }
};

module.exports = new DeploymentOperator();