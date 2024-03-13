// implement functions for fetching data from Kubecost APIs
const axios = require('axios');

const kubecostAllocationData = async (req, res, next) => {
    try {
        console.log('are we even here?');
        const allocationData = await axios.get('http://localhost:9090/model/allocation', {
            params: {
                window: '6h',
                aggregate: 'namespace',
            }
            });
            
            res.locals.allocation = allocationData;
            console.log('after axios req in middleware')
            return next();

    }  catch (error) {
        console.log('There was an error in the get request for the allocation API', error);
        res.status(500).json({ message: 'Error fetching allocation data' });
    }
};

module.exports = {
    kubecostAllocationData,
};

