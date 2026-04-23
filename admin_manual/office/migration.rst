===============================
Migration from Collabora Online
===============================

Nextcloud Office is based on Collabora Online so for enabling all Nextcloud Office functionality it would be enough to update to the most recent release. Nextcloud Office is available since CODE 21.11.

.. note::
    This upgrade guide is aimed for upgrading from CODE 6.4 to CODE 21.11.

Update the reverse proxy configuration
**************************************

Due to naming changes in the Collabora Online releases it may be required to adjust reverse proxy configurations that are already in use for previously existing setups.

- Paths with ``lool`` have been renamed to ``cool``
- Paths with ``loleaflet`` have been renamed to ``browser``

Fully detailed reverse proxy configuration guides for various solutions can be found at https://sdk.collaboraonline.com/docs/installation/Proxy_settings.html

Upgrade distribution packages
*****************************

- The main service has been renamed from ``loolwsd`` to ``coolwsd``
- The service rename also affects the location of the configuration file ``/etc/coolwsd/coolwsd.xml``

Required upgrade steps:

- Stop the ``loolwsd`` service
- Backup ``/etc/loolwsd/loolwsd.xml`` configuration file.
- Remove ``loolwsd`` and ``collaboraoffice*`` packages.
- Change the version number in the repository URL, e.g. from 6.4 to 21.11
- Install the ``coolwsd`` package
- Adapt the new configuration file in ``/etc/coolwsd/coolwsd.xml`` to match your previous configuration
- Start and enable the ``coolwsd`` service

Upgrade the docker image
************************

For upgrading the docker images it is enough to pull the latest CODE image from Docker Hub.