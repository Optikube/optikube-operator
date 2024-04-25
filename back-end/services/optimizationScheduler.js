// Schedules optimization of kubernetes resources each hour.
const cron = require('node-cron');
const optimizationService = require('./optimizationService')

class OptimizationScheduler {
    start() {
        // cron.schedule('0 * * * *', async () => {
        //     console.log('Running resource optimization every hour on the hour.')
        //     try {
        //         await optimizationService.executeHourlyOptimization()
        //     } catch (error) {
        //         throw {
        //             origin: "OptimizationScheduler - cron",
        //             type: "Optimization scheduler cron error",
        //             error: error,
        //             message: `Failed to run cron job and execute hourly optimization`
        //         }
        //     }
        // });
        cron.schedule('*/10 * * * *', async () => {
            console.log('Running resource optimization every 10 minutes.')
            try {
                await optimizationService.executeHourlyOptimization() // Consider renaming if not hourly
            } catch (error) {
                console.error({
                    origin: "OptimizationScheduler - cron",
                    type: "Optimization scheduler cron error",
                    error: error,
                    message: `Failed to run cron job and execute optimization every 10 minutes`
                });
            }
        });
    }
}

module.exports = new OptimizationScheduler();