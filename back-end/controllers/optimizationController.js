// Handles initiation of optimization logic.
// This is a bridge between the frontend and backend.
const optimizationService = require('../services/optimizationService');

// optimizationController.js handles initiation of optimization logic.
const optimizationController = {};
// Calculates a weighted optimization score based on user inputs.
optimizationController.calculateWeightedOptimizationScore = async (req, res, next) => {
    try {
        const settingScores = {
            'workload variability': { 'dynamic': 1, 'variable': 2, 'steady': 3, },
            'application criticality': { 'critical': 1, 'moderately critical': 2, 'non-critical': 3 },
            'optimization priority': { 'performance': 1, 'balanced': 2, 'cost efficiency': 3 },
        };
        // In the future could have user get to specifiy weighting.
        const categoryWeights = {
            'workload variability': 0.4,
            'application criticality': 0.3,
            'optimization priority': 0.3,
        };
        // Need to have front end create settigns object like such 
        // let settings = {
        //     'workload variability' : 'steady',
        //     'application criticality' : 'critical',
        //     'optimization priority' : 'balanced',
        // }
        
        const userInput = req.body.settings;

        if (!userInput) {
            throw {
                origin: "optimizationController.calculateWeightedOptimizationScore",
                type: "Validation Error",
                status: 400,
                message: "Missing required parameters."
            };
        }
        const weightedScore = await optimizationService.calculateWeightedScore(userInput, categoryWeights, settingScores);
        req.weightedOptimizationScore = weightedScore;

        return next();
    } catch (error) {
        console.error(`${error.type} in ${error.origin}: ${error.message}`);
        next(error);
    }
}

module.exports = optimizationController;