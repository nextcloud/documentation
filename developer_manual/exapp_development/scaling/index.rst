Scaling ExApps
==============

AppAPI delegates the scaling task to the ExApp itself.
This means that the ExApp must be designed to scale vertically.
For horizontal scaling, we recommend using Kubernetes.

You could also implement, for example, a Server-Worker architecture for basic scaling.
In this case, the Server is your ExApp and the Workers are the external machines that can work with the ExApp
using Nextcloud user authentication.
Additional clients (or workers) can be (optionally) added (or attached) to the ExApp
to increase the capacity and performance.

The rest of this section will explain how to setup and use Kubernetes for automated scaling.
Additional instructions are also provided if you have a GPU device for GPU scaling.

.. toctree::
	:maxdepth: 2

	KubernetesSetup
	KEDASetup
	AppAPIEmulation
