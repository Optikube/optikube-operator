
const OptimizationStrategyBase = require('./OptimizationStrategyBase');

class PerformanceStrategy extends OptimizationStrategyBase {
    async optimize(namespace, deploymentName, settings, deploymentKubecostData) {
        // Fetch current deployment spec
        
        // Looks at Kubecost average utilization to be 40-60% of the current average utilization for the past hour
        // Back into a new request that makes this number feasible. Need to put in min values if the real utilization is low.
        // Maybe update target utilization as further update? This would ideally be set on the scaled object upon creation.
        // Calc current request/limit ratio
        // Calc new request/limit ratio. Ensure new request/limit ratio has adequate buffer for the strategy. 
    }
}

module.exports = HighPerformanceStrategy;
