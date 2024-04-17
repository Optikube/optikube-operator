const kedaOperator = require("../operators/kedaOperator");



class KedaService {
    async createScaledObject(settings, optimizationScore) {
        try {
            // Maybe start by cacluating initial metrics for scaledObject?
            const scaledObject = {
                apiVersion: 'keda.sh/v1alpha',
                kind: 'ScaledObject',
                metadata: {
                    name: settings.deployment,
                    namespace: settings.namespace,
                },
                spec: {
                    scaleTargetRef: {
                        name: settings.targetName
                    }
                },
                // pollingInterval: settings.pollingInterval, // We might be able to caclulate all this similar to the target CPU utilization?
                // cooldownPeriod: settings.cooldownPeriod,
                // minReplicaCount: settings.minReplicaCount,
                // maxReplicaCount: settings.maxReplicaCount,
                triggers: [
                    {
                        type: 'cpu',
                        metricType: 'Utilization',
                        metadata:
                            {
                                type: "Utilization",
                                value: "50", // We don't want to hard code this in ideally, so we'll need to get the service endpoint
                            },
                    },
                ],
            };
            await kedaOperator.createScaledObject(scaledObject);
            // Should we be sending back a confirmation response??
        } catch (error) {
            console.error('Error creating scaled object in kedaService.', error);
            return {
                success: false,
                log: 'Error creating scaled object in kedaService.',
                error: error.message
            }
        }
    };
    
    async readScaledObject(target) {
        try {
           const targetScaledObject = {
                group: 'keda.sh',
                version: 'v1alpha1',
                namespace: target.namespace,
                plural: 'scaledobjects',
                name: target.name, // name of ScaledObject (we probably need to standardize naming)
            }
            const scaledObject = await kedaOperator.readScaledObject(targetScaledObject);
            return scaledObject;
        } catch (error) {
            console.error('Error reading scaled object in kedaService.', error);
            return {
                success: false,
                log: 'Error reading scaled object in kedaService.',
                error: error.message
            } 
        }

    }

    async updateScaledObject(target, patchPayload) {
        try {
            const targetUpdates = {
                group: 'keda.sh',
                version: 'v1alpha1',
                namespace: target.namespace,
                plural: 'scaledobjects',
                name: target.deployment,
                body: patchPayload,
                undefined,
                undefined,
                undefined,
                headers: { 'Content-Type': 'application/merge-patch+json' }
            }
            await kedaOperator.updateScaledObject(targetUpdates);
            // Should we be sending back a confirmation response??
        } catch (error) {
            console.error('Error updating scaled object in kedaService.', error);
            return {
                succes: false,
                log: 'Error reading scaled object in kedaService.',
                error: error.message
            } 
        }
    }

    async deleteScaledObject(target) {
        try {
            const targetScaledObject = {
                group: 'keda.sh',
                version: 'v1alpha1',
                namespace: target.namespace,
                plural: 'scaledobjects',
                name: target.name,
                body: {}
            }
            await kedaOperator.deleteScaledObject(targetScaledObject);
            // Should we be sending back a confirmation response??
        } catch (error) {
            console.error('Error deleting scaled object in kedaService.', error);
            return {
                success: false,
                log: 'Error deleting scaled object in kedaService.',
                error: error.message
            } 
        }
    }

};

module.exports = new KedaService();