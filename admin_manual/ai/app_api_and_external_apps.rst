========================
AppAPI and External Apps
========================

.. _ai-app_api:

Previously, Nextcloud only supported applications written in the PHP programming language. In order to support a wider range of use cases,
the External App ecosystem was introduced, which allows installing apps that are docker containers.

Most of our AI apps nowadays are ExApps (External Apps). And thus require some preparation of your Nextcloud before you can install them.

Installation
------------

1. You will need to install the `AppAPI <https://apps.nextcloud.com/apps/app_api>`_ app from the app store.
2. You will need to set up a Deploy Daemon in the AppAPI admin settings. A Deploy Daemon is an endpoint that allows the Nextcloud instance to install and communicate with External Apps.

   1. You will need to setup a docker container called *Docker-Socket proxy* as outlined in the following link: https://github.com/cloud-py-api/docker-socket-proxy#readme
   2. Now you can connect your Nextcloud to the Docker-Socket proxy by entering its details in the Deploy Daemon creation form in the AppAPI settings.
   3. Make sure to enable GPU support if you want the installed apps to be able to use the GPU

3. You can now install ExApps from the Nextcloud Appstore by clicking "Install" on the respective app in the AppAPI apps page.

