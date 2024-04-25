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
            const name = scaledObject.metadata.name;

            //Name not scaledObject
            const response = await k8sApi.createNamespacedCustomObject(group, version, namespace, plural, scaledObject);
            // Should we be sending back a confirmation response??
            console.log(`Scaled object ${name} created by operator in Kubernetes cluster.`);
            return response;
        } catch (error) {
            throw {
                origin: "KedaOperator.createScaledObject",
                type: "Operator Error",
                error: error,
                message: `Failed to create scaled object in Kubernetes cluster: ${error.message}`
            }
        }
    }

    async readScaledObject(namespace, deployment) {
        try {
            const group = "keda.sh";
            const version = "v1alpha1";

            const plural = "scaledobjects";
            const name = `scaled-object-${deployment}`;

            const scaledObject = await k8sApi.getNamespacedCustomObject(group, version, namespace, plural, name);
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

    async updateScaledObject(namespace, deployment, scaledObject) {
        try {
            const body = scaledObject;
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

    async deleteScaledObject(namespace, scaledObjectName) {
        try {
            const group = "keda.sh";
            const version = "v1alpha1";
            const plural = "scaledobjects"
            
            await k8sApi.deleteNamespacedCustomObject(group, version, namespace, plural, scaledObjectName, {});

            console.log(`${scaledObjectName} successfully deleted by operator in Kubernetes cluster.`);
            return;
        } catch (error) {
            throw {
                origin: "KedaOperator.updateScaledObject",
                type: "Operator Error",
                error: error,
                message: `Failed to delete ${scaledObjectName} in Kubernetes cluster: ${error.message}`
            }
        }
    }
};

module.exports = new KedaOperator();
