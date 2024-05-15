const k8s = require('@kubernetes/client-node');
const kc = new k8s.KubeConfig();
// Loads Kubernetes configuration from inside the cluster.
kc.loadFromCluster();
// Establish Kubernetes API for custom object manipulation.
const k8sApi = kc.makeApiClient(k8s.CustomObjectsApi)
// kedaOperator uses inputs from kedaService to programatically alter KEDA scaled objects in our Kubernetes cluster.
class KedaOperator {
    // Creates a KEDA scaled object from supplied spec in Kubernetes cluster.
    async createScaledObject(scaledObject) {
        try {
            // Establish necessary parameters for Kubernetes API method.
            const group = "keda.sh";
            const version = "v1alpha1";
            const namespace = scaledObject.metadata.namespace;
            const plural = "scaledobjects";
            const name = scaledObject.metadata.name;
            // Initiate the creation of KEDA scaled object based off parameters and supplied scaled object configuration.
            const response = await k8sApi.createNamespacedCustomObject(group, version, namespace, plural, scaledObject);
            // Success log.
            console.log(`Scaled object ${name} created by operator in Kubernetes cluster.`);
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
    // Retrieves a KEDA scaled object tied to the specified namespace and deployment from the Kubernetes cluster.
    async readScaledObject(namespace, deployment) {
        try {
            // Establish necessary parameters for Kubernetes API method.
            const group = "keda.sh";
            const version = "v1alpha1";
            const plural = "scaledobjects";
            const name = `scaled-object-${deployment}`;
            // Initiate the retrieval of KEDA scaled object for specifed deployment and namespace from Kubernetes cluster. 
            const scaledObject = await k8sApi.getNamespacedCustomObject(group, version, namespace, plural, name);
            // Return the KEDA scaled object.
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
    // Updates a KEDA scaled object for the specified namespace and deployment from the supplied spec in the Kubernetes cluster.
    async updateScaledObject(namespace, deployment, scaledObject) {
        try {
            // Assign scaledObject to body variable for use in Kubernetes API method patch request.
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
            // Success log.
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
    // Deletes a KEDA scaled object tied to the specified namespace and scaled object name from the Kubernetes cluster.
    async deleteScaledObject(namespace, scaledObjectName) {
        try {
            // Establish necessary parameters for Kubernetes API method.
            const group = "keda.sh";
            const version = "v1alpha1";
            const plural = "scaledobjects";
             // Initiate the deletion of KEDA scaled object for specifed deployment and namespace in Kubernetes cluster. 
            await k8sApi.deleteNamespacedCustomObject(group, version, namespace, plural, scaledObjectName, {});
            // Succes log.
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
