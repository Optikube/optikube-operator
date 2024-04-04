import React, { useState, useEffect } from 'react';
import Deployment from './Deployment';

const Autoscaling = () => {
    const [deployments, setDeployments] = useState([]);
    useEffect(() => {
        const fetchDeployments = async () => {
            try {
                const response = await fetch('/apps/deployments');
                const { metadata } = await response.json();
                const deploymentItems = metadata.map((item, index) => 
                    <Deployment deployment={item} key={index} />
                );
                setDeployments(deploymentItems);
            } catch (err) {
                console.log(err);
            }
        };
        fetchDeployments();
    }, []);

    return (
        <>
            <span>Deployments:</span>
            {deployments}
        </>
    );
}

export default Autoscaling