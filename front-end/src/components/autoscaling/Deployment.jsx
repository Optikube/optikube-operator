import React from 'react';

const Deployment = props => {
    // probably need a manage autoscaler button for frontend communication to KEDA
    return (
        <div>
            <span>Name: {props.deployment.name}</span>
            <span>Namespace: {props.deployment.namespace}</span>
        </div>
    )
}

export default Deployment;