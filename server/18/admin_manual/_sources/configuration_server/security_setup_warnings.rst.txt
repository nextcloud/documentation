======================
Warnings on admin page
======================

Your Nextcloud server has a built-in configuration checker, and it reports its 
findings at the top of your Admin page. These are some of the warnings you 
might see, and what to do about them.

.. figure:: ../images/security-setup-warning-1.png

You can use the  `Nextcloud Security Scan <https://scan.nextcloud.com>`_ to see
if your system is up to date and well secured. We have ran this scan over public
IP addresses in the past to try and reach out to `extremely outdated systems <https://nextcloud.com/blog/nextcloud-releases-security-scanner-to-help-protect-private-clouds/>`_
and might again in the future. Please, protect your privacy and keep your server
up to date! Privacy means little without security.

Cache warnings
--------------

"No memory cache has been configured. To enhance your performance please 
configure a memcache if available." Nextcloud supports multiple php caching
extensions:

* APCu (minimum required PHP extension version 4.0.6)
* Memcached
* Redis (minimum required PHP extension version: 2.2.6)

You will see this warning if you have no caches installed and enabled, or if 
your cache does not have the required minimum version installed; older versions 
are disabled because of performance problems.

If you see "*{Cache}* below version *{Version}* is installed. for stability and
performance reasons we recommend to update to a newer *{Cache}* version" then
you need to upgrade, or, if you're not using it, remove it.

You are not required to use any caches, but caches improve server performance. 
See :doc:`caching_configuration`.

Transactional file locking is disabled
--------------------------------------

"Transactional file locking is disabled, this might lead to issues with race
conditions."

Please see :doc:`../configuration_files/files_locking_transactional` on how
to correctly configure your environment for transactional file locking.

You are accessing this site via HTTP
------------------------------------

"You are accessing this site via HTTP. We strongly suggest you configure your 
server to require using HTTPS instead." Please take this warning seriously; 
using HTTPS is a fundamental security measure. You must configure your Web 
server to support it, and then there are some settings in the **Security** 
section of your Nextcloud Admin page to enable. The following pages 
describe how to enable HTTPS on the Apache and Nginx Web servers.

:ref:`enabling_ssl_label` (on Apache)

:ref:`use_https_label`

:doc:`../installation/nginx`

The test with getenv(\"PATH\") only returns an empty response
-------------------------------------------------------------

Some environments are not passing a valid PATH variable to Nextcloud. The
:ref:`php_fpm_tips_label` provides the information about how to configure your 
environment.

The "Strict-Transport-Security" HTTP header is not configured
-------------------------------------------------------------

"The "Strict-Transport-Security" HTTP header is not configured to least "15552000" seconds.
For enhanced security we recommend enabling HSTS as described in our security tips."

The HSTS header needs to be configured within your Web server by following the
:ref:`enable-hsts-label` documentation

/dev/urandom is not readable by PHP
-----------------------------------

"/dev/urandom is not readable by PHP which is highly discouraged for security reasons.
Further information can be found in our documentation."

This message is another one which needs to be taken seriously. Please have a look
at the :ref:`dev-urandom-label` documentation.

Your Web server is not yet set up properly to allow file synchronization
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

There are known bugs in older OpenSSL and NSS versions leading to misbehavior in 
combination with remote hosts using SNI. A technology used by most of the HTTPS
websites. To ensure that Nextcloud will work properly you need to update OpenSSL
to at least 1.0.2b or 1.0.1d. For NSS the patch version depends on your distribution
and an heuristic is running the test which actually reproduces the bug. There
are distributions such as RHEL/CentOS which have this backport still `pending 
<https://bugzilla.redhat.com/show_bug.cgi?id=1241172>`_.

Your Web server is not set up properly to resolve /.well-known/caldav/ or /.well-known/carddav/
-----------------------------------------------------------------------------------------------

Both URLs need to be correctly redirected to the DAV endpoint of Nextcloud. Please
refer to :ref:`service-discovery-label` for more info.

Some files have not passed the integrity check
----------------------------------------------

Please refer to the :ref:`code_signing_fix_warning_label` documentation how to debug this issue.

Your database does not run with "READ COMMITED" transaction isolation level
---------------------------------------------------------------------------

"Your database does not run with "READ COMMITED" transaction isolation level.
This can cause problems when multiple actions are executed in parallel."

Please refer to :ref:`db-transaction-label` how to configure your database for this requirement.
