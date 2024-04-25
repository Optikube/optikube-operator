// Base Class for Otimization Class

class OptimizationStrategyBase {
    async optimize(namespace, deploymentName, settings, deploymentKubecostData) {
        throw new Error('Optimize method must be implemented by subclass')
    }
    async calculateNewRequest (cpuCoreUsageAverage, cpuNewTargetUtilization, minCpuRequest) {
        // Backs into new request number based off setting target CPU utilization
        // This needs to align with the target CPU utilizataion in the scald object
        let cpuNewRequest = Math.round(cpuCoreUsageAverage / cpuNewTargetUtilization);

        return cpuNewRequest < minCPURequest ? minCpuRequest : cpuNewRequest;
    }
    async calculateNewLimit (cpuNewRequest, cpuLimitBuffer) {
        let cpuNewLimit = Math.round(cpuNewRequest * cpuLimitBuffer);
        return cpuNewLimit;
    }
}

module.exports = OptimizationStrategyBase;
