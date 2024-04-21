const k8s = require('@kubernetes/client-node');
const kc = new k8s.KubeConfig();
kc.loadFromCluster();
const k8sApi = kc.makeApiClient(k8s.CustomObjectsApi)

class KedaOperator {
    async createScaledObject(scaledObject) {
        try {
            const group = "keda.sh";
            const version = "v1alpha1";
            const namespace = scaledObject.metadata.namespace;
            const plural = "scaledobjects";


            await k8sApi.createNamespacedCustomObject(group, version, namespace, plural, scaledObject);
            // Should we be sending back a confirmation response??
            console.log("Scaled object created by operator in Kubernetes cluster.");
            return;
        } catch (error) {
            throw {
                origin: "KedaOperator.createScaledObject",
                type: "Operator Error",
                error: error,
                message: `Failed to create scaled object in Kubernetes cluster: ${error.message}`
            }
        }
    }

    async readScaledObject(targetScaledObject) {
        try {
            const scaledObject = await k8sApi.getNamespacedCustomObject(targetScaledObject);
            return scaledObject;
        } catch (error) {
            throw {
                origin: "KedaOperator.readScaledObject",
                type: "Operator Error",
                error: error,
                message: `Failed to retrieve ${targetScaledObject} from Kubernetes cluster: ${error.message}`
            }
        }
    }

    async updateScaledObject(namespace, deployment, body) {
        try {
             await k8sApi.patchNamespacedCustomObject(
                'keda.sh',
                'v1alpha1',
                namespace,
                'scaledobjects',
                `scaled-object-${deployment}`,
                body,
                undefined,
                undefined,
                undefined,
                { headers: { 'Content-Type': 'application/merge-patch+json' } }
            );
            console.log(`scaled-object-${deployment} successfully updated by operator in Kubernetes cluster.`);
            return;
        } catch (error) {
            throw {
                origin: "KedaOperator.updateScaledObject",
                type: "Operator Error",
                error: error,
                message: `Failed to update scaled-object-${deployment} in Kubernetes cluster: ${error.message}`
            }
        }
    }

    async deleteScaledObject(namespace, name) {
        try {
            const group = "keda.sh";
            const version = "v1alpha1";
            const plural = "scaledobjects"
            
            await k8sApi.deleteNamespacedCustomObject(group, version, namespace, plural, name, {});

            console.log(`${name} successfully deleted by operator in Kubernetes cluster.`);
            return;
        } catch (error) {
            throw {
                origin: "KedaOperator.updateScaledObject",
                type: "Operator Error",
                error: error,
                message: `Failed to delete ${name} in Kubernetes cluster: ${error.message}`
            }
        }
    }
};

module.exports = new KedaOperator();
