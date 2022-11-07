=============================
Synchronizing with Windows 10
=============================

Calendar
--------

1. In your browser, navigate to the Nextcloud Calendar app. Under "Settings & import", copy the address using "Copy iOS/macOS CalDAV address" into your clipboard.

2. Launch the Windows 10 Calendar app. Then, click the settings icon (gear icon) and select "Manage accounts".

3. Click "Add account" and choose "iCloud".

4. Enter an email, username and password. None of this information has to be valid-it will all be changed in the upcoming steps.

5. Click "Done". A message should appear indicating the settings were saved successfully.

6. In the "Manage Accounts" menu, click on  the iCloud account created in previous steps, and select "Change settings". Then, click on "Change mailbox sync settings".

7. Scroll to the bottom of the dialog box, select "Advanced mailbox settings". Scroll once more to the bottom of the dialog box and paste your CalDAV URL in the field labelled "Calendar server (CalDAV)".

8. Click "Done". Enter your Nextcloud username and password in the appropriate fields, and change the account name to whatever you prefer (e. g. "Nextcloud Calendar"). Click "Save".

Contacts
--------

1. Repeat steps 1–7 from the Calendar instructions. If you already have setup the Calendar synchronization, you can use the same account for this.

2. Scroll to the bottom of the dialog box, select "Advanced mailbox settings". Scroll once more to the bottom of the dialog box and paste your CardDAV URL in the field labelled "Contacts server (CardDAV)".

3. Replace the path "principals" within the URL with "addressbooks".

4. Click "Done". Enter your Nextcloud username and password in the appropriate fields, and change the account name to whatever you prefer (e. g. "Nextcloud"). Click "Save".

Troubleshooting: 2FA
--------------------

**NOTE: You will not be able to synchronize your calendar if you have two-factor authentication enabled. Follow the steps below to get an app password that can be used with the Calendar client app:**

1. Log into Nextcloud. Click on your user icon, then click on "Settings".

2. Click on "Security", then locate a button labeled "Create new app password". Next to this button, enter "Windows 10 Calendar app". Then, click the button, copy and paste the password. Use this password instead of your Nextcloud password for Step 8.

Troubleshooting: TLSv1.2
------------------------

- For Windows 10 your Nextcloud https server `must support TLSv1.2`_.  This is apparent if no connection attempts are seen on the server, and the Windows client Event Viewer will display Schannel TLS errors under "Windows Logs -> System".

Credits
------

Special thanks to this Reddit user for their post:
https://www.reddit.com/r/Nextcloud/comments/5rcypb/using_the_windows_10_calendar_application_with/

.. _must support TLSv1.2: https://docs.microsoft.com/en-us/windows/win32/secauthn/protocols-in-tls-ssl--schannel-ssp-
