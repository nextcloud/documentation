.. _troubleshooting_groupware:

===============
Troubleshooting
===============

Calendar
--------

Missing Shared Calendars
^^^^^^^^^^^^^^^^^^^^^^^^

**Problem:**
    A user should have access to a shared calendar, but the calendar is not displayed in Nextcloud Calendar or other CalDAV clients (e.g., DAVx⁵ or Thunderbird).

**Affected Versions:**
    - Nextcloud Server 31.0.5 and below
    - Nextcloud Server 30.0.11 and below

**Possible Reason:**
    A bug in previous versions of Nextcloud Server could mistakenly add a calendar unshare instead of removing the share permission. For example, a user has read access through a group membership, and the owner grants permission to a single user to modify a calendar. When the modify permission is removed, an unshare record is incorrectly created.

**Troubleshooting Steps:**

1. **Check for Hidden Calendars:**
    It’s possible for a user to hide a calendar. Please check in Nextcloud Calendar if the missing calendar is listed in the "hidden" section. If it is, check the box in front of the calendar to enable it again.

2. **List Calendar Shares:**
    Run the command ``occ dav:list-calendar-shares <uid>`` to list all shares for a user. Look for lines with the Calendar URI/Calendar Name of the missing calendar and Permissions = Unshare. If such a line exists, but the user should have access, you have three options:

A. **Create a User Share and Remove It Again:**
    In most cases, sharing the calendar with the user again (as an individual/user share) will correct the state in the database.

B. **Remove All Calendar Unshares for a User:**
    Run ``occ dav:clear-calendar-unshares <uid>``.

C. **Delete Specific Unshares:**
    Some users may have many calendar unshares, so it might be easier to delete only the unwanted unshare. The ``Share Id`` refers to the ID of a row in the ``oc_dav_shares`` database table. Delete the row with the matching ID to remove the unshare.

**Why isn't there an automated migration to correct the problem?**
    Unsharing a calendar is a feature, and with the given information, we cannot determine if a calendar was unshared intentionally or as a result of the bug.

Contacts
--------

Unable to update contacts or events
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

If you get an error like:

``PATCH https://example.com/remote.php/dav HTTP/1.0 501 Not Implemented``

it is likely because of a misconfigured web server:

    Your web server is misconfigured and blocks the required DAV methods.
    Please refer to :ref:`trouble-webdav-label` for troubleshooting steps.
