// Applies the optimization strategy to kubenetes infrastucture
// Imports the Kubernetes client library.
const k8s = require('@kubernetes/client-node');
// Kube.config represents the Kubernetes configuration which we are assigning to kc.
const kc = new k8s.KubeConfig();
// Loads the Kubernetes configuratiion from the default location
// This can be changing to a specific path depending on need
kc.loadFromCluster();

const k8sApi = kc.makeApiClient(k8s.AppsV1Api);

async function updateDeploymentResources(namespace, deployment, updatedResources) {
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
            log: 'Error getting calculating weightedOptimzationScore.',
            error: error.message 
        }
    }
}


async function updateKedaTargetCPUUtil () {

}