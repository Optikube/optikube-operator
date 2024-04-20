class PerformanceStrategy {
    async calculateScalingPolicies() {
        try {
            const scalingPolicies = {
                cooldownPeriod: 90,
                behavior: {
                    scaleDown: {
                        stabilizatonWindowSeconds: 120,
                        policies: [
                            { type: 'Pods', value: '1', periodSeconds: 60 },
                            { type: 'Percent', value: '10', periodSeconds: 60 },
                        ],
                        selectPolicy: 'Max',
                    },
                    scaleUp: {
                        stabilizationWindowSeconds: 20,
                        policies: [
                            { type: 'Pods', value: '5', periodSeconds: 15 },
                            { type: 'Percent', value: '70', periodSeconds: 15 }
                        ],
                        selectPolicy: 'Max',
                    }
                },
                cpuUtilization: 50,
            }
            return scalingPolicies;
        } catch (error) {
            console.error(`Error occured in PerformanceStrategy.calculateScalingPolicies.`)
            return res.status(500).json({
                log: `Error occured in PerformanceStrategy.calculateScalingPolicies.`,
                message: { error: error.message || "An error occured." },
            });
        }
    }
}

module.exports = new PerformanceStrategy();