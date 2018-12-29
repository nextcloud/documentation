===
NPM
===

The node package manager ``npm`` is a widely used tool to manage JavaScript dependencies. In
order to make the project setup easier for everybody, we recommend to follow the convention
of typical scripts like ``build``, ``watch`` and ``test`` in the ``package.json`` file.

You can find more info about this convention on blog posts like this `https://www.keithcirkel.co.uk/how-to-use-npm-as-a-build-tool/`_.

npm build
---------

Once ``npm install`` (``npm i`` for short) has been run to install all dependencies specified
on ``package.json``, one typically has to build the project. Building can happen with tools like
Webpack, Grunt or similar. To unify the build command across Nextcoud apps, just add the build
command(s) as ``build`` script to your.

For apps that use webpack, this might look like this:

.. code-block:: json

  {
    "name": "myapp",
    "scripts": {
      "build": "webpack --progress --config webpack.prod.js"
    },
    "devDependencies": {
      "webpack": "^4.26.1",
      "webpack-cli": "^3.1.2",
    }
  }

You can then run ``npm build`` in your app's root directory to invoke the build process.

See the `npm-build docs https://docs.npmjs.com/cli/build`_ for more info.

npm run watch
-------------

Since building the release version of JavaScript scripts can be slow, apps often have a dedicated
build step for development that builds faster and enables debug output. Additionally, it instructs
the bundler to listen to file changes and (incrementally) rebuild the project.

This command should be added to ``package.json`` as ``watch`` script:

.. code-block:: json

  {
    "name": "myapp",
    "scripts": {
      "build": "webpack --progress --config webpack.prod.js",
      "watch": "webpack --progress --config webpack.dev.js --watch"
    },
    "devDependencies": {
      "webpack": "^4.26.1",
      "webpack-cli": "^3.1.2",
    }
  }

The development build is invoked with ``npm run dev``.

npm test
--------

Npm will run the ``test`` script when ``npm test`` is run, hence you might want to specify the
test command(s) like this:

.. code-block:: json

  {
    "scripts": {
      "test": "mocha-webpack --webpack-config webpack.test.js --require src/tests/setup.js \"src/tests/**/*.spec.js\""
    }
  }

More info about this command can be found in the `npm-test documentation https://docs.npmjs.com/cli/test`_.

npm run lint (optional)
-----------------------

Nextcloud apps that use linting tools for consistent code formatting typically add a ``lint`` script to their
``package.json``:

.. code-block:: json

  {
    "scripts": {
      "lint": "eslint --ext .js,.vue src"
    }
  }

If style linting is a separate script, ``stylelint`` shall be used as conventional script name:

.. code-block:: json

  {
    "scripts": {
      "stylelint": "stylelint src"
    }
  }
