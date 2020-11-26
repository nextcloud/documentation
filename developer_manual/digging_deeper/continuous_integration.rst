======================
Continuous Integration
======================

.. sectionauthor:: Christoph Wurst <christoph@winzerhof-wurst.at>

We highly recommend setting up automated tests for your app, so that every change has to pass a defined procedure before it's accepted into the main branch of your repository. Continuous integration typically includes

* Linting: check the syntax of source files, e.g. of all php scripts
* Static analysis: have tools check the types in your app for type soundness, mostly used for php
* Unit testing: run unit tests for front-end and back-end where individual classes and components are tested in isolation
* Integration testing: test components when they are combined

Linting
-------

info.xml
^^^^^^^^

You can validate the ``info.xml`` :ref:`app metadata<app metadata>` file of an app with a simple github action:

.. code-block:: yaml

  name: Lint
  on: pull_request

  jobs:
    xml-linters:
      runs-on: ubuntu-latest
      steps:
      - name: Checkout
        uses: actions/checkout@master
      - name: Download schema
        run: wget https://apps.nextcloud.com/schema/apps/info.xsd
      - name: Lint info.xml
        uses: ChristophWurst/xmllint-action@v1
        with:
          xml-file: ./appinfo/info.xml
          xml-schema-file: ./info.xsd

php
^^^

A lint of all php source files can find syntax errors that could crash the application in production. The github action below uses a test matrix of multiple php versions. Adjust it to the ones your app supports.

.. code-block:: yaml

  name: Lint
  on: pull_request
    php-linters:
      runs-on: ubuntu-latest
      strategy:
        matrix:
          php-versions: [7.3, 7.4]
      name: php${{ matrix.php-versions }} lint
      steps:
      - name: Checkout
        uses: actions/checkout@master
      - name: Set up php${{ matrix.php-versions }}
        uses: shivammathur/setup-php@master
        with:
          php-version: ${{ matrix.php-versions }}
          coverage: none
      - name: Lint
        run: composer run lint


App code checker
----------------

Nextcloud comes with an *app code checker* that analyzes the code of an app and warns if deprecated APIs are used and similar. Most of the checks can also be done with :ref:`static analysis and 3rd party tools<app-static-analysis>` but a few checks are currently only possible with this tool.

The following Github action checks an app against the latest development version of Nextcloud, the `stable20` branch and the v20.0.0 release. Adjust this to your needs.

.. code-block:: yaml

  name: App code check
  on: pull_request
    app-code-check:
      runs-on: ubuntu-latest
      strategy:
        matrix:
          nextcloud-versions: ['master', 'stable20', 'v20.0.0']
      name: Nextcloud ${{ matrix.nextcloud-versions }} app code check
      steps:
      - name: Set up php7.4
        uses: shivammathur/setup-php@master
        with:
          php-version: 7.4
          extensions: ctype,curl,dom,gd,iconv,intl,json,mbstring,openssl,posix,sqlite,xml,zip
          coverage: xdebug
      - name: Checkout Nextcloud
        run: git clone https://github.com/nextcloud/server.git --recursive --depth 1 -b ${{ matrix.nextcloud-versions }} nextcloud
      - name: Run tests
        run: php -f nextcloud/occ maintenance:install --database-name oc_autotest --database-user oc_autotest --admin-user admin --admin-pass admin --database sqlite --database-pass=''
      - name: Checkout
        uses: actions/checkout@master
        with:
          path: nextcloud/apps/myapp
      - name: Run tests
        run: php -f nextcloud/occ app:check-code myapp

.. note:: Replace ``myapp`` with the ID of the app.

.. _app-static-analysis:

Static analysis
---------------

`Psalm`_ is a static analysis tool that can check if your app code uses all types correctly, like if classes and methods exist. For the basic setup see the `Psalm`_ website. In order to let Psalm know about Nextcloud interfaces (the OCP namespace), you can install the `API package <https://packagist.org/packages/christophwurst/nextcloud>`_. Afterwards you'll be able to check the app with the following ``psalm.xml`` that should be put into the root of the app.

.. code-block:: xml

    <?xml version="1.0"?>
    <psalm
        totallyTyped="true"
        errorLevel="5"
        resolveFromConfigFile="true"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xmlns="https://getpsalm.org/schema/config"
        xsi:schemaLocation="https://getpsalm.org/schema/config vendor/vimeo/psalm/config.xsd"
        errorBaseline="tests/psalm-baseline.xml"
    >
        <projectFiles>
            <directory name="lib" />
            <ignoreFiles>
                <directory name="vendor" />
                <directory name="lib/Vendor" />
            </ignoreFiles>
        </projectFiles>
        <extraFiles>
            <directory name="vendor" />
            <ignoreFiles>
                <directory name="vendor/phpunit/php-code-coverage" />
            </ignoreFiles>
        </extraFiles>
        <issueHandlers>
            <UndefinedClass>
                <errorLevel type="suppress">
                    <referencedClass name="OC" />
                </errorLevel>
            </UndefinedClass>
            <UndefinedDocblockClass>
                <errorLevel type="suppress">
                    <referencedClass name="Doctrine\DBAL\Schema\Schema" />
                    <referencedClass name="Doctrine\DBAL\Schema\SchemaException" />
                    <referencedClass name="Doctrine\DBAL\Driver\Statement" />
                    <referencedClass name="Doctrine\DBAL\Schema\Table" />
                </errorLevel>
            </UndefinedDocblockClass>
        </issueHandlers>
    </psalm>

.. Note:: The definition supresses usages of the global and static class ``OC`` like ``\OC::$server``, which is discouraged but still found in some apps. The doctrine supression is currently necessary as the database mappers and schema abstractions leak some of the 3rd party libraries of Nextcloud that are not known to Psalm.


You can put this process into a Github Action that is run for every pull request.

.. code-block:: yaml

    name: Static analysis
    on: [push]
    jobs:
    static-psalm-analysis:
        runs-on: ubuntu-latest
        strategy:
            matrix:
                ocp-version: [ 'dev-master', 'v20.0.0' ]
        name: Nextcloud ${{ matrix.ocp-version }}
        steps:
            - name: Checkout
                uses: actions/checkout@master
            - name: Set up php
                uses: shivammathur/setup-php@master
                with:
                    php-version: 7.4
                    coverage: none
            - name: Install dependencies
                run: composer i
            - name: Install dependencies
                run: composer require --dev christophwurst/nextcloud:${{ matrix.ocp-version }}
            - name: Run coding standards check
                run: composer run psalm

This creates a matrix, where the app is tested against ``dev-master``, the latest version of ``OCP`` found in the main branch of Nextcloud server, as well as ``v20.0.0``, the currently latest stable release. Adjust this to your needs.

.. _Psalm: https://psalm.dev/docs/
