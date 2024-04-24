const kubecostService = require('./kubecostService');
const settingsService = require('./settingsService');
const performanceStrategy = require('../optimizationStrats/PerformanceStrategy');
const balancedStrategy = require('../optimizationStrats/BalancedStrategy');
const costEfficientStrategy = require('../optimizationStrats/CostEfficientStrategy');

// optimizationService.js uses user inputs to calculate optimization scores and perform optimization operations each hour.

class OptimizationService {
    // Calculates optimization score based on user inputs, category weighting, and input ratings.
    async calculateWeightedScore(userInput, categoryWeights, settingScores) {
        try {
            let weightedScore = 0;
            let totalWeight = 0;

            for (const category in userInput) {
                if (settingScores[category].hasOwnProperty(userInput[category])) {
                    let rating = settingScores[category][userInput[category]];
                    let weight = categoryWeights[category];

                    weightedScore += rating * weight;
                    totalWeight += weight;
                }
            }

            if (totalWeight !== 1) {
                weightedScore = weightedScore / totalWeight;
            }

            const weightedScoreRounded = parseFloat(weightedScore.toFixed(1));
            
            if (weightedScoreRounded) {
                console.log("Optimization score successfully calculated.")
            }
            return (weightedScoreRounded)

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