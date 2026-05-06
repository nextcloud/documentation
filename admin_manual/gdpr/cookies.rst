=======
Cookies
=======

.. sectionauthor:: Björn Schießle <bjoern@nextcloud.com>
.. _cookies:

Nextcloud only stores cookies needed for Nextcloud to work properly. All cookies comes from your Nextcloud server directly, no 3rd-party cookies will be sent to your system. Regarding GDPR, `only data which contain personal data are relevant`_.

.. _`only data which contain personal data are relevant`: https://gdpr-info.eu/recitals/no-26/


Cookies stored by Nextcloud
===========================

====================  ====================================  ================
 Cookie               Data Stored                             Lifetime
====================  ====================================  ================
 Session cookie        - session ID                          24 minutes
                       - secret token (used to decrypt 
                         the session on the server)
 Same-site cookies     no user-related data are stored,      forever
                       all same-site cookies are the same
                       for all users on all Nextcloud 
                       instances
 Remember-me cookie    - user id                             15 days (can be
                       - original session id                 configured)
                       - remember token                       
====================  ====================================  ================

The same-site cookies are used to determine how a request reaches the Nextcloud server. We use them to prevent CSRF attacks. No identifiable information is stored in those.
The rest of the cookies are strictly used to identify the user to the system.
