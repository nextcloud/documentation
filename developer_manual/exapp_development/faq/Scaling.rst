Scaling
=======

AppAPI delegates the scaling task to the ExApp itself.
This means that the ExApp must be designed in a way to be able to scale vertically.
As for the horizontal scaling, it is currently not possible except by using,
for example, a Server-Worker architecture, which is a good way to support basic scaling capabilities.
In this case, the Server is your ExApp and the Workers are the external machines that can work with the ExApp
using Nextcloud user authentication.
Additional clients (or workers) can be (optionally) added (or attached) to the ExApp
to increase the capacity and performance.


GPUs scaling
------------

Currently, if a Deploy daemon configured with GPUs available,
AppAPI by default will attach all available GPU devices to each ExApp container on this Deploy daemon.
This means that these GPUs are shared between all ExApps on the same Deploy daemon.
Therefore, for the ExApps that require heavy use of GPUs,
it is recommended to have a separate Deploy daemon (host) for them.

