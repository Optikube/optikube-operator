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

            const weightedScoreRounded = parseFloat(weightedScore.toFixed(1));
            return (weightedScoreRounded)

        } catch (error) {
            console.error(`Error calculating weightedOptimizationScore in OptimizationService.calculateWeightedScore.`);
            return res.status(500).json({
                log: `Error calculating weightedOptimizationScore in OptimizationService.calculateWeightedScore.`,
                message: { error: error.message || "An error occured." },
            });
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
            console.error(`Error executing optimizations in OptimizationService.excuteHourlyOptimization.`);
            return res.status(500).json({
                log: `Error executing optimizations in OptimizationService.excuteHourlyOptimization.`,
                message: { error: error.message || "An error occured." },
            });
        }

    }

}




module.exports = new OptimizationService();