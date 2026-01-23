.. _vscode:

===================
VS Code Setup Guide
===================

This guide covers setting up Visual Studio Code for Nextcloud development.

.. note::
   VS Code is one of several IDEs you can use for Nextcloud development.
   Other popular choices include **PhpStorm** and **Vim**.

DevContainer (Recommended)
==========================

The Nextcloud documentation and server repositories include VS Code DevContainer configurations
for a consistent development environment.

Using DevContainer locally
--------------------------

1. Install `Docker Desktop <https://www.docker.com/products/docker-desktop/>`_
2. Install the `Dev Containers extension <https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers>`_ in VS Code
3. Open the repository folder in VS Code
4. When prompted, click "Reopen in Container" or use the command palette (``F1``) and select **Dev Containers: Reopen in Container**

The DevContainer will automatically:

- Set up the required runtime environment
- Install necessary dependencies
- Configure recommended VS Code extensions

Using GitHub Codespaces
-----------------------

You can also use `GitHub Codespaces <https://github.com/features/codespaces>`_ for cloud-based development:

1. Navigate to the repository on GitHub
2. Click the green "Code" button
3. Select the "Codespaces" tab
4. Click "Create codespace on main"

For more details, see the `VS Code DevContainers documentation <https://code.visualstudio.com/docs/devcontainers/containers>`_.

Recommended Extensions
======================

PHP Development
---------------

For Nextcloud server and app development:

- `PHP Intelephense <https://marketplace.visualstudio.com/items?itemName=bmewburn.vscode-intelephense-client>`_ - PHP code intelligence
- `PHP Debug <https://marketplace.visualstudio.com/items?itemName=xdebug.php-debug>`_ - Xdebug debugging support
- `PHP DocBlocker <https://marketplace.visualstudio.com/items?itemName=neilbrayfield.php-docblocker>`_ - DocBlock generation
- `PHPStan <https://marketplace.visualstudio.com/items?itemName=swordev.phpstan>`_ - Static analysis

JavaScript/TypeScript Development
---------------------------------

For frontend development:

- `ESLint <https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint>`_ - JavaScript linting
- `Vue - Official <https://marketplace.visualstudio.com/items?itemName=Vue.volar>`_ - Vue.js language support
- `Prettier <https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode>`_ - Code formatting

Documentation
-------------

For working with Nextcloud documentation:

- `reStructuredText <https://marketplace.visualstudio.com/items?itemName=lextudio.restructuredtext>`_ - RST language support
- `PDF Viewer <https://marketplace.visualstudio.com/items?itemName=tomoki1207.pdf>`_ - Preview PDF files

Workspace Settings
==================

Create a ``.vscode/settings.json`` file in your project with recommended settings:

.. code-block:: json

   {
       "php.validate.executablePath": "/usr/bin/php",
       "intelephense.environment.phpVersion": "8.1",
       "editor.formatOnSave": true,
       "files.trimTrailingWhitespace": true,
       "files.insertFinalNewline": true
   }

Debugging with Xdebug
=====================

To set up PHP debugging:

1. Install the PHP Debug extension
2. Configure Xdebug in your PHP installation
3. Create a ``.vscode/launch.json`` file:

.. code-block:: json

   {
       "version": "0.2.0",
       "configurations": [
           {
               "name": "Listen for Xdebug",
               "type": "php",
               "request": "launch",
               "port": 9003,
               "pathMappings": {
                   "/var/www/html": "${workspaceFolder}"
               }
           }
       ]
   }

4. Set breakpoints in your code
5. Start the debugger with ``F5``

For more information on Xdebug configuration, see the `Xdebug documentation <https://xdebug.org/docs/>`_.

Related Resources
=================

- :ref:`devenv` - Development environment setup without Docker
- `VS Code DevContainers <https://code.visualstudio.com/docs/devcontainers/containers>`_ - Official documentation
- `Nextcloud development tutorial <https://cloud.nextcloud.com/s/iyNGp8ryWxc7Efa?path=%2F>`_ - Docker-based setup tutorial
