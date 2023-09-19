==============
Front-end code
==============

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
