const deploymentOperator = require('../operators/deploymentOperator');
const settingsService = require('../services/settingsService');
const kedaService = require('./kedaService');

class DeploymentService {
    async getAllDeployments(){
        try {
            const response = await deploymentOperator.getAllDeployments()
            // console.log("response", response);
     
            const deployments = response.map(item => ({
                "deployment": {
                    "name": item.metadata.name,
                    "namespace": item.metadata.namespace,
                    "containers": item.spec.template.spec.containers.map(container => ({
                        "name": container.name,
                        "resources": container.resources,
                        "requests": container.resources.requests,
                        "limits": container.resources.limits,
                    }))
                }
            }));
            // This gets back an applicable data for each deployment
            for(const deployment of deployments) {
                // If the name and namespace are in the global optimize set will proceed with getting settings
                const isInGlobalOptimizeSet = await settingsService.isInGlobalOptimizeSet(deployment["deployment"].namespace, deployment["deployment"].name)
                console.log(`${deployment["deployment"].name} in global optimize set`, isInGlobalOptimizeSet);

                if(isInGlobalOptimizeSet) {
                    const optimizationSettings = await settingsService.getOptimizationSettings(deployment["deployment"].namespace, deployment["deployment"].name);
                    console.log("optimization settings", optimizationSettings);
                    const kedaSpec = await kedaService.readScaledObject(deployment["deployment"].namespace, deployment["deployment"].name);
                    console.log("kedaSpec", kedaSpec)

                    deployment["optimization settings"] = {
                        "workload variability:": optimizationSettings.settings['workload variability'],
                        "application criticality:": optimizationSettings.settings['application criticality'],
                        "optimization priority:": optimizationSettings.settings['optimization priority'],
                        "Optimization Score:": optimizationSettings.optimizationScore,
                    }

                    deployment["scaler settings"] = {
                        "scaler settings:": {
                            "name:": kedaSpec.metadata.name,
                            "min replicas:": kedaSpec.spec.minReplicaCount,
                            "max replicas:": kedaSpec.spec.maxReplicaCount,
                            "cooldown period:": kedaSpec.spec.cooldownPeriod,
                            "target cpu utilization:": kedaSpec.spec.triggers[0].metadata.value,
                        }
                    }       
                }
            }    
            console.log("deployments", deployments);
            return deployments;

        } catch (error) {
            throw {
                origin: "DeploymentService.getAllDeployements",
                type: "Deployment Retrieval Error",
                error: error,
                message: `Failed to retrieve deployment: ${error.message}`
            }
        }   
    }

    async getDeployment(deploymentName, namespace) {
        try {
            const response = await deploymentOperator.getDeployment(deploymentName, namespace);
            const isInGlobalOptimizeSet = await settingsService.isInGlobalOptimizeSet(namespace, deploymentName);

            const deployment = {
                "deployment": {
                    "name": response.metadata.name,
                    "namespace": response.metadata.namespace,
                    "requests": response.spec.template.spec.containers[0].resources.requests,
                    "limit": response.spec.template.spec.containers[0].resources.limits,
                }
            }

            if(isInGlobalOptimizeSet) {
                const optimizationSettings = await settingsService.getOptimizationSettings(namespace, deploymentName);
                console.log("optimization settings", optimizationSettings);
                const kedaSpec = await kedaService.readScaledObject(namespace, deploymentName);
                console.log("kedaSpec", kedaSpec)

                deployment["optimization settings"] = {
                    "workload variability:": optimizationSettings.settings['workload variability'],
                    "application criticality:": optimizationSettings.settings['application criticality'],
                    "optimization priority:": optimizationSettings.settings['optimization priority'],
                    "Optimization Score:": optimizationSettings.optimizationScore,
                }

                deployment["scaler settings"] = {
                    "scaler settings:": {
                        "name:": kedaSpec.metadata.name,
                        "min replicas:": kedaSpec.spec.minReplicaCount,
                        "max replicas:": kedaSpec.spec.maxReplicaCount,
                        "cooldown period:": kedaSpec.spec.cooldownPeriod,
                        "target cpu utilization:": kedaSpec.spec.triggers[0].metadata.value,
                    }
                }     
            }
            return deployment;
            
        } catch (error) {
            throw {
                origin: "DeploymentService.getDeployement",
                type: "Deployment Retrieval Error",
                error: error,
                message: `Failed to retrieve deployment: ${error.message}`
            }
        }
    }
}

module.exports = new DeploymentService();