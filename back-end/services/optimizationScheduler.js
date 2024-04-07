// Schedules optimization of kubernetes resources each hour.

const cron = require('node-cron');
const optimizationService = 

class optimizationScheduler {
    start() {
        cron.schedule('0 * * * *', async () => {
            console.log('Running resource optimization every hour on the hour.')
            try {
                await optimizationService
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