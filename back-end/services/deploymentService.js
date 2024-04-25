const deploymentOperator = require('../operators/deploymentOperator');
const settingsService = require('../services/settingsService');
const kedaService = require('./kedaService');

class DeploymentService {
    async getAllDeployments(){
        try {
            const response = await deploymentOperator.getAllDeployments()
            // console.log("response", response);
     
            const deployments = response.map(item => ({
                "Deployment Details": {
                    "Name": item.metadata.name,
                    "Namespace": item.metadata.namespace,
                    "Containers": item.spec.template.spec.containers.map(container => ({
                        "Name": container.name,
                        "Resources": container.resources,
                        "Requests": container.resources.requests,
                        "Limits": container.resources.limits,
                    }))
                }
            }));
            // This gets back an applicable data for each deployment
            for(const deployment of deployments) {
                // If the name and namespace are in the global optimize set will proceed with getting settings
                const isInGlobalOptimizeSet = await settingsService.isInGlobalOptimizeSet(deployment["Deployment Details"].Namespace, deployment["Deployment Details"].Name)
                console.log(`${deployment["Deployment Details"].Name} in global optimize set`, isInGlobalOptimizeSet);

                if(isInGlobalOptimizeSet) {
                    const optimizationSettings = await settingsService.getOptimizationSettings(deployment["Deployment Details"].Namespace, deployment["Deployment Details"].Name);
                    console.log("optimization settings", optimizationSettings);
                    const kedaSpec = await kedaService.readScaledObject(deployment["Deployment Details"].Namespace, deployment["Deployment Details"].Name);
                    console.log("kedaSpec", kedaSpec)

                    deployment["Optimization Settings"] = {
                        "Workload Variability:": optimizationSettings.settings['workload variability'],
                        "Application Criticality:": optimizationSettings.settings['application criticality'],
                        "Optimization Priority:": optimizationSettings.settings['optimization priority'],
                        "Optimization Score:": optimizationSettings.optimizationScore,
                    }

                    deployment["Scaler Settings"] = {
                        "Scaler Settings:": {
                            "Name:": kedaSpec.metadata.name,
                            "Min Replicas:": kedaSpec.spec.minReplicaCount,
                            "Max Replicas:": kedaSpec.spec.maxReplicaCount,
                            "Cooldown Period:": kedaSpec.spec.cooldownPeriod,
                            "Target CPU Utilization:": kedaSpec.spec.triggers[0].metadata.value,
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
}

module.exports = new DeploymentService();