// Handles initiation of optimization logic.
// This is a bridge between the frontend and backend.
const optimizationService = require('../services/optimizationService');

const optimizationController = {};

optimizationController.calculateWeightedOptimizationScore = async (req, res, next) => {
    const settingScores = {
        'workload variability': { 'dynamic': 1, 'variable': 2, 'steady': 3, },
        'application criticality': { 'critical': 1, 'moderately critical': 2, 'non-critical': 3 },
        'optimization priority': { 'performance': 1, 'balanced': 2, 'cost efficiency': 3 },
    }

    // In the future could have user get to specifiy weighting application.
    const categoryWeights = {
        'workload variability': 0.4,
        'application criticality': 0.3,
        'optimization priority': 0.3,
    }
    // Need to have front end create settigns object like such 
    // let settings = {
    //     'workload variability' : 'steady',
    //     'application criticality' : 'critical',
    //     'optimization priority' : 'balanced',
    // }

    try {
        // req.body
        const userInput = req.body.settings;
        const weightedScore = await optimizationService.calculateWeightedScore(userInput, categoryWeights, settingScores)
        req.weightedOptimizationScore = weightedScore;

        return next();
    } catch (err) {
        return next({
            log: "Error occurred in optimizationController.calculateOptimizationTarget",
            status: 400,
            message: { err },
        })
    }
}

module.exports = optimizationController;