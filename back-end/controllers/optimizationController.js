// Handles initiation of optimization logic.
// This is a bridge between the frontend and backend.
const optimizationService = require('../services/optimizationService');

// optimizationController.js handles initiation of optimization logic.
const optimizationController = {};
// Calculates a weighted optimization score based on user inputs.
// The optimization score is the basis for many of the actions the back end takes.
optimizationController.calculateWeightedOptimizationScore = async (req, res, next) => {
    try {
        // Scores for possible user/deployment inputs.
        const settingScores = {
            'workload variability': { 'dynamic': 1, 'variable': 2, 'steady': 3, },
            'application criticality': { 'critical': 1, 'moderately critical': 2, 'non-critical': 3 },
            'optimization priority': { 'performance': 1, 'balanced': 2, 'cost efficiency': 3 },
        };
        // Weighting for user/deployment inputs.
        // In the future could have user get to specify weighting.
        const categoryWeights = {
            'workload variability': 0.4,
            'application criticality': 0.3,
            'optimization priority': 0.3,
        };
        // Expecations is front end sends in the following format in req.body.
        // let settings = {
        //     'workload variability' : 'steady',
        //     'application criticality' : 'critical',
        //     'optimization priority' : 'balanced',
        //     'min cpu request': 100,
        // }
        
        // Assign optimization settings to user input variable.
        const userInput = req.body.settings;
        // Validation check for optimization settings.
        // This is critical to caclulating the optimization settings.
        if (!userInput) {
            throw {
                origin: "optimizationController.calculateWeightedOptimizationScore",
                type: "Validation Error",
                status: 400,
                message: "Missing required parameters."
            };
        }
        // Initiate caclulation for weighted optimization score based on user/deployment optimization settings, weightings, and scores.
        const weightedScore = await optimizationService.calculateWeightedScore(userInput, categoryWeights, settingScores);
        // Assign calculate weighted optimization score to request body.
        // This will be used later when storing deployment settings.
        req.weightedOptimizationScore = weightedScore;
        // Depending on resulting optimization score the program assigns an optimization strategy to the request object.
        // This will be used later when storing deployment settings.
        if (weightedScore >= 1.0 && weightedScore <= 1.6) {
            // Performance strategy.
            req.optimizationStrategy = "Performance";
        }
        if (weightedScore >= 1.7 && weightedScore <= 2.3) {
            // Balanced strategy.
            req.optimizationStrategy = "Balanced";
        }
        if (weightedScore >= 2.4 && weightedScore <= 3.0) {
            // Cost Efficient strategy.
            req.optimizationStrategy = "Cost Efficient";
        }
        // Proceed to next part of middleware chain.
        return next();
    } catch (error) {
        console.error(`${error.type} in ${error.origin}: ${error.message}`);
        next(error);
    }
}

module.exports = optimizationController;