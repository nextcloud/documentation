======================
Warnings on Admin Page
======================

Your ownCloud server has a built-in configuration checker, and it reports its 
findings at the top of your Admin page. These are some of the warnings you 
might see, and what to do about them.

.. figure:: ../images/security-setup-warning-1.png

Cache Warnings
--------------

"No memory cache has been configured. To enhance your performance please 
configure a memcache if available." ownCloud supports multiple php caching
extentions:

* APC
* APCu (minimum required php extension version: 4.0.6)
* Memcached
* Redis (minimum required php extension version: 2.2.5)
* Xcache

You will see this warning if you have no caches installed or if your cache
does not have the required minimum version installed; older versions are
disabled because of performance problems.

If you see "*{Cache}* below version *{Version}* is installed. for stability and
performance reasons we recommend to update to a newer *{Cache}* version" then
you need to upgrade, or, if you're not using it, remove it.

It is not required to use any caches, but caches improve server performance. See 
:ref:`caching` for more information on installing and using caches.

You are accessing this site via HTTP
------------------------------------

"You are accessing this site via HTTP. We strongly suggest you configure your 
server to require using HTTPS instead." Please take this warning seriously; 
using HTTPS is a fundamental security measure. You must configure your Web 
server to support it, and then there are some settings in the **Security** 
section of your ownCloud Admin page to enable. The following manual pages 
describe how to enable HTTPS on the Apache and Nginx Web servers.

:ref:`enabling-ssl-label` (on Apache)

:ref:`use-https-label`

:ref:`nginx_configuration_example`

The test with getenv(\"PATH\") only returns an empty response
-------------------------------------------------------------

Some environments are not passing a valid PATH variable to ownCloud. The
:ref:`using_php-fpm` provides the information about how to configure your environment.

The "Strict-Transport-Security" HTTP header is not configured
-------------------------------------------------------------

"The "Strict-Transport-Security" HTTP header is not configured to least "15768000" seconds.
For enhanced security we recommend enabling HSTS as described in our security tips."

The HSTS header needs to be configured within your webserver by following the
:ref:`enable-hsts-label` documentation

/dev/urandom is not readable by PHP
-----------------------------------

"/dev/urandom is not readable by PHP which is highly discouraged for security reasons.
Further information can be found in our documentation."

This message is another one which needs to be taken seriously. Please have a look
at the :ref:`dev-urandom-label` documentation.

Your web server is not yet set up properly to allow file synchronization
------------------------------------------------------------------------

"Your web server is not yet set up properly to allow file synchronization because
the WebDAV interface seems to be broken."

At the ownCloud community forums a larger `FAQ <https://forum.owncloud.org/viewtopic.php?f=17&t=7536>`_
is maintained containing various information and debugging hints.

Outdated NSS / OpenSSL version
------------------------------

"cURL is using an outdated OpenSSL version (OpenSSL/$version). Please update your 
operating system or features such as installing and updating apps via the app store 
or Federated Cloud Sharing will not work reliably."

"cURL is using an outdated NSS version (NSS/$version). Please update your operating 
system or features such as installing and updating apps via the app store or Federated 
Cloud Sharing will not work reliably."

There are known bugs in older OpenSSL and NSS versions leading to misbehaviour in 
combination with remote hosts using SNI. A technology used by most of the HTTPS
websites. To ensure that ownCloud will work properly you need to update OpenSSL
to at least 1.0.2b or 1.0.1d. For NSS the patch version depends on your distribution
and an heuristic is running the test which actually reproduces the bug. There
are distributions such as RHEL/CentOS which have this backport still `pending <https://bugzilla.redhat.com/show_bug.cgi?id=1241172>`_.
