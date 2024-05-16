# OptiKube Operator

OptiKube Operator is custom Kubernetes operator for [OptiKube](https://github.com/Optikube), an open-source tool to optimize and manage Kubernetes resources. For general information about OptiKube please see the [organization page](https://github.com/Optikube) for more details on what OptiKube can do for you or contact optikube@gmail.com for assistance.


## Overview
The operator component of OptiKube is responsible for the core functionalities that drive resource optimization and autoscaling. It enables:
- **Creation of KEDA Autoscalers:** Based on user-submitted settings that define the sensitivity and responsiveness of the scaling actions.
- **Hourly Resource Optimization:** Regularly queries Kubecost to gather data and optimizes resource allocation for deployments with active KEDA scalers based on historical and current usage statistics.


## Optimization Settings in OptiKube
Optimization settings in OptiKube are pivotal for tailoring Kubernetes deployment strategies according to specific needs, enabling a more effective management of resources and costs. These settings are derived from user inputs during the creation of Kubernetes Event-Driven Autoscalers (KEDA) and are crucial for defining the operational behavior of these scalers. Here's an in-depth look at how these settings influence the configuration and operation of the OptiKube operator.

### Overview
When users configure a KEDA scaler in OptiKube, they input various optimization parameters that directly influence how the application behaves under different load conditions. Based on these inputs, a weighted optimization score is calculated and stored along with the configuration settings in a Redis database. This score is instrumental in determining which of the three optimization strategies—Balanced, Cost Efficient, and Performance—is applied to the Kubernetes deployment.

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


## KEDA Scalers in OptiKube
In OptiKube, the operator backend plays a crucial role in facilitating the creation and configuration of Kubernetes Event-Driven Autoscalers (KEDA), which are essential for achieving dynamic and responsive scaling. This capability allows OptiKube to utilize resources more efficiently and adapt quickly to changing workload demands. Here's an in-depth look at how KEDA scalers are integrated within OptiKube and how they are configured based on different optimization strategies.

### KEDA Scalers
KEDA scalers are designed to adjust the number of pods in a Kubernetes deployment dynamically based on the actual usage of application resources. The OptiKube backend utilizes these scalers to ensure that resource allocation is both efficient and responsive to the needs of the applications it manages. This is achieved by configuring KEDA scalers according to optimization strategies derived from user input, which determine the behavior of autoscaling actions. 

### Configuring KEDA Scalers Based on Optimization Strategies
OptiKube configures KEDA scalers based on three main optimization strategies: Performance, Cost Efficiency, and Balanced. Each strategy tailors the scaling behavior to meet specific operational goals:

#### Performance Strategy
- **Lower CPU Utilization:** Setting a lower CPU utilization threshold allows the scaler to activate additional resources more quickly, ensuring that performance remains high even under increased load.
- **Lower Cooldown Period:** This reduces the wait time before another scaling operation can occur, making the scaler highly responsive to changes in demand.
- **Stricter Scale-Down Policies:** Ensures that resources are not prematurely reduced, maintaining higher availability and performance.
- **Longer Stabilization Window on Scale-Down:** This means that the scaler will wait longer before reducing resources, ensuring stability during fluctuating workloads.
- **Liberal Policies on Scale-Up:** Allows for rapid scaling up by quickly allocating more resources when needed, with a short stabilization window to respond swiftly to spikes in demand.

#### Cost Efficient Strategy
- **Higher CPU Utilization:** By setting a higher CPU utilization target, the scaler maximizes the usage of each pod, reducing the number of pods required and hence the cost.
- **Higher Cooldown Period:** Increases the interval between scaling actions, reducing the frequency of scale-up and scale-down operations to save costs.
- **Liberal Scale-Down Policies:** Promotes quicker release of resources when they are not needed, which helps in reducing operational costs.
- **Short Stabilization Window on Scale-Down:** Ensures that scaling down happens promptly when the demand decreases, avoiding unnecessary resource usage.
- **Strict Policies on Scale-Up:** By having stricter conditions for scaling up, this strategy maintains minimal resource usage, with a long stabilization window to prevent frequent scaling actions

#### Balanced Strategy
- **Moderates between Performance and Cost Efficiency:** This strategy takes a middle path, incorporating elements from both the performance and cost-efficient strategies. It aims to provide a reasonable level of responsiveness and performance while also considering cost implications.

### Impact of Optimization Strategies on KEDA Scalers
The choice of optimization strategy directly influences how KEDA scalers are configured and behave. This alignment ensures that the scaling mechanisms are perfectly suited to the operational priorities of the deployment—whether the focus is on maintaining high performance, reducing costs, or balancing the two. Through intelligent scaling decisions influenced by these strategies, OptiKube enhances resource utilization and operational efficiency across Kubernetes environments.


## Hourly Optimization in OptiKube
OptiKube’s operator is designed to continuously refine and optimize Kubernetes deployments to ensure efficient resource usage and cost-effectiveness. Here's an in-depth exploration of the hourly optimization process facilitated by the Optikube operator backend, highlighting the sophisticated mechanism it uses to dynamically adjust deployment resources based on real-time data and predefined user settings.

### Overview of Hourly Optimization Process
OptiKube enhances Kubernetes deployments by implementing an hourly optimization cycle. This process is specifically tailored for deployments that are:
- **Tagged for Optimization:** These are deployments equipped with a KEDA scaler and have had user-defined optimization settings applied.
- **Monitored for Resource Usage:** The operator retrieves critical data on these tagged deployments to make informed decisions about resource allocation.

### Steps Involved in the Hourly Optimization

### Steps Involved in the Hourly Optimization

**1. Retrieval of Optimization Parameters:**
  - The operator fetches the optimization settings, the associated optimization score, and the chosen strategy for each deployment tagged for optimization.
**2. Data Collection from Kubecost:**
  - For these deployments, the operator queries Kubecost to gather data on resource usage over the past six hours. This historical usage data is crucial for assessing current needs and predicting future demands.
**3. Calculation of New Resource Requests and Limits:**
  - **Resource Requests:** The operator calculates new resource requests by analyzing the actual usage data collected. It selects a request level that aims to align more closely with the target utilization percentage, ensuring that the deployments are neither underutilized nor overstrained.
  - **Resource Limits:** Based on the chosen optimization strategy, the operator sets new limits to provide a buffer over the calculated request. This buffer varies according to the optimization strategy:
    - **Performance Strategy:** Implements a larger gap between the limits and the request to accommodate sudden spikes without degradation in performance.
    - **Balanced Strategy:** Sets a moderate gap, balancing between performance needs and cost-efficiency.
    - **Cost Efficient Strategy:** Maintains a smaller gap, prioritizing cost savings by limiting the buffer above the request.
**4. Setting the Minimum Resource Floor:**
  - The user inputs a minimum request level as a safety net to prevent the deployment’s resources from being scaled down too aggressively, ensuring that the application or service remains responsive even during periods of low usage.

### Impact and Benefits of Hourly Optimization
This proactive approach to managing resources not only aligns resource allocation more accurately with actual needs but also prevents scenarios where deployments are either over-provisioned (leading to wasted resources and increased costs) or under-provisioned (potentially compromising performance and availability). By adjusting the deployments hourly, Optikube ensures:

- **Cost Efficiency:** Reduces costs by avoiding unnecessary resource allocation.
- **Performance Assurance:** Maintains adequate resources to handle peak loads efficiently.
- **Resource Optimization:** Ensures optimal use of resources by adjusting to the actual usage patterns and efficiency metrics.
