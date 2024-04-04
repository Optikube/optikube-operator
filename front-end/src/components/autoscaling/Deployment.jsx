import React, { useEffect } from 'react';

const Deployment = props => {
    // probably need a manage autoscaler button for frontend communication to KEDA
    const [kedaInfo, setKedaInfo] = useState({})
    useEffect(() => {
        const fetchKedaInfo = async () => {
            try {
                const response = await fetch('KEDA ENDPOINT', {
                    method: "GET",
                    body: JSON.stringify({
                        name: `${props.deployment.name}-keda`,
                        targetNamespace: props.deployment.namespace
                    }),
                })
                if (response.ok) {
                    const data = await response.json();
                    setKedaInfo(data);
                }
            } catch(err) {
                console.log(err)
            }
        }
        fetchKedaInfo();
    }, [])

    const manageKedaClick = (name, namespace) => {
        // Creates a modal for updating KEDA ?
    }

    const updateKedaClick = async (event) => {
        try {
            const response = await fetch('KEDA ENDPOINT FOR UPDATING', {
                method: "PATCH",
                body: JSON.stringify({
                    name: props.deployment.name,
                    targetNamespace: props.deployment.namespace,
                    patchPayload: {
                        // event.target values passed in patch payload
                    }
                })
            })
        } catch(err) {
            console.log(err)
        }
    }

    return (
        <div>
            <span>Name: {props.deployment.name}</span>
            <span>Namespace: {props.deployment.namespace}</span>
            <button></button>
        </div>
    )
}

export default Deployment;