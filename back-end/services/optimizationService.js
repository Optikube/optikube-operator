const kubecostService = require('./kubecostService');
const settingsService = require('./settingsService');
const performanceStrategy = require('../optimizationStrats/PerformanceStrategy');
const balancedStrategy = require('../optimizationStrats/BalancedStrategy');
const costEfficientStrategy = require('../optimizationStrats/CostEfficientStrategy');

// optimizationService.js uses user/deployment inputs to calculate optimization scores and perform optimization operations each hour.

class OptimizationService {
    // Calculates optimization score based on user/deployment optimization settings, weightings, and scores.
    async calculateWeightedScore(userInput, categoryWeights, settingScores) {
        try {
            // Start with weighted score and total weight of 0.
            let weightedScore = 0;
            let totalWeight = 0;
            // Goes through each user/deployment setting and user the corresponding score and weighting adds weighted score.
            for (const category in userInput) {
                if (settingScores[category]?.hasOwnProperty(userInput[category])) {
                    let rating = settingScores[category][userInput[category]];
                    let weight = categoryWeights[category];

                    weightedScore += rating * weight;
                    totalWeight += weight;
                }
            }
            // Normalizes weighted score if the total weighting is not 100%.
            // This was initially for if user submitted custom weightings so it is not being utilization in current version of OptiKube.
            if (totalWeight !== 1) {
                weightedScore = weightedScore / totalWeight;
            }
            // Round the weighted score.
            const weightedScoreRounded = parseFloat(weightedScore.toFixed(1));
            // Assuming the opeartion is successful log the progress.
            // This is to see and track the progress of operations
            if (weightedScoreRounded) {
                console.log("Optimization score successfully calculated.")
            }
            // Return weighted score in proper format back to optimizationController.
            return weightedScoreRounded;
        } catch (error) {
            throw {
                origin: "OptimizationService.calculateWeightedScore",
                type: "Optimization Calculation Error",
                error: error,
                message: `Failed to calculate optimization score: ${error.message}`
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
            for (const deployment of targetDeployments) {
                console.log("taregetDeployment", targetDeployments);
                console.log("deployment", targetDeployments[0]);
                const { deploymentName, optimizationScore } = deployment;
                // Accessing just the namespace and deployment data
                const deploymentKubecostData = kubeCostMetrics[`deployment/${deployment.deploymentName}`]
                console.log("deploymentKubecostData", deploymentKubecostData);
                console.log("optimizationScore", optimizationScore);
                console.log("deploymentKubecostData.properties.controller", deploymentKubecostData.properties.controller);
                // Checks the the data we're looking at is the 
                if (optimizationScore && deploymentKubecostData.properties.controller === deploymentName) {
                    if (optimizationScore >= 1.0 && optimizationScore <= 1.6) {
                        console.log("inside optimization for strat")
                        // Invoke performance strategy
                        // Should pass in just the deployments namespace, name, metrics from kubeCost to the strategy
                        performanceStrategy.optimize(deployment.namespace, deployment.deploymentName, deployment.settings, deploymentKubecostData);
                    }
                    if (optimizationScore >= 1.7 && optimizationScore <= 2.3) {
                        console.log("inside optimization for strat")
                        // Invoke mixed strategy
                        balancedStrategy.optimize(deployment.namespace, deployment.deploymentName, deployment.settings, deploymentKubecostData)

                    }
                    if (optimizationScore >= 2.4 && optimizationScore <= 3.0) {
                        console.log("inside optimization for strat")
                        // Invoke cost efficient strategy
                        costEfficientStrategy.optimize(deployment.namespace, deployment.deploymentName, deployment.settings, deploymentKubecostData)
                    }
                } else {
                    return `Error accessing deployment:${deployment} data in Kubecost metrics when performing hourly optimization`
                }
            }
            
        } catch (error) {
            throw {
                origin: "OptimizationService.executeHourlyOptimization",
                type: "Hourly Optimization Error",
                error: error,
                message: `Failed to execute hourly optimization: ${error.message}`
            }
        }
    }
}

module.exports = new OptimizationService();