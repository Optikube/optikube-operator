const k8s = require('@kubernetes/client-node');
const kc = new k8s.KubeConfig();
kc.loadFromCluster();
const k8sApi = kc.makeApiClient(k8s.CustomObjectsApi)

const kedaController = {};

kedaController.createScaledObject = async (req, res, next) => {
    const scaledObject = {
        apiVersion: 'keda.sh/v1alpha',
        kind: 'ScaledObject',
        metadata: {
            name: req.body.name,
            namespace: req.body.targetNamespace,
        },
        spec: {
            scaleTargetRef: {
                name: req.body.targetName
            }
        },
        pollingInterval: req.body.pollingInterval,
        cooldownPeriod: req.body.cooldownPeriod,
        minReplicaCount: req.body.minReplicaCount,
        maxReplicaCount: req.body.maxReplicaCount,
        triggers: [
            {
                type: 'metrics-api',
                metadata:
                    {
                        targetValue: "TARGET VALUE",
                        url: "API URL", // We don't want to hard code this in ideally, so we'll need to get the service endpoint
                        valueLocation: "VALUE LOCATION",
                        method: "GET",
                    },
            },
        ],
    };
    try {
        const response = await k8sApi.createNamespacedCustomObject(
            'keda.sh',
            'v1alpha1',
            req.body.targetNamespace,
            'scaledobjects',
            scaledObject,
        );
        return next();
    } catch(err) {
        return next({
            log: "Error occurred in kedaController.createScaledObject",
            status: 400,
            message: { err },
        })
    }
}

module.exports = kedaController;