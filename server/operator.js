// Imports the Kubernetes client library.
const k8s = require('@kubernetes/client-node');
// Kube.config represents the Kubernetes configuration which we are assigning to kc.
const kc = new k8s.KubeConfig();
// Loads the Kubernetes configuratiion from the default location
// This can be changing to a specific path depending on need
kc.loadFromCluster();
// Confirm kc config?
console.log('kc config', kc)

//What is the difference in the Autoscaling v1 vs v2?
const autoscalingClient = kc.makeApiClient(k8s.AutoscalingV1Api)

// Function to update HPA threshold
async function updateHPAThreshold(hpaName, namespace, newCpuTarget) {
    console.log('autoscalingClient', autoscalingClient)
    try {
        // Fetch the current HPA configuration.
        const response = await autoscalingClient.readNamespacedHorizontalPodAutoscaler(hpaName, namespace);
        console.log('Response:', response)
        // Check if response is ok.
        // Response.statusCode 
        if (response.statusCode) {
            // Destructure the body assignign to currentHPA
            const {body: currentHPA} = response
            console.log('currentHPA', currentHPA);
            // Update the CPU utilization target
            currentHPA.spec.targetCPUUtilizationPercentage = newCpuTarget;
    
            console.log('newCpuTarget', newCpuTarget);
            
            // Apply the update
            await autoscalingClient.replaceNamespacedHorizontalPodAutoscaler(hpaName, namespace, currentHPA);
            console.log(`Updated HPA: ${hpaName} in namespace: ${namespace} to target CPU utilization: ${newCpuTarget}%`);
        } else {
            console.error('error', response.status)
        }
    } catch (error) {
        console.error(`Failed to update HPA: ${error}`);
    }
}



// Function to evaluate 
async function evaluateCostAndUpdateHPA(costExceedsThreshold, lowerLimit, upperLimit) {
    console.log('Entering evaluateCostAndUpdateHPA function')
    const hpaName = 'mercury-hpa';
    const namespace = 'mercury-namespace';
    

    // const costExceedsThreshold = true; // Example with true as the result
    const newCpuTarget = costExceedsThreshold ? lowerLimit :upperLimit; // Adjust CPU target based on cost
    
    // Update the HPA configuration if needed
    if (costExceedsThreshold) {
        await updateHPAThreshold(hpaName, namespace, newCpuTarget);
    }
}

// Need to periodically call this function?
// evaluateCostAndUpdateHPA();

// Export function
module.exports = { evaluateCostAndUpdateHPA };