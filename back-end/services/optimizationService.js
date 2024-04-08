const kubecostService = require('./kubecostService');

class OptimizationService {

    constructor () {
        this.strategies = {
            cost: new costEfficientStrategy();
            mixed: new mixedStrategy();
            performance: new performanceStrategy();
        }
    }

    selectOptimizationStrategy(optimizationScore) {
        if (optimizationScore <= )
    }



    calculateWeightedScore(userInput, categoryWeights, settingScores) {
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

    executeHourlyOptimization () {
        try {

            // Get Kubecost data
            kubecostService.getKubecostMetricsForOptimization()
            // Get all deployments tagged to be optimized

            //Go through and optimize 


        } catch {
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