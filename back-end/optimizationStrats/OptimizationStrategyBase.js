// Base Class for Otimization Class

class OptimizationStrategyBase {
    async optimize(namespace, deploymentName, settings, deploymentKubecostData) {
        throw new Error('Optimize method must be implemented by subclass')
    }
}

module.exports = OptimizationStrategyBase;
