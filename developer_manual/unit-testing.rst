Unit Testing
============

ownCloud uses the `SimpleTest`_ PHP unit testing framework for monitoring code stability. As much of ownCloud as possible should be covered by unit tests, including 3rd party apps.

View unit test results in a web browser by accessing the ``/tests`` directory. The current results for the public dev demo ownCloud server (running about 5 mins behind git master) can be viewed at http://demo.owncloud.org/dev/tests/. In development versions of ownCloud tests can also be run from the command-line. To do so execute ``php -f index.php`` from within the ``/tests`` directory, with appropriate permissions.

SimpleTest has been configured for easy unit testing of ownCloud apps. The ``tests`` folder within an app root directory should be used to store unit tests and any data that they use. These tests will be run automatically when ``/tests`` is accessed.

You can run only a selected number of tests by passing a parameter as prefix-filter for the tests. When running from the browser, the ``test`` GET variable is used, when running from command-line it is passed as command line argument. For example, the tests from the ``files_archive`` app can be viewed at http://demo.owncloud.org/tests/?test=/apps/files_archive or by executing ``php -f index.php /apps/files_archive`` from the command-line.

Apps which modify core ownCloud functionality can extend test cases which already exist within ``/tests/lib``. For an example of an app unit test which extends an existing unit test, see ``/apps/files_archive/tests/storage.php``. Apps which make use of public ownCloud functions, for getting logged-in user information for example, can use dummy classes which have been provided for this purpose, such as ``/lib/user/dummy.php``.

For information about writing tests, see `SimpleTest documentation`_.

.. _SimpleTest: http://simpletest.org/
.. _SimpleTest documentation: http://simpletest.org/en/start-testing.html
