# OptiKube Operator

OptiKube Operator is custom Kubernetes operator for [OptiKube](https://github.com/Optikube), an open-source tool to optimize and manage Kubernetes resources. For general information about OptiKube please see the [organization page](https://github.com/Optikube) for more details on what OptiKube can do for you or contact optikube@gmail.com for assistance.

## Overview
The operator component of OptiKube is responsible for the core functionalities that drive resource optimization and autoscaling. It enables:
- **Creation of KEDA Autoscalers:** Based on user-submitted settings that define the sensitivity and responsiveness of the scaling actions.
- **Hourly Resource Optimization:** Regularly queries Kubecost to gather data and optimizes resource allocation for deployments with active KEDA scalers based on historical and current usage statistics.

## Optimization Settings in OptiKube
Optimization settings in OptiKube are pivotal for tailoring Kubernetes deployment strategies according to specific needs, enabling a more effective management of resources and costs. These settings are derived from user inputs during the creation of Kubernetes Event-Driven Autoscalers (KEDA) and are crucial for defining the operational behavior of these scalers. Here's an in-depth look at how these settings influence the configuration and operation of the OptiKube operator.

### Overview
When users configure a KEDA scaler in Optikube, they input various optimization parameters that directly influence how the application behaves under different load conditions. Based on these inputs, a weighted optimization score is calculated and stored along with the configuration settings in a Redis database. This score is instrumental in determining which of the three optimization strategies—Balanced, Cost Efficient, and Performance—is applied to the Kubernetes deployment.

### Optimization Strategies
Each optimization strategy applies distinct policies and thresholds that impact the autoscaling behavior:
- **Balanced:** Aims to provide a steady performance by maintaining a middle ground in resource allocation. This strategy balances between cost efficiency and high performance, suitable for workloads with moderate variability and criticality.
- **Cost Efficient:** Focuses on reducing costs by tightening resource limits and increasing CPU utilization targets. Ideal for non-critical, steady applications where cost reduction is the priority, this strategy may allocate fewer resources than the other strategies, running closer to capacity to minimize expenditure.
- **Performance:** Prioritizes high performance to handle dynamic workloads effectively. It features a higher stabilization window, more liberal scale-up policies, and stricter scale-down policies to ensure that resources are readily available during sudden spikes in demand. This strategy is crucial for critical applications that cannot afford downtime or performance degradation.

### Optimization Settings
#### Workload Variability
- **Steady:** Predictable traffic allows for higher CPU utilization targets (70-80%) and tighter control over requests and limits. This setup optimizes resource use without risking performance during minor fluctuations.
- **Variable:** With occasional spikes in traffic, moderate CPU utilization targets (50-70%) are set, with a larger gap between requests and limits to accommodate expected peaks without over-provisioning during quieter periods.
- **Dynamic:** Unpredictable, significant traffic fluctuations necessitate lower CPU utilization targets (40-60%) to ensure capacity for sudden increases. Requests are conservatively set to cover minimal service needs, with much higher limits to handle unexpected spikes.

#### Application Criticality
- **Non-Critical:** Higher CPU utilization is acceptable as temporary performance drops are tolerable. This setting is cost-effective, prioritizing economical resource use over immediate responsiveness.
- **Moderately Critical:** Balances resource allocation to ensure stability without excessive spending, suitable for applications where some level of performance degradation can be managed.
- **Critical:** Low CPU utilization targets prioritize immediate response to increased demand to prevent any performance issues, essential for operations where even minimal downtime can have significant repercussions.

#### Optimization Priority
- **Cost Efficiency:** Higher CPU utilization and tighter requests/limits are set to reduce costs, making it an optimal choice for steady, non-critical applications.
- **Balanced:** This flexible approach adjusts target utilization and request/limit settings to maintain adequate performance while managing costs, suitable for variably loaded systems.
- **Performance:** Emphasizes availability of resources with lower utilization targets and more generous requests and limits, ensuring that critical and dynamic workloads are supported without compromise

## Autoscalers


## Hourly Resource Optimization
