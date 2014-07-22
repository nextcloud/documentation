Configuring External Storage
============================

ownCloud enables you to redirect files to external storage.  This topic describes how to configure Google Drive for external storage.

Before You Begin
----------------

All applications that access a Google API must be registered through the "Google Cloud Console".  You can access the Google Cloud console using the following URL:

   ::

     https://cloud.google.com/console

Configuring Google Drive for External Storage
---------------------------------------------

To configure Google Drive for external storage:

1. Access your Google Drive account page.

2. Enter your Google login credentials and press the ``Sign in`` button.

   .. figure:: ../images/external_google_drive_1_sign_in.png

3. Enter your verification code.

   .. figure:: The verification code was sent to you by SMS or the Authenticator App.

# ?? Where do I find this??

4. Click ``Verify``.

   .. figure:: ../images/external_google_drive_2_verify.png

5. Create a project by specifying a project name (for example, "ownCloud-Project").

   .. figure:: ../images/new_project_google_drive.png

6. Select the project and choose the "APIs & auth" menu entry.

   .. figure:: ../images/apis_auth_google_drive.png

7. Ensure that the "Drive API" and "Drive SDK" status is set to "ON" in the APIs menu.

   .. figure:: ../images/new_project_google_drive_api_settings.png

8. Click on the gear button next to the "Drive API" or "Drive SDK" and choose the "API access" menu entry.

9. Click ``Edit branding information ...``.

   The "Edit branding information" window opens.

   .. figure:: ../images/new_project_google_drive_branding.png

10. Specify the desired branding information that you want users to see whenever you request access to their private data using your new client ID.

11. Click ``Update``.

    The "Edit branding information" window closes.

12. Click ``Create another client ID...``.

    The "Create Client ID" window opens.

	.. figure:: ../images/new_project_google_drive_new_client.png

13. Select "Web application" as the application type.

14. Next to "Your site or hostname", click ``more options``.

# ??This doesn't appear to work.??

15. Enter the following URLs to the "Authorized Redirect URIs" list.

::

  https://your-internet-domain/owncloud/index.php/settings/personal
  https://your-internet-domain/owncloud/index.php/settings/admin


.. note:: **Attention:** Make sure that the URLs contain a valid internet domain name and that this domain name is also used to access ownCloud, otherwise these URLs will not be accepted. This does not mean that ownCloud need to be accessible from the Internet, but that the domain name is send to Google to verify if the redirect URIs are valid.

16.  Click ``Update``.

17. Log in to ownCloud using the previously entered Internet domain.

# ??Which one? It looks like we are supposed to enter two of them ... one personal and one admin.  I am unable to go further with these instructions without understanding why this isn't working the way it is described.??

18. Click ``Add storage`` in the ownCloud Admin or Personal settings dialog to add the Google Drive.

19. Specify the folder name that you want to use to access the share (for example, "GDrive").

20. Specify the Google OAuth 2.0 **Client ID** and **Client secret**.

    For the admin settings, you must also choose the **user and/or group** to allow access to the Google Drive (Applicable).

   .. image:: ../images/external_google_drive_5_setup_ownCloud.png

21. Click ``Grant Access``.

    Your are redirected to a Google website.

22. Click ``Accept`` to confirm that you accept the Google data usage and data security policy.

   .. image:: ../images/external_google_drive_6_accept.png
