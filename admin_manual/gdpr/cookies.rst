=======
Cookies
=======

.. sectionauthor:: Björn Schießle <bjoern@nextcloud.com>
.. _cookies:

Nextcloud only stores cookies needed for Nextcloud to work properly. All cookies comes from your Nextcloud server directly, no 3rd-party cookies will be sent to your system. Regarding GDPR, `only data which contain personal data are relevant`_.

.. _`only data which contain personal data are relevant`: https://gdpr-info.eu/recitals/no-26/


Cookies stored by Nextcloud
===========================

=====================  ======================================  ==============================  =================================  =============================  =======================================
 Type                   Name                                    Value                           Purpose                            Creation                      Lifetime
=====================  ======================================  ==============================  =================================  =============================  =======================================
 Session cookie         ``<instance_id>``                       A random PHP session ID.        | Used to identify the user        At first load.                 At the end of the browser's session.
                                                                                                | on the server.
 Session cookie         ``oc_sessionPassphrase``                A random token.                 | Used to decrypt the session's    At first load.                 At the end of the browser's session.
                                                                                                | data on the server.
 Same-site cookies      ``__Host-nc_sameSiteCookiestrict``      ``true``                        See note below for the purpose.    At first load.                 Forever.
 Same-site cookies      ``__Host-nc_sameSiteCookielax``         ``true``                        See note below for the purpose.    At first load.                 Forever.
 Remember-me cookies    - ``nc_username``                       - The user id                                                      | At login if the              | Defaults to 15 days.
                        - ``nc_token``                          - A random remember me token                                       | user selected the            | Can be configured by setting:
                        - ``nc_session_id``                     - The original session id                                          | Remember-me checkbox.        | ``remember_login_cookie_lifetime``.
 Download helper        ``ocDownloadStarted``                   A random token.                 Help to manage file download.      When a download is started.    20 seconds.
=====================  ======================================  ==============================  =================================  =============================  =======================================

The same-site cookies are used to determine how a request reaches the Nextcloud server. We use them to prevent CSRF attacks. No identifiable information is stored in those.
The rest of the cookies are strictly used to identify the user to the system.
