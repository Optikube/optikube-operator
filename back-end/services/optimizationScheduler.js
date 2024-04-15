// Schedules optimization of kubernetes resources each hour.
const cron = require('node-cron');
const optimizationService = require('./optimizationService')

class OptimizationScheduler {
    start() {
        cron.schedule('0 * * * *', async () => {
            console.log('Running resource optimization every hour on the hour.')
            try {
                await optimizationService.executeHourlyOptimization()
            } catch (error) {
                console.error('Error running optimization task in optimizationScheduler.', error);
                return {
                    succes: false,
                    log: 'Error running optimization task in optimizationScheduler.',
                    error: error.message
                }
            }
        });
    }
}

module.exports = new OptimizatonScheduler();