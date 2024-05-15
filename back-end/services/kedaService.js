const kedaOperator = require('../operators/kedaOperator');
const balancedStrategy = require("../kedaStrats/balancedStrategy");
const costEfficientStrategy = require('../kedaStrats/costEfficientStrategy');
const performanceStrategy = require('../kedaStrats/performanceStrategy');

// kedaService.js uses inputs from kedaController.js to perform scaled object operations.
class KedaService {
    // Determines scaling policies based on optimization score.
    async determineScalingPolicies(optimizationScore) {
        try {
            // The following conditional blocks determine HPA scaling policies based on the optimization score.
            // Depending on the strategy invoked a different HPA configuration will be returned.
            // This will be used in scaled object creation or updates.
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
            // Validation check to ensure a scaling policy has been generated.
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
    async createScaledObject(namespace, deployment, scaledObjectSpec, optimizationScore) {
        try {
            // Initiate the determination of the KEDA scaled object's HPA configuration, referred to in this context as scaling policies.
            const scaledObjectConfig = await this.determineScalingPolicies(optimizationScore);
            // Create KEDA object spec utilizing deployment information, user input, and HPA scaling policies.
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
                    minReplicaCount: scaledObjectSpec.minReplicaCount,
                    maxReplicaCount: scaledObjectSpec.maxReplicaCount,
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
            // Validation check for user/deployment inputs, scaled object, and optimization score that will be used in the kedaOperator.
            if (!namespace || !deployment || !scaledObject || !optimizationScore) {
                throw {
                    origin: "kedaService.createScaledObject",
                    type: "Validation Error",
                    status: 400,
                    message: "Missing required parameters."
                };
            }

            // Initiate the creation of the KEDA scaled object using the kedaOperator.
            await kedaOperator.createScaledObject(scaledObject);
            // Success log.
            console.log(`${scaledObject.metadata.name} successfully created for deployment:${deployment}`)
            return;
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
    async readScaledObject(namespace, deployment) {
        try {
            // Initiate the retrieval of KEDA scaled object from kubernetesOperator.
            const { body } = await kedaOperator.readScaledObject(namespace, deployment);
            // Assign response (body) to scaledObject to be returned.
            const scaledObject = body;
            // Success log.
            console.log(`Retrieved scaled object ${scaledObject.metadata.name}`)
            // Return retrieved KEDA scaled object.
            return scaledObject;
        } catch (error) {
            throw {
                origin: "KedaService.readScaledObject",
                type: "Scaled Object Retrieval Error",
                error: error,
                message: `Failed to retrieve scaled object ${deployment}: ${error.message}`
            }
        }
    }
    // Updates a scaled object for specified deployment.
    async updateScaledObject(namespace, deployment, scaledObjectSpec, optimizationScore) {
        try {
            // Initiate the determination of the KEDA scaled object's HPA configuration, referred to in this context as scaling policies.
            const scaledObjectConfig = await this.determineScalingPolicies(optimizationScore);
            // Create KEDA object spec utilizing deployment information, user input, and HPA scaling policies.
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
                    minReplicaCount: scaledObjectSpec.minReplicaCount,
                    maxReplicaCount: scaledObjectSpec.maxReplicaCount,
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
            // Initiate the update of the KEDA scaled object using the kedaOperator.
            await kedaOperator.updateScaledObject(namespace, deployment, scaledObject);
            // Success log.
            console.log(`${scaledObject.metadata.name} successfully updated.`)
            return;
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
    async deleteScaledObject(namespace, scaledObjectName) {
        try {
            // Initiate the deletion of the KEDA scaled object using the kedaOperator.
            await kedaOperator.deleteScaledObject(namespace, scaledObjectName);
            // Success log.
            console.log(`KedaService confirmation ${scaledObjectName} successfully deleted.`)
            return;
        } catch (error) {
            throw {
                origin: "KedaService.deleteScaledObject",
                type: "Scaled Object Deletion",
                error: error,
                message: `Failed to delete scaled object ${scaledObjectName}: ${error.message}`
            }
        }
    }
};

module.exports = new KedaService();