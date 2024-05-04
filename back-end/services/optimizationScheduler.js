// Schedules optimization of kubernetes resources each hour.
const cron = require('node-cron');
const optimizationService = require('./optimizationService')

class OptimizationScheduler {
    start() {
        cron.schedule('0 * * * *', async () => {
            console.log('Running resource optimization every hour on the hour.')
            try {
                await optimizationService.executeHourlyOptimization()
                console.log("Hourly resource optimization completed.")
            } catch (error) {
                throw {
                    origin: "OptimizationScheduler - cron",
                    type: "Optimization scheduler cron error",
                    error: error,
                    message: `Failed to run cron job and execute hourly optimization`
                }
            }
        });
    }
}

module.exports = new OptimizationScheduler();