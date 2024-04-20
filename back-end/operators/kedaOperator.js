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
            const plural = "scaledobjects"


            await k8sApi.createNamespacedCustomObject(group, version, namespace, plural, scaledObject)
            // Should we be sending back a confirmation response??
            return { success: true, message: "Scaled objected created successfully." }
        } catch (error) {
            console.error(`Error creating scaled object in createScaledObject within kedaOperator.`, error);
            return res.status(500).json({
                log: `Error occured in KedaOperator.createScaledObject.`,
                message: { error: error.message || "An error occured." },
            });
        }
    }

    async readScaledObject(targetScaledObject) {
        try {
            const scaledObject = await k8sApi.getNamespacedCustomObject(targetScaledObject)
            return scaledObject;
        } catch (error) {
            console.error(`Error creating scaled object in createScaledObject within kedaOperator.`, error);
            return {
                success: false,
                log: `Error creating scaled object in createScaledObject within kedaOperator.`,
                error: error.message 
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
            return { success: true, message: "Scaled object updated successfully." }
            // Should we be sending back a confirmation response??
        } catch (error) {
            console.error(`Error updating scaled object in updateScaledObject within kedaOperator.`, error);
            return {
                success: false,
                log: `Error updating scaled object in updateScaledObject within kedaOperator.`,
                error: error.message 
            }
        }
    }

    async deleteScaledObject(namespace, name) {
        try {
            const group = "keda.sh";
            const version = "v1alpha1";
            const plural = "scaledobjects"
            const response = await k8sApi.deleteNamespacedCustomObject(group, version, namespace, plural, name, {})
            return { success: true, message: "Scaled object deleted successfully." }
            // Should we be sending back a confirmation response??
        } catch (error) {
            console.error(`Error deleting scaled object in deleteScaledObject within kedaOperator.`, error);
            return {
                success: false,
                log: `Error deleting scaled object in deleteScaledObject within kedaOperator.`,
                error: error.message 
            }
        }
    }
};

module.exports = new KedaOperator();
