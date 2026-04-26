.. _cookies:

=======
Cookies
=======

Nextcloud only stores cookies that are necessary for it to function. All
cookies are set by your Nextcloud server directly — no third-party cookies are involved.

Under GDPR, only cookies that store or transmit personal data require a legal
basis or consent. Of the cookies listed below, only the remember-me cookies
contain personal data (the username). All other cookies contain randomly
generated tokens with no inherent personal information.

.. note::
   The ``__Host-`` prefix is applied to the same-site cookies only when
   Nextcloud is accessed over HTTPS. On plain HTTP the prefix is omitted and
   the cookies are named ``nc_sameSiteCookiestrict`` and
   ``nc_sameSiteCookielax``.

Cookies stored by Nextcloud
===========================

.. list-table::
   :header-rows: 1
   :widths: 20 25 35 10 10

   * - Type
     - Name
     - Purpose
     - Personal data
     - Lifetime
   * - Session cookie
     - ``<instance_id>``
     - Carries a random PHP session ID used to identify the user's session
       on the server.
     - No
     - Until browser is closed.
   * - Session cookie
     - ``oc_sessionPassphrase``
     - Carries a random token used to decrypt the session data stored on the
       server.
     - No
     - Until browser is closed.
   * - Same-site cookie
     - ``__Host-nc_sameSiteCookiestrict``
     - Used to detect whether a request originates from the same site
       (``SameSite=Strict``). Helps prevent CSRF attacks. Contains no user
       information.
     - No
     - Expires 2100-12-31 (effectively permanent).
   * - Same-site cookie
     - ``__Host-nc_sameSiteCookielax``
     - Used to detect cross-site navigation requests
       (``SameSite=Lax``). Helps prevent CSRF attacks. Contains no user
       information.
     - No
     - Expires 2100-12-31 (effectively permanent).
   * - Remember-me cookie
     - ``nc_username``
     - Stores the user's login name to enable persistent login across browser
       sessions.
     - **Yes** — contains the username.
     - Defaults to 15 days. Configurable via ``remember_login_cookie_lifetime``.
   * - Remember-me cookie
     - ``nc_token``
     - A random token paired with ``nc_username`` to authenticate the
       persistent login without storing the password.
     - No
     - Same as ``nc_username``.
   * - Remember-me cookie
     - ``nc_session_id``
     - The original session ID, retained to allow session continuity when the
       remember-me token is used.
     - No
     - Same as ``nc_username``.
   * - Download helper
     - ``ocDownloadStarted``
     - A short-lived random token set when a file download begins, used to
       signal the browser that the download has started (e.g. to hide a
       loading indicator).
     - No
     - 20 seconds.

Remember-me cookies
===================

The remember-me cookies (``nc_username``, ``nc_token``, ``nc_session_id``) are
only set when the user explicitly selects **Remember me** at login. They are
cleared immediately when the user logs out.

Because ``nc_username`` contains the user's login name, it is personal data
under GDPR. The legal basis for storing it is typically **legitimate interest**
or **contract performance** (enabling the service the user has requested),
provided the user has been informed of this in your privacy policy.

The lifetime defaults to 15 days and can be shortened in ``config/config.php``::

  'remember_login_cookie_lifetime' => 60 * 60 * 24 * 15,
