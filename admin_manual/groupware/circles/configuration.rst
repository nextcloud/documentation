=============
Configuration
=============




Async process
^^^^^^^^^^^^^

.. note::
 In this paragraph, we will call `Process` the execution of a request from the front-end to the back-end
 until the back-end returns a result to the front-end and close the request.
 We will call `Thread` a process initialized by a `Process` to run a background task.

When managing a Circle some operation can be too heavy to be handle by the `Process` and takes multiple
seconds, affecting the User Experience with an unresponsive interface during this delay.

As an example, when adding a new Member to a Circle, the back-end will also:
 - manage new memberships rights about this new Member,
 - if the member is a contact or a mail address, retrieve a list of all shared file to the current Circle
   to generate a mail and send it.

Unfortunately, PHP does not allow to create multiple `Thread`.
The solution we are providing is done by:
 - opening a local request to Nextcloud, this will generate a `Thread` at the level of the httpd,
 - manually closing the local request, freeing the `Process` while keeping the `Thread` running.

.. note:: To keep the code clean and the whole procedure consistent between a request from the front-end
 and a command run using the ``occ`` command. We create a new request instead of manually closing the initial
 request from the front-end.


By default, the local request is done on the address of Nextcloud configured in `config/config.php`:
`overwrite.cli.url`. While this is working fine on most of the setup of Nextcloud, some issues can be found
when using a Proxy.

[TODO] WRITE DOCUMENTATION ON HOW TO CONFIGURE FORCE_NC_BASE AND TEST IT LOCALLY USING THE OCC COMMAND


Types of Circles
^^^^^^^^^^^^^^^^

As we already saw in :doc:`app_overview`, different types of members can be added to a Circle. You can
enable/disable those types from the `Admin Settings Page`.

[TODO] SCREENSHOT OF THE ADMIN SETTINGS PAGE

If disabled, an Admin can re-enable types for a specific Circle from the `Configuration Panel` of the Circle.

[TODO] SCREENSHOT OF THE CONFIGURATION PANEL





Size of Circles
^^^^^^^^^^^^^^^

You can set a global limit to the size of a Circle from the `Admin Settings Page`

[TODO] SCREENSHOT OF THE ADMIN SETTINGS PAGE

This limit can be bypassed by an admin for a specific Circle using the `Configuration Panel` of the Circle.

[TODO] SCREENSHOT OF THE CONFIGURATION PANEL



Sources of members
^^^^^^^^^^^^^^^^^^

As we already saw in :doc:`app_overview`, different sources of members can be added to a Circle. You can
enable/disable those sources from the `Admin Settings Page`.

[TODO] SCREENSHOT OF THE ADMIN SETTINGS PAGE

If disabled, an Admin can re-enable types for a specific Circle from the `Configuration Panel` of the Circle.

[TODO] SCREENSHOT OF THE CONFIGURATION PANEL
