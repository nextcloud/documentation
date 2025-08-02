=======================
Upgrade to Nextcloud 32
=======================

System requirements
-------------------

* PHP 8.1 is now deprecated but still supported.
* PHP 8.4 is now supported, but 8.3 is recommended.

Web server configuration
------------------------

* Setup checks do not check for the ``X-XSS-Protection`` response header anymore. It has been removed from Nextcloud's ``.htaccess`` and you may want to adjust your webserver config to not serve it anymore.
  XSS filtering was supported only until Chromium 78 and similarly old browsers, but had been found to cause more issues, including attack vectors, than it solved.
  Nowadays, aside of not serving the header at all, the only generally recommended value is ``0``. More context can be found in the `OWASP Cheat Sheet Series <https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html#x-xss-protection>`_.

Monitoring: Counting of active users
------------------------------------

The monitoring app was adjusted to count the active users in the same way as occ user:report and the support app.