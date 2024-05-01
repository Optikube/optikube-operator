const deploymentOperator = require('../operators/deploymentOperator');
const settingsService = require('../services/settingsService');
const kedaService = require('./kedaService');

// deploymentService.js retrieves updated deployment/s and creates standardized reponse for front end.
// A deployment middleware is used at the end of each CRUD route.
class DeploymentService {
    // Retrieves all deployments and formats standardized response.
    async getAllDeployments(){
        try {
            // Initiates the retrieval of deployments using the deploymentOperator.
            const response = await deploymentOperator.getAllDeployments()
            // Response is an array of ojects (deployments).
            // Create an array with each deployment with required information and format for response object.
            // All deployments will have this information regardless if they have a KEDA scaled object associated with it.
            const deployments = response.map(item => ({
                "deployment": {
                    "name": item.metadata.name,
                    "namespace": item.metadata.namespace,
                    "requests": item.spec.template.spec.containers[0].resources.requests,
                    "limit": item.spec.template.spec.containers[0].resources.limits,
                }
            }));
            // Iterate back through the deployment array adding further details for those those tagged for optimization and those with a scaled object.
            for(const deployment of deployments) {
                // Checks if the deployment is in the global optimization set before proceeding forward to make any changes to the the deployment. 
                const isInGlobalOptimizeSet = await settingsService.isInGlobalOptimizeSet(deployment["deployment"].namespace, deployment["deployment"].name)
                // Result log.
                console.log(`${deployment["deployment"].name} in global optimize set`, isInGlobalOptimizeSet);
                // If the deployment is in the global optimization set we will make further changes to the deployment object.
                if(isInGlobalOptimizeSet) {
                    // Fetch deployment's optimization settings from settingsService.
                    const optimizationSettings = await settingsService.getOptimizationSettings(deployment["deployment"].namespace, deployment["deployment"].name);
                    // console.log("optimization settings", optimizationSettings);
                    // Fetch the deployments KEDA spec from kedaService.
                    const kedaSpec = await kedaService.readScaledObject(deployment["deployment"].namespace, deployment["deployment"].name);
                    // console.log("kedaSpec", kedaSpec)
                    // Create a "optimization settings" property for deployment and assign necessary properties for standardized response.
                    deployment["optimization settings"] = {
                        "workload variability:": optimizationSettings.settings['workload variability'],
                        "application criticality:": optimizationSettings.settings['application criticality'],
                        "optimization priority:": optimizationSettings.settings['optimization priority'],
                        "min cpu request": `${optimizationSettings.settings['min cpu request']}m`,
                        "optimization score:": optimizationSettings.optimizationScore,
                        "optimization strategy": optimizationSettings.optimizationStrategy,
                    }
                    // Create a "scaler settings" property for deployment and assign necessary properties for standardized response.
                    deployment["scaler settings"] = {
                        "name:": kedaSpec.metadata.name,
                        "min replicas:": kedaSpec.spec.minReplicaCount,
                        "max replicas:": kedaSpec.spec.maxReplicaCount,
                        "cooldown period:": kedaSpec.spec.cooldownPeriod,
                        "target cpu utilization:": kedaSpec.spec.triggers[0].metadata.value,
                    }       
                }
            }
            // Succces log.    
            console.log("deployments", deployments);
            // Return deployments array.
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
            // Initiates the retrieval of deployment using the deploymentOperator.
            const response = await deploymentOperator.getDeployment(deploymentName, namespace);
            // Checks if the deployment is in the global optimization set before proceeding forward to make any changes to the the deployment.
            const isInGlobalOptimizeSet = await settingsService.isInGlobalOptimizeSet(namespace, deploymentName);
            // Establish deployment object for standardized response.
            // All deployments will have this information regardless if they have a KEDA scaled object associated with it.
            const deployment = {
                "deployment": {
                    "name": response.metadata.name,
                    "namespace": response.metadata.namespace,
                    "requests": response.spec.template.spec.containers[0].resources.requests,
                    "limit": response.spec.template.spec.containers[0].resources.limits,
                }
            }
            // If the deployment is in the global optimization set we will make further changes to the deployment object.
            if(isInGlobalOptimizeSet) {
                // Fetch deployment's optimization settings from settingsService.
                const optimizationSettings = await settingsService.getOptimizationSettings(namespace, deploymentName);
                // console.log("optimization settings", optimizationSettings);
                // Fetch the deployments KEDA spec from kedaService.
                const kedaSpec = await kedaService.readScaledObject(namespace, deploymentName);
                // console.log("kedaSpec", kedaSpec)
                // Create a "optimization settings" property for deployment and assign necessary properties for standardized response.
                deployment["optimization settings"] = {
                    "workload variability:": optimizationSettings.settings['workload variability'],
                    "application criticality:": optimizationSettings.settings['application criticality'],
                    "optimization priority:": optimizationSettings.settings['optimization priority'],
                    "min cpu request": `${optimizationSettings.settings['min cpu request']}m`,
                    "optimization score:": optimizationSettings.optimizationScore,
                    "optimization strategy": optimizationSettings.optimizationStrategy,
                }
                // Create a "scaler settings" property for deployment and assign necessary properties for standardized response.
                deployment["scaler settings"] = {
                    "name:": kedaSpec.metadata.name,
                    "min replicas:": kedaSpec.spec.minReplicaCount,
                    "max replicas:": kedaSpec.spec.maxReplicaCount,
                    "cooldown period:": kedaSpec.spec.cooldownPeriod,
                    "target cpu utilization:": kedaSpec.spec.triggers[0].metadata.value,
                }     
            }
            // Succces log.    
            console.log("deployment", deployment);
            // Return deployment obejct.
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