.. _app-ci:

======================
Continuous Integration
======================

.. sectionauthor:: Christoph Wurst <christoph@winzerhof-wurst.at>

We highly recommend setting up automated tests for your app, so that every change has to pass a defined procedure before it's accepted into the main branch of your repository. Continuous integration typically includes

* Linting: check the syntax of source files, e.g. of all php scripts
* Static analysis: have tools check the types in your app for type soundness, mostly used for php
* Unit testing: run unit tests for front-end and back-end where individual classes and components are tested in isolation
* Integration testing: test components when they are combined

You can find a list of available github workflow templates in our `nextcloud template repository <https://github.com/nextcloud/.github>`_.

Linting
-------

info.xml
^^^^^^^^

You can validate the ``info.xml`` :ref:`app metadata<app metadata>` file of an app with a
`simple github action <https://github.com/nextcloud/.github/blob/master/workflow-templates/lint-info-xml.yml>`_.
Please refer to our `nextcloud template repository <https://github.com/nextcloud/.github>`_ for an up to date template.

php
^^^

A lint of all php source files can find syntax errors that could crash the application in production. You can find the github actions in our `nextcloud template repository <https://github.com/nextcloud/.github>`_.
You will also require the following lint script in your ``composer.json``:

.. code-block:: json

  {
    "scripts": {
      "lint": "find . -name \\*.php -not -path './vendor/*' -print0 | xargs -0 -n1 php -l"
    }
  }

php-cs
^^^^^^

We encourage the usage of php-cs linting. You can find some documentation on how to set this up in the
`nextcloud coding-standard repository <https://github.com/nextcloud/coding-standard>`_ as well as the
relevant github actions in our `nextcloud template repository <https://github.com/nextcloud/.github>`_.


.. _app-static-analysis:

Static analysis
---------------

`Psalm`_ is a static analysis tool that can check if your app code uses all types correctly, like if classes and methods exist.
For the basic setup see the `Psalm`_ website. In order to let Psalm know about Nextcloud interfaces (the OCP namespace),
you can install the `API package <https://packagist.org/packages/nextcloud/ocp>`_.
Afterwards you'll be able to check the app with the following ``psalm.xml`` that should be put into the root of the app.

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

.. note:: The definition suppresses usages of the global and static class ``OC`` like ``\OC::$server``, which is
    discouraged but still found in some apps. The doctrine suppression is currently necessary as the database mappers
    and schema abstractions leak some of the 3rd party libraries of Nextcloud that are not known to Psalm.


You can put this process into a GitHub Action that is run for every pull request.
Check our `psalm github action <https://github.com/nextcloud/.github/blob/master/workflow-templates/psalm.yml>`_ from
our `nextcloud template repository <https://github.com/nextcloud/.github>`_.

If you want to support multiple versions of Nextcloud server with a single app version, checkout this slightly
`more complex action <https://github.com/nextcloud/.github/blob/master/workflow-templates/psalm-matrix.yml>`_.
This creates a matrix, where the app is tested against ``dev-master``, the latest version of ``OCP`` found in the master
branch of Nextcloud server, as well as other currently supported stable branches. Adjust this to your needs.

.. _Psalm: https://psalm.dev/docs/
