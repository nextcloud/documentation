==============
Front-end code
==============

Prerequisites: Node.js and npm
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Nextcloud uses the **current active LTS** version of Node.js and npm. You can check the schedule at
`endoflife.date/nodejs <https://endoflife.date/nodejs>`_.

The required versions are declared in the ``engines`` field of the app's ``package.json``, for example:

.. code-block:: json

    {
        "engines": {
            "node": "^24.0.0",
            "npm": "^11.0.0"
        }
    }

We recommend using `nvm (Node Version Manager) <https://github.com/nvm-sh/nvm>`_ to install and switch between Node.js versions.
Once nvm is installed, you can install and activate the required Node.js version with:

.. code-block:: console

    # Install the Node.js version declared in .nvmrc or package.json engines
    nvm install
    nvm use

    # Or install a specific version explicitly
    nvm install 24
    nvm use 24

Then install or update npm to the version required by your app:

.. code-block:: console

    npm install -g npm@11

.. note::

    For the full Nextcloud Node.js and npm version policy, see the
    `Nextcloud standards <https://github.com/nextcloud/standards/issues/5>`_.


Building Vue components and scripts
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

We are moving more and more toward using Vue.js in the front-end, starting with Settings. For building the code on changes, use these terminal commands in the root folder:

.. code-block:: console

    # install dependencies
    npm install

    # build for development
    npm run dev

    # build for development and watch edits
    npm run watch

    # build for production with minification
    npm run build


Building styles
^^^^^^^^^^^^^^^

Styles are written in SCSS and compiled to css.

.. code-block:: console

    # install dependencies
    make dev-setup

    # compile style sheets
    npm run sass

    # compile style sheets and watch edits
    npm run sass:watch


Committing changes
^^^^^^^^^^^^^^^^^^

**When making changes, also commit the compiled files!**

We still use Handlebars templates in some places in Files and Settings. We will replace these step-by-step with Vue.js, but in the meantime, you need to compile them separately.

If you don’t have Handlebars installed yet, you can do it with this terminal command:

.. code-block:: console
    
   sudo npm install -g handlebars

Then inside the root folder of your local Nextcloud development installation, run this command in the terminal every time you changed a ``.handlebars`` file to compile it:

.. code-block:: console
    
   ./build/compile-handlebars-templates.sh

Before checking in JS changes, make sure to also build for production:

.. code-block:: console

    make build-js-production


Then add the compiled files for committing.

To save some time, to only rebuild for a specific app, use the following and replace the module with the app name:

.. code-block:: console

    MODULE=user_status make build-js-production

Please note that if you used ``make build-js`` or ``make watch-js`` before, you'll notice that a lot of files were marked as changed, so might need to clear the workspace first.
