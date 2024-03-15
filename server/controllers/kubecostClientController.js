// implement functions for fetching data from Kubecost APIs
const axios = require('axios');
const { stringify } = require('querystring');

//run this command in terminal to expose kubecost API
// kubectl port-forward --namespace kubecost deployment/kubecost-cost-analyzer 9090


//pods tend to die, may need to change out w new pod name
// kubectl get pods -n optikube-namespace --> run in terminal to get pods of optikube
const theChosenPod = "optikube-deployment-5f77bdfd84-9bzx7"


const kubecostAllocationData = async (req, res, next) => {
    try {
        console.log('entering try block of kubecostAllo middleware');
        const allocationData = await axios.get('http://localhost:9090/model/allocation', {
            params: {
                window: '1h',
                aggregate: 'pod',
                // filter: 'namespace: "optikube-namespace"',
                // filter: 'pod: "optikube-deployment-5f77bdfd84-5js5x"',
                filter: `pod:"${theChosenPod}"`,
                // fields: 'cpuCost,ramBytes'
            }
        });
        //this gives an object of only our pod and given metrics
        const podObject = allocationData.data.data[0][theChosenPod]
        // console.log('origial allocationData slimmed down->', podObject);


        //no need to iterate now, add whatever other metrics we want
        const jawshData = {
            app: podObject['properties']['labels']['app'],
            podName: podObject['name'],
            minutes: podObject['minutes'],
            loadBalancerCost: podObject['loadBalancerCost'],
            cpuCost: podObject['cpuCost'],
            ramCost: podObject['ramCost'],
            totalCost: podObject['totalCost']
        };
        // console.log('Jawsh Obj w key/value label pairs -->', jawshData);

        //accessing allocationData JSON Obj directly and pulling vital metrics
        // console.log('Load Balance Cost -->',allocationData.data.data[0][theChosenPod]["loadBalancerCost"]);
        // console.log('RAM Cost -->',allocationData.data.data[0][theChosenPod]["ramCost"]);         
        // console.log('Total Cost -->',allocationData.data.data[0][theChosenPod]["totalCost"]);

        res.locals.allocation = jawshData;
        // console.log('after axios req in middleware')
        return next();


    } catch (error) {
        console.log('There was an error in the get request for the allocation API', error);
        res.status(500).json({ message: 'Error fetching allocation data' });
    }
};


const kubecostNamespaceData = async (req, res, next) => {
    try {
        console.log('entering try block of kubecost namespace middleware');
        const namespaceData = await axios.get('http://localhost:9090/model/allocation', {
            params: {
                window: '1h',
                aggregate: 'namespace',
                filter: 'namespace: "optikube-namespace"',
            }
        });
        //this gives an object of only our pod and given metrics
        // const podObject = allocationData.data.data[0][theChosenPod]
        // console.log('origial allocationData slimmed down->', podObject);
        console.log('namespace data from inside namespace controller -->',namespaceData);

        res.locals.namespaceData = namespaceData;
        // console.log('after axios req in middleware')
        return next();


    } catch (error) {
        console.log('There was an error in the get request for the namespace API', error);
        res.status(500).json({ message: 'Error fetching namespace data' });
    }
};




module.exports = {
    kubecostAllocationData,
    kubecostNamespaceData
};


