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
        if(!userInput) {
            return res.status(400).json({
                error: `Mising required parameters in optimizationController.calculateWeightedOptimizationScore.`
            });
        }
        const weightedScore = await optimizationService.calculateWeightedScore(userInput, categoryWeights, settingScores)
        req.weightedOptimizationScore = weightedScore;

        return next();
    } catch (error) {
        console.error(`Error occured in optimizationController.calculateWeightedOptimizationScore.`)
        return res.status(500).json({
            log: `Error occured in optimizationController.calculateWeightedOptimizationScore.`,
            message: { error: error.message || "An error occured." },
        });
    }
}

module.exports = optimizationController;