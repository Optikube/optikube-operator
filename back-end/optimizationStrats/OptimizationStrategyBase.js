// Base Class for Otimization Class

class OptimizationStrategyBase {
    async optimize(namespace, deploymentName, settings, deploymentKubecostData) {
        throw new Error('Optimize method must be implemented by subclass')
    }
    async calculateNewRequest (cpuCoreUsageAverage, cpuNewTargetUtilization, minCpuRequest) {
        try {
            // Backs into new request number based off setting target CPU utilization
            // This needs to align with the target CPU utilizataion in the scald object
            let cpuNewRequest = Math.round(cpuCoreUsageAverage / cpuNewTargetUtilization);

            return cpuNewRequest < minCpuRequest ? minCpuRequest : cpuNewRequest;
        } catch (error) {
            throw {
                origin: "OptimizationStrategyBase.calculateNewRequest",
                type: "Optimization Strategy Error",
                error: error,
                message: `Failed to calculate new value in optimization strategy: ${error.message}`
            }
        }
    }
    async calculateNewLimit (cpuNewRequest, cpuLimitBuffer) {
        try {
            let cpuNewLimit = Math.round(cpuNewRequest * cpuLimitBuffer);
            return cpuNewLimit;
        } catch (error) {
            throw {
                origin: "OptimizationStrategyBase.calculateNewLimit",
                type: "Optimization Strategy Error",
                error: error,
                message: `Failed to calculate new limit in optimization strategy: ${error.message}`
            }

        }
    }
}

module.exports = OptimizationStrategyBase;
