class BalancedStrategy {
    async calculateScalingPolicies() {
        try {
            const scalingPolicies = {
                cooldownPeriod: 120,
                behavior: {
                    scaleDown: {
                        stabilizatonWindowSeconds: 90,
                        policies: [
                            { type: 'Pods', value: '2', periodSeconds: 45 },
                            { type: 'Percent', value: '15', periodSeconds: 45 },
                        ],
                        selectPolicy: 'Max',
                    },
                    scaleUp: {
                        stabilizationWindowSeconds: 40,
                        policies: [
                            { type: 'Pods', value: '3', periodSeconds: 30 },
                            { type: 'Percent', value: '50', periodSeconds: 30 }
                        ],
                        selectPolicy: 'Max',
                    }
                },
                cpuUtilization: 60,
            }
            return scalingPolicies;
        } catch (error) {
            console.error(`Error occured in BalancedStrategy.calculateScalingPolicies.`)
            return res.status(500).json({
                log: `Error occured in BalancedStrategy.calculateScalingPolicies.`,
                message: { error: error.message || "An error occured." },
            });
        }
    }
}

module.exports = new BalancedStrategy();