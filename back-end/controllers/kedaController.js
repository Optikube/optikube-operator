const k8s = require('@kubernetes/client-node');
const kc = new k8s.KubeConfig();
kc.loadFromCluster();
const k8sApi = kc.makeApiClient(k8s.CustomObjectsApi)

const kedaController = {};

kedaController.createScaledObject = async (req, res, next) => {
    const settings = req.body.settings;
    // parse through req.body.settings to setup ScaledObject accordingly
    const scaledObject = {
        apiVersion: 'keda.sh/v1alpha',
        kind: 'ScaledObject',
        metadata: {
            name: req.body.deployment,
            namespace: req.body.namespace,
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

kedaController.readScaledObject = async (req, res, next) => {
    try {
        const { body } = await k8sApi.getNamespacedCustomObject(
            'keda.sh',
            'v1alpha1',
            req.body.targetNamespace,
            'scaledobjects',
            req.body.name // name of ScaledObject (we probably need to standardize naming)
        )
        console.log(body);
        res.locals.keda = body;
        return next();
    } catch(err) {
        return next({
            log: "Error occurred in kedaController.readScaledObject",
            status: 400,
            message: { err },
        })
    }
}

kedaController.updateScaledObject = async (req, res, next) => {
    const patchPayload = {
        // Payload to update scaled object
        // take from req.body.settings
    }
    try {
        const response = await k8sApi.patchNamespacedCustomObject(
            'keda.sh',
            'v1alpha1',
            req.body.namespace,
            'scaledobjects',
            req.body.deployment,
            patchPayload,
            undefined,
            undefined,
            undefined,
            { headers: { 'Content-Type': 'application/merge-patch+json' } }
        )
        return next();
    } catch(err) {
        return next({
            log: "Error occurred in kedaController.createScaledObject",
            status: 400,
            message: { err },
        })
    }
}

kedaController.deleteScaledObject = async (req, res, next) => {
    try {
        const response = await k8sApi.deleteScaledObject(
            'keda.sh',
            'v1alpha1',
            req.body.targetNamespace,
            'scaledobjects',
            req.body.name,
            {}
        );
    } catch(err) {
        return next({
            log: "Error occurred in kedaController.deleteScaledObject",
            status: 400,
            message: { err },
        })
    }
}



module.exports = kedaController;