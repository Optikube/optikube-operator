const kedaOperator = require('../operators/kedaOperator');
const balancedStrategy = require("../kedaStrats/balancedStrategy");
const costEfficientStrategy = require('../kedaStrats/costEfficientStrategy');
const performanceStrategy = require('../kedaStrats/performanceStrategy');

// kedaService.js uses inputs from kedaController.js to perform scaled object operations.

class KedaService {
    // Determines scaling policies based on optimization score.
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
                console.log("Scaling policies determined for scaled object.")
                return scalingPolicies;
            } else {
                throw {
                    origin: "KedaService.determineScalingPolicies",
                    type: "Validation Error",
                    status: 400,
                    message: "Missing necessary output."
                };
            }
        } catch (error) {
            throw {
                origin: "KedaService.determineScalingPolicies",
                type: "Scaling Policy Calculation Error",
                error: error,
                message: `Failed to determine scaling policies for scaled object: ${error.message}`
            }
        }
    }
    // Creates a scaled object for specified deployment.
    async createScaledObject(namespace, deployment, kedaSpec, optimizationScore) {
        try {
            const scaledObjectConfig = await this.determineScalingPolicies(optimizationScore);
               
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

            await kedaOperator.createScaledObject(scaledObject);

            console.log(`${scaledObject.metadata.name} successfully created for deployment:${deployment}`)
            res.locals.response["Scaled Object"] = scaledObject.metadata.name;

            return

        } catch (error) {
            throw {
                origin: "KedaService.createScaledObject",
                type: "Scaled Object Creation Error",
                error: error,
                message: `Failed to create scaled object for ${deployment}: ${error.message}`
            }
        }
    };
    // Retrieves scaled object for specified deployment.
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
            throw {
                origin: "KedaService.readScaledObject",
                type: "Scaled Object Retrieval Error",
                error: error,
                message: `Failed to retrieve scaled object ${target.name}: ${error.message}`
            }
        }
    }
    // Updates a scaled object for specified deployment.
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
            console.log(`${body.metadata.name} successfully updated.`)
            return;
            // Should we be sending back a confirmation response??
        } catch (error) {
            throw {
                origin: "KedaService.updateScaledObject",
                type: "Scaled Object Update Error",
                error: error,
                message: `Failed to update scaled object for ${deployment}: ${error.message}`
            }
        }
    }
    // Deletes a scaled object for specified deployment.
    async deleteScaledObject(namespace, name) {
        try {
            await kedaOperator.deleteScaledObject(namespace, name);
            // Should we be sending back a confirmation response??
            console.log(`${name} successfully deleted.`)
            return;
        } catch (error) {
            throw {
                origin: "KedaService.deleteScaledObject",
                type: "Scaled Object Deletion Error",
                error: error,
                message: `Failed to delete scaled object ${name}: ${error.message}`
            }
        }
    }
};

module.exports = new KedaService();