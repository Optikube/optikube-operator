// Imports the Kubernetes client library.
const k8s = require('@kubernetes/client-node');
// Kube.config represents the Kubernetes configuration which we are assigning to kc.
const kc = new k8s.KubeConfig();
// Loads the Kubernetes configuratiion from the default location
kc.loadFromDefault();
// Creates a client for interacting with Kubernetes Custom Objects API
// Allowing the manipulation of CRDs defined in Kubernetes.
const k8sApi =kc.makeApiClient(k8s.CustomObjectsApi);

