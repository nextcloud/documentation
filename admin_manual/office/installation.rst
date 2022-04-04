============
Installation
============

Nextcloud Office is built on Collabora Online which requires a dedicated service running next to the Nextcloud webserver stack. There are several ways to run the coolwsd service.

- **Nextcloud All In One:** Nextcloud Office comes preinstalled out of the box in the `Nextcloud All In One <https://github.com/nextcloud/all-in-one>`_ setup and provides easy deployment and maintenance with most features included in this one Nextcloud instance.

For manual installations there are multiple options to get Nextcloud Office deployed:

- **Installation through distribution packages**
    There are packages for all major Linux distributions available which allow deploying a Collabora Online server through installing it through the regular package management. For an example installation guide on Ubuntu, see see: :doc:`example-ubuntu`

    .. seealso::
        https://www.collaboraoffice.com/code/linux-packages/ 
        https://sdk.collaboraonline.com/docs/installation/index.html


- **Installation through Docker**
    Docker images are available for deploying the Collabora Online server in container environments. For a detailed step by step guide, see: :doc:`example-docker`

    .. seealso::
        https://sdk.collaboraonline.com/docs/installation/CODE_Docker_image.html


- **Built-in CODE server** 
    This app provides a built-in server with all of the document editing features of Collabora Online. Easy to install, for personal use or for small teams. A bit slower than a standalone server and without the advanced scalability features. Installation can be performed by enabling the according Nextcloud app. Further details can be found in the `app documentation <https://github.com/CollaboraOnline/richdocumentscode>`_.

    .. note::
        This is the default option which works out of the box in most scenarios, however for improved performance it is highly recommended to switch to a dedicated Collabora Online installation using one of the other options.


.. note::
    In most scenarios running a dedicated Collabora Online server will require some sort of reverse proxy to be setup in front of it. For more details see :doc:`proxy`.

    
.. toctree::
    :hidden:
    
    example-ubuntu
    example-docker
    proxy