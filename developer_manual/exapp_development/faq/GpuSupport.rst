GPU support
-----------

How to enable GPU support for the Deploy daemon?
************************************************

To enable GPU support, you have to specify the GPU compute device when registering the Deploy daemon configuration.

In this way, by default, AppAPI will create ExApp containers with request to the Docker Engine to attach all available GPU devices.
This also involves the specific ExApp supporting work with GPU internally
and the necessary Docker runtime toolkits installed on the Deploy daemon host:

- For NVIDIA, refer to the `NVIDIA Docker configuration docs <https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/install-guide.html>`_.
- For AMD, refer to the `ROCm Docker configuration docs <https://rocm.docs.amd.com/projects/install-on-linux/en/latest/how-to/docker.html>`_.

.. note::

	If you encounter any issues with GPU support, it is highly dependent on the specific GPU device,
	software libraries and therefore ExApps support of different hardware, or other factors.
	Please, feel free to ask for help by creating an issue.


How to limit the number of GPUs per ExApp?
******************************************

Currently, there is no such configuration option.
AppAPI attaches all available GPU devices to each ExApp container on the same Deploy daemon.

