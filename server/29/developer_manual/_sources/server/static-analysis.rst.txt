===============
Static analysis
===============

PHP static analysis
-------------------

In the server repository psalm is used for static analysis of the PHP code.

.. _psalm-php-extensions:

Required PHP extensions
^^^^^^^^^^^^^^^^^^^^^^^

The following PHP extensions are required to be installed and enabled to make psalm work:

* acpu
* curl
* ftp
* gd
* iconv
* imagick
* json
* ldap
* libxml
* mbstring
* openssl
* pdo
* simplexml
* sysvsem
* xmlreader
* zip

Some of these are for optional features, but are still required to validate the code.
