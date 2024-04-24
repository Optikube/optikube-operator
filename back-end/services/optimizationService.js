const kubecostService = require('./kubecostService');
const settingsService = require('./settingsService');

class OptimizationService {

    constructor () {
        this.strategies = {
            cost: new costEfficientStrategy(),
            mixed: new mixedStrategy(),
            performance: new performanceStrategy(),
        }
    }

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

                if (optimizationScore >= 1.0 && optimizationScore <= 1.6) {
                    // Invoke performance strategy
                    // Should pass in just the deployments namespace, name, metrics from kubeCost to the strategy

                }

                if (optimizationScore >= 1.7 && optimizationScore <= 2.3) {
                    // Invboke mixed strategy

                }

                if (optimizationScore >= 2.4 && optimizationScore <= 3.0) {
                    // Invoke cost efficient strategy
                }

            }

        } catch (error) {
            console.error('Error getting executing optimizations in excuteHourlyOptimization.', error);
            return {
                succes: false,
                log: 'Error getting calculating weightedOptimzationScore.',
                error: error.message 
            }
        }

    }

}




module.exports = new OptimizationService();