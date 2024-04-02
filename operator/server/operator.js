// Imports the Kubernetes client library.
const k8s = require('@kubernetes/client-node');
// Kube.config represents the Kubernetes configuration which we are assigning to kc.
const kc = new k8s.KubeConfig();
// Loads the Kubernetes configuratiion from the default location
// This can be changing to a specific path depending on need
kc.loadFromCluster();
// Confirm kc config?
console.log('kc config', kc)

// // Autoscaling v2 is available but since all our K8s yaml use API v1 we're need to use v1 for consistency.
// const autoscalingClient = kc.makeApiClient(k8s.AutoscalingV1Api)

// // Function to update HPA threshold
// async function updateHPAThreshold(hpaName, namespace, newCpuTarget, newMinReplicasTarget, newMaxReplicasTarget) {
//     try {
//         // Fetch the current HPA configuration.
//         // The response is a object with a body and response properties.
//         // The body is an instance of the V1HorizontalPodAutoscaler class from the K8s node client library.
//             // Contains basic K8s object info such as spec, status, etc.
//         // The response is instance of the http.IncomingMessage from node.js
//             // This contains details about the HTTP response, but is abstracted away in the node client library to be the property titled "response".
//         const hpaResponse = await autoscalingClient.readNamespacedHorizontalPodAutoscaler(hpaName, namespace);
//         // console.log('Response:', hpaResponse);

//         // If the status code is not 200 log error and console.log status code.
//         if (hpaResponse.response.statusCode !== 200) {
//             console.error('Error fetching HPA:', hpaName.response.statusCode);
//             //exit if there is an error?
//             return;
//         }
//         // Retrieve body from HPA response and assign to currentHPA.
//         const currentHPA = hpaResponse.body;
//         // console.log('Current HPA:', currentHPA);
//         // If the spec doesn't matcht target --> patch HPA with new target.
//         if(currentHPA.spec.targetCPUUtilizationPercentage !== newCpuTarget) {
//             console.log('Updating HPA target CPU Utilization');
//             // Define patch payload for json merge patch.
//             const patchPayload = {
//                 "spec": {
//                     "targetCPUUtilizationPercentage": newCpuTarget,
//                     "minReplicas": newMinReplicasTarget || currentHPA.spec.minReplicas,
//                     "maxReplicas": newMaxReplicasTarget || currentHPA.spec.maxReplicas,
//                 }
//             };
//             // Patch existing CPU target in HPA.
//             await autoscalingClient.patchNamespacedHorizontalPodAutoscaler(
//                 hpaName,
//                 namespace,
//                 patchPayload,
//                 undefined,
//                 undefined,
//                 undefined,
//                 undefined,
//                 undefined,
//                 {headers: { "Content-Type": "application/merge-patch+json"}}
//             );
//             console.log(`Updated HPA: ${hpaName} to target CPU utilization: ${newCpuTarget}%`);
//             console.log(`Current HPA Status:
//                             CPU Utilization: ${currentHPA.status.currentCPUUtilizationPercentage}%
//                             Current Pod Count: ${currentHPA.status.currentReplicas}
//                             Desired Pod Count: ${currentHPA.status.desiredReplicas}
//                             `)
//         } else {
//             console.log(`Current HPA target CPU utilization ${currentHPA.spec.targetCPUUtilizationPercentage} in nameepsace ${namespace} matches new target CPU utilization ${newCpuTarget}%`);
//         }
//     } catch (error) {
//         console.error(`Failed to update HPA: ${error}`);
//     }
// }



// // Function to evaluate 
// async function evaluateCostAndUpdateHPA(cpuTarget) {
//     console.log('Entering evaluateCostAndUpdateHPA function')
//     const hpaName = 'php-hpa';
//     const namespace = 'php-namespace';
    
//     // const costExceedsThreshold = true; // Example with true as the result
//     const newCpuTarget = cpuTarget; // Adjust CPU target based on cost
    
//     // Update the HPA configuration if needed
//     // if (costExceedsThreshold) {
//     //     await updateHPAThreshold(hpaName, namespace, newCpuTarget);
//     // }
//     await updateHPAThreshold(hpaName, namespace, newCpuTarget)
// }

// // Need to periodically call this function?
// // evaluateCostAndUpdateHPA();

// // Export function
// module.exports = { evaluateCostAndUpdateHPA };



//KEDA Operator Setup

const k8sAPi = kc.makeApiClient(k8s.CustomObjectsApi)

// Namespace for the KEDA scaled object - ideally will be dynamically input by user

const userConfig = {
    name: 'example-scaledobject',
    targetName: 'target-deployment',
    pollingInterval: '30',
    cooldownPeriod: '300',
    minReplicaCount: 1,
    maxReplicaCount: 10,
    triggerType: 'metrics-api',
    triggerMetadata: {
      url: 'kubecost API-address',
    },
  };

// Define the ScaledObject file

const createScaledObject = async (targetNamespace, userConfig) => {

    const scaledObjectBody = {
        apiVersion: 'keda.sh/v1alpha',
        kind: 'ScaledObject',
        metadata: {
            name: userConfig.name,
            namespace: targetNamespace,
        },
        spec: {
            scaleTargetRef: {
                name: userConfig.targetName
            }
        },
        pollingInterval: userConfig.pollingInterval,
        cooldownPeriod: userConfig.cooldownPeriod,
        minReplicaCount: userConfig.minReplicaCount,
        maxReplicaCount: userConfig.maxReplicaCount,
        triggers: [
            {
                type: userConfig.triggerType,
                metadata: userConfig.triggerMetaData,
            },
        ],
    };

    try {
        const response = await k8sAPi.createNamespacedCustomObject(
            'keda.sh',
            'v1alpha1',
            targetNamespace,
            'scaledobjects',
            scaledObjectBody,
        );
        console.log('ScaledObject created', response.body);
    } catch (error) {
        console.error('Error creating ScaledObject:', error);
    }
};
