const k8s = require('@kubernetes/client-node');
const kc = new k8s.KubeConfig();
kc.loadFromCluster();
const k8sApi = kc.makeApiClient(k8s.AppsV1Api)

const appsController = {};


appsController.viewAllDeployments = async (req, res, next) => {
    try {
        const { body } = await k8sApi.listDeploymentForAllNamespaces();
        console.log('k8sApi.listDeploymentForAllNamespaces:', body.items);
        const deployments = body.items.map(item => {
            return {
                name: item.metadata.name,
                namespace: item.metadata.namespace
            };
        });
        res.locals.deployments = deployments
        return next();
    } catch(err) {
        return next({
            log: "Error occurred in appsController.viewAllDeployments",
            status: 400,
            message: { err },
        })
    }
}

module.exports = appsController;