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
                console.error('Error running optimization task in optimizatioScheduler:', error);
            }
        });
    }
}

module.exports = new OptimizatonScheduler();