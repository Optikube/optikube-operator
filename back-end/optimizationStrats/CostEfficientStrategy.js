const OptimizationStrategyBase = require('./OptimizationStrategyBase');
const deploymentOperator = require('../operators/deploymentOperator');

class CostEfficientStrategy extends OptimizationStrategyBase {
    async optimize(namespace, deploymentName, settings, deploymentKubecostData) {
        try {
            // Looks at Kubecost average utilization to be 40-60% of the current average utilization for the past hour
            // Caclulate average utilization - needs to build in safeguards where the usage is 0
            const {  cpuCoreUsageAverage, cpuCoreRequestAverage } = deploymentKubecostData;

            const cpuUtilizationAverage = cpuCoreUsageAverage / cpuCoreRequestAverage

            // correct the utilization if out of bounds
            if (cpuUtilizationAverage < 0.7  || cpuUtilizationAverage > 0.8) {
                const cpuNewRequest = await this.calculateNewRequest(cpuCoreUsageAverage, 0.75, 50)
                // Potentially need to update scaled object target utilizaton to 50% to be sure if no already set initially
                const cpuNewLimit = await this.calculateNewLimit(cpuNewRequest, 1.3)
                const updatedResources = {
                    requests: { cpu: `${cpuNewRequest}m` },
                    limits: { cpu: `${cpuNewLimit}m` }
                }
                // Update kubernetes deployment
                await deploymentOperator.updateDeploymentResources(namespace, deploymentName, updatedResources);
            }
            return;
        } catch (error) {
            throw {
                origin: "CostEfficientStrategy.optimize",
                type: "Optimization Strategy Error",
                error: error,
                message: `Failed to execute optimization strategy: ${error.message}`
            }
        }
    }
}

module.exports = new CostEfficientStrategy();