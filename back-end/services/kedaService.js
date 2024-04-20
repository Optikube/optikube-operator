const kedaOperator = require('../operators/kedaOperator');
const balancedStrategy = require("../kedaStrats/balancedStrategy");
const costEfficientStrategy = require('../kedaStrats/costEfficientStrategy');
const performanceStrategy = require('../kedaStrats/performanceStrategy');



class KedaService {
    async determineScalingPolicies(optimizationScore) {
        try {
            let scalingPolicies;
            if (optimizationScore >= 1.0 && optimizationScore <= 1.6) {
                scalingPolicies = await performanceStrategy.calculateScalingPolicies();
            }
            if (optimizationScore >= 1.7 && optimizationScore <= 2.3) {
                scalingPolicies = await balancedStrategy.calculateScalingPolicies();
            }
            if (optimizationScore >= 2.4 && optimizationScore <= 3.0) {
                scalingPolicies = await costEfficientStrategy.calculateScalingPolicies(); 
            }

            if(scalingPolicies) {
                return scalingPolicies;
            } else {
                return res.status(400).json({
                    error: "Scaling policies not determined in KedaService.determineScalingPolicies."
                });
            }
        } catch (error) {
            console.error(`Error determining scaling policies in KedaService.determineScalingPolicies.`)
            return res.status(500).json({
                log: `Error determining scaling policies in KedaService.determineScalingPolicies.`,
                message: { error: error.message || "An error occured." },
            });
        }
    }


    async createScaledObject(namespace, deployment, kedaSpec, optimizationScore) {
        try {
            const scaledObjectConfig = await this.determineScalingPolicies(optimizationScore);
            
            console.log("parameters:", namespace, deployment, kedaSpec, optimizationScore);
      
            const scaledObject = {
                apiVersion: 'keda.sh/v1alpha1',
                kind: 'ScaledObject',
                metadata: {
                    name: `scaled-object-${deployment}`,
                    namespace: namespace,
                },
                spec: {
                    scaleTargetRef: {
                        name: deployment,
                    },
                    pollingInterval: 30, // We might be able to caclulate all this similar to the target CPU utilization?
                    cooldownPeriod: scaledObjectConfig.cooldownPeriod,
                    minReplicaCount: kedaSpec.minReplicaCount,
                    maxReplicaCount: kedaSpec.maxReplicaCount,
                    advanced: {
                        restoreToOriginalReplicaCount: true,
                        horizontalPodAutoscalerConfig: { 
                            behavior: scaledObjectConfig.behavior
                        },
                    },
                    triggers: [
                        {
                            type: "cpu",
                            metadata:
                                {
                                    type: "Utilization",
                                    value: `${scaledObjectConfig.cpuUtilization}`, // We don't want to hard code this in ideally, so we'll need to get the service endpoint
                                },
                        },
                    ],
                },
            };
            console.log('scaled object', scaledObject);

            const response = await kedaOperator.createScaledObject(scaledObject);
            return response;
            // Should we be sending back a confirmation response??
        } catch (error) {
            console.error(`Error creating scaled object in KedaService.createScaledObject.`)
            return res.status(500).json({
                log: `Error creating scaled object in KedaService.createScaledObject.`,
                message: { error: error.message || "An error occured." },
            });
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
            console.error(`Error reading scaled object in KedaService.readScaledObject.`)
            return res.status(500).json({
                log: `Error reading scaled object in KedaService.readScaledObject.`,
                message: { error: error.message || "An error occured." },
            });
        }

    }

    async updateScaledObject(namespace, deployment, kedaSpec, optimizationScore) {
        try {
            const scaledObjectConfig = await this.determineScalingPolicies(optimizationScore);
            const body = {
                apiVersion: 'keda.sh/v1alpha1',
                kind: 'ScaledObject',
                metadata: {
                    name: `scaled-object-${deployment}`,
                    namespace: namespace,
                },
                spec: {
                    scaleTargetRef: {
                        name: deployment,
                    },
                    pollingInterval: 30, // We might be able to caclulate all this similar to the target CPU utilization?
                    cooldownPeriod: scaledObjectConfig.cooldownPeriod,
                    minReplicaCount: kedaSpec.minReplicaCount,
                    maxReplicaCount: kedaSpec.maxReplicaCount,
                    advanced: {
                        restoreToOriginalReplicaCount: true,
                        horizontalPodAutoscalerConfig: { 
                            behavior: scaledObjectConfig.behavior
                        },
                    },
                    triggers: [
                        {
                            type: "cpu",
                            metadata:
                                {
                                    type: "Utilization",
                                    value: `${scaledObjectConfig.cpuUtilization}`, // We don't want to hard code this in ideally, so we'll need to get the service endpoint
                                },
                        },
                    ],
                },
            };
            const response = await kedaOperator.updateScaledObject(namespace, deployment, body);
            return response;
            // Should we be sending back a confirmation response??
        } catch (error) {
            console.error(`Error updating scaled object in KedaService.updateScaledObject.`)
            return res.status(500).json({
                log: `Error updating scaled object in KedaService.updateScaledObject.`,
                message: { error: error.message || "An error occured." },
            });
        }
    }

    async deleteScaledObject(namespace, name) {
        try {
            const response = await kedaOperator.deleteScaledObject(namespace, name);
            // Should we be sending back a confirmation response??
            return response;
        } catch (error) {
            console.error(`Error deleting scaled object in KedaService.deleteScaledObject.`)
            return res.status(500).json({
                log: `Error updating scaled object in KedaService.deleteScaledObject.`,
                message: { error: error.message || "An error occured." },
            });
        }
    }

};

module.exports = new KedaService();