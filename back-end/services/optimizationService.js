const kubecostService = require('./kubecostService');
const settingsService = require('./settingsService');
const performanceStrategy = require('../optimizationStrats/PerformanceStrategy');
const balancedStrategy = require('../optimizationStrats/BalancedStrategy');
const costEfficientStrategy = require('../optimizationStrats/CostEfficientStrategy');

class OptimizationService {
    async calculateWeightedScore(userInput, categoryWeights, settingScores) {
        let weightedScore = 0;
        let totalWeight = 0;
        try {
            for (const category in userInput) {
                if (settingScores[category].hasOwnProperty(userInput[category])) {
                    let rating = settingScores[category][userInput[category]]
                    let weight = categoryWeights[category]

                    weightedScore += rating * weight;
                    totalWeight += weight;
                }
            }

            if (totalWeight !== 1) {
                weightedScore = weightedScore / totalWeight;
            }

            return (weightedScore)

        } catch (error) {
            console.error('Error getting calculating weightedOptimzationScore.', error);
            return {
                succes: false,
                log: 'Error getting calculating weightedOptimzationScore.',
                error: error.message 
            }
        }
    }

    async executeHourlyOptimization () {
        try {
            // Get Kubecost data
            const kubeCostMetrics = await kubecostService.getKubecostMetricsForOptimization()
            // Get all deployments tagged to be optimized
            const targetDeployments = await settingsService.getDeploymentsForOptimization()
            //Go through and optimize 
            for (deployment of targetDeployments) {
                const optimizationScore = deployment.settings.optimizationScore;
                // Accessing just the namespace and deployment data
                const deploymentKubecostData = kubeCostMetrics[deployment.namespace]
                // Checks the the data we're looking at is the 
                if (optimizationScore && deploymentKubecostData.name === deployment) {
                    if (optimizationScore >= 1.0 && optimizationScore <= 1.6) {
                        // Invoke performance strategy
                        // Should pass in just the deployments namespace, name, metrics from kubeCost to the strategy
                        performanceStrategy.optimize(deployment.namespace, deployment.deploymentName, deployment.settings, deploymentKubecostData);
                    }
                    if (optimizationScore >= 1.7 && optimizationScore <= 2.3) {
                        // Invboke mixed strategy
                        balancedStrategy.optimize(deployment.namespace, deployment.deploymentName, deployment.settings, deploymentKubecostData)

                    }
                    if (optimizationScore >= 2.4 && optimizationScore <= 3.0) {
                        // Invoke cost efficient strategy
                        costEfficientStrategy.optimize(deployment.namespace, deployment.deploymentName, deployment.settings, deploymentKubecostData)
                    }
                } else {
                    return `Error accessing deployment:${deployment} data in Kubecost metrics when performing hourly optimization`
                }
            }

        } catch (error) {
            console.error('Error getting executing optimizations in excuteHourlyOptimization.', error);
            return {
                succes: false,
                log: 'Error getting excecuting excuteHourlyOptimization.',
                error: error.message 
            }
        }

    }

}




module.exports = new OptimizationService();