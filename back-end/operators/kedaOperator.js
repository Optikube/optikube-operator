const k8s = require('@kubernetes/client-node');
const kc = new k8s.KubeConfig();
kc.loadFromCluster();
const k8sApi = kc.makeApiClient(k8s.CustomObjectsApi)

const kedaOperator = {};

class KedaOperator {
    async createScaledObject(scaledObject) {
        try {
            await k8sApi.createNamespacedCustomObject(scaledObject)
            // Should we be sending back a confirmation response??
        } catch (error) {
            console.error(`Error creating scaled object in createScaledObject within kedaOperator.`, error);
            return {
                succes: false,
                log: `Error creating scaled object in createScaledObject within kedaOperator.`,
                error: error.message 
            }
        }
    }

    async readScaledObject(targetScaledObject) {
        try {
            const scaledObject = await k8sApi.getNamespacedCustomObject(targetScaledObject)
            return scaledObject;
        } catch (error) {
            console.error(`Error creating scaled object in createScaledObject within kedaOperator.`, error);
            return {
                succes: false,
                log: `Error creating scaled object in createScaledObject within kedaOperator.`,
                error: error.message 
            }
        }
    }

    async updateScaledObject(targetUpdates) {
        try {
            await k8sApi.patchNamespacedCustomObject(targetUpdates)
            // Should we be sending back a confirmation response??
        } catch (error) {
            console.error(`Error updating scaled object in updateScaledObject within kedaOperator.`, error);
            return {
                succes: false,
                log: `Error updating scaled object in updateScaledObject within kedaOperator.`,
                error: error.message 
            }
        }
    }

    async deleteScaledObject(targetScaledObject) {
        try {
            await k8sApi.deleteNamespacedCustomObject(targetScaledObject)
            // Should we be sending back a confirmation response??
        } catch (error) {
            console.error(`Error deleting scaled object in deleteScaledObject within kedaOperator.`, error);
            return {
                succes: false,
                log: `Error deleting scaled object in deleteScaledObject within kedaOperator.`,
                error: error.message 
            }
        }
    }
};

module.exports = new KedaOperator();
