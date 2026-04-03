=============================
Synchronizing with Windows 10
=============================

Calendar
--------

1. In your browser, navigate to the Nextcloud Calendar app. Under "Settings & import", copy the "iOS/macOS CalDAV Address" into your clipboard.

2. Launch the Windows 10 Calendar app. Then, click the settings icon (gear icon) and select "Manage accounts".

3. Click "Add account" and choose "iCloud".

4. Enter an email, username and password. None of this information has to be valid-it will all be changed in the upcoming steps.

5. Click "Done". A message should appear indicating the settings were saved successfully.

6. In the "Manage Accounts" menu, click on  the iCloud account created in previous steps, and select "Change settings". Then, click on "Change mailbox sync settings".

7. Scroll to the bottom of the dialog box, select "Advanced mailbox settings".  Paste your CalDAV URL in the field labelled "Calendar server (CalDAV)".

8. Click "Done". Enter your Nextcloud username and password in the appropriate fields, and change the account name to whatever you prefer (e. g. "Nextcloud Calendar"). Click "Save".



After following all these steps, your Nextcloud calendar should synchronize. If not, check your username and password. Otherwise, repeat these steps.

**NOTE: You will not be able to synchronize your calendar if you have two-factor authentication enabled. Follow the steps below to get an app password that can be used with the Calendar client app:**

1. Log into Nextcloud. Click on your user icon, then click on "settings".

2. Click on "Security", then locate a button labeled "Generate app password". Next to this button, enter "Windows 10 Calendar app". Then, click the button and copy and paste the password. Use this password instead of your Nextcloud password for Step 8.

Special thanks to this Reddit user for their post:
https://www.reddit.com/r/Nextcloud/comments/5rcypb/using_the_windows_10_calendar_application_with/


Contacts
--------

1. Repeat steps 1 - 7 from the Calendar instructions. If you already have setup the Calendar synchronization, you can use the same account for this.

2. In the "Advanced mailbox settings". Paste your CalDAV URL in the field labelled "Contact server (CardDAV)".

3. Replace the path "principals" within the URL with "addressbooks"

4. Click "Done". Enter your Nextcloud username and password in the appropriate fields, and change the account name to whatever you prefer (e. g. "Nextcloud"). Click "Save".
