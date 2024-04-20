class CostEfficientStrategy {
    async calculateScalingPolicies() {
        try {
            const scalingPolicies = {
                cooldownPeriod: 180,
                behavior: {
                    scaleDown: {
                        stabilizatonWindowSeconds: 60,
                        policies: [
                            { type: 'Pods', value: 3, periodSeconds: 60 },
                            { type: 'Percent', value: 20, periodSeconds: 60 },
                        ],
                        selectPolicy: 'Max',
                    },
                    scaleUp: {
                        stabilizationWindowSeconds: 60,
                        policies: [
                            { type: 'Pods', value: 2, periodSeconds: 45 },
                            { type: 'Percent', value: 30, periodSeconds: 45 }
                        ],
                        selectPolicy: 'Max',
                    }
                },
                cpuUtilization: 75,
            }
            return scalingPolicies;
        } catch (error) {
            console.error(`Error occured in CostEfficientStrategy.calculateScalingPolicies.`)
            return res.status(500).json({
                log: `Error occured in CostEfficientStrategy.calculateScalingPolicies.`,
                message: { error: error.message || "An error occured." },
            });
        }
    }
}

module.exports = new CostEfficientStrategy();