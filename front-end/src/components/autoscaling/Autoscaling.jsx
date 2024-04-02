import React, { useState, useEffect } from 'react';
import Deployment from './Deployment';

const Autoscaling = () => {
    useEffect(async () => {
        try {
            const response = await fetch('/apps/deployments');
            const data = await response.json();
            const deployments = data.map((item, index) => <Deployment deployment={item} key={index}></Deployment>)
            return (
                <>
                    <span>Deployments:</span>
                    {deployments}
                </>
            )
        } catch(err) {
            console.log(err)
        }
    }, []);
}

export default Autoscaling