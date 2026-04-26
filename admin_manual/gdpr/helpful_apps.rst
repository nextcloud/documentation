.. _gdpr_helpful_apps:

============
Helpful apps
============

Several apps are available from the Nextcloud App Store to help you meet specific GDPR obligations.

Imprint (Theming app)
---------------------

The **right to be informed** (GDPR Article 13/14) requires you to make your
privacy policy accessible to users. The built-in Theming app includes an
**Imprint** feature that lets you add links to your imprint and privacy policy
on the Nextcloud login screen and in the footer.

To configure it:

1. Go to **Administration Settings → Theming**.
2. Fill in the **Imprint URL** and **Privacy policy URL** fields.
3. Save. The links appear on the login page and in the web interface footer.

This ensures all users — including those accessing public share links — can
find your privacy policy without needing to be logged in.

Drop Account app
----------------

The `Drop Account app <https://apps.nextcloud.com/apps/drop_account>`_ allows
users to delete their own Nextcloud account directly from Personal Settings,
without needing to contact an administrator.

Install it from the Apps page or via occ::

  sudo -E -u www-data php occ app:install drop_account

Once installed, users see a **Delete account** button in
**Personal Settings → Personal Info**. They must confirm their password before the deletion proceeds.

.. warning::
   Account deletion via this app also removes all of the user's files. Make
   sure users are aware of this before they proceed. Consider adding a note in
   your privacy policy explaining what is and is not removed (see
   :doc:`subject_rights` for the full list of what ``user:delete`` does and
   does not clean up, including the comments tables which require manual
   cleanup).

Data Request app
----------------

The `Data Request app <https://apps.nextcloud.com/apps/data_request>`_ gives
users a self-service way to invoke their GDPR rights directly from their
Personal Settings, without needing to contact an administrator by email or
through an external channel.

Once installed, two buttons appear in every user's **Personal Settings → Personal Info** page:

* **Request data export** — sends an email to all administrators notifying
  them that the user is requesting a copy of their data.
* **Request account deletion** — sends an email to all administrators
  notifying them that the user wants their account deleted.

Both actions require the user to confirm their password and are rate-limited
to one request per action per hour.

The app is a notification bridge only. It does not perform the export or
deletion automatically — administrators must act on each request manually
using the steps described in :doc:`subject_rights`.

.. note::
   Administrators receive the notification at the email address configured
   for their account. Make sure all administrator accounts have a valid email
   address set, otherwise notifications will be silently dropped.

Install it from the Apps page or via occ::

  sudo -E -u www-data php occ app:install data_request

No further configuration is required after installation.

**Handling incoming requests**

When a request email arrives:

*For a data export request:*

1. Export the user's files via WebDAV, or ask the user to use the
   **Download your data** button in their Personal Settings.
2. Export contacts and calendars from the Contacts and Calendar apps, or
   use ``occ dav:export-calendar``.
3. Deliver the exported data to the user securely.

*For an account deletion request:*

1. Optionally transfer file ownership before deleting::

     sudo -E -u www-data php occ files:transfer-ownership <uid> <new-owner>

2. Delete the account::

     sudo -E -u www-data php occ user:delete <uid>

See :doc:`subject_rights` for full details on what each operation removes
and what data may remain after deletion.
