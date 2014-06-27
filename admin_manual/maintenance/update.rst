Updating ownCloud
-----------------

.. _updatingowncloud:

The Updater app provides a more automated method of updating ownCloud.  To use the Updater app, it must be enabled in your ownCloud instance.  The Updater is enabled in your ownCloud instance by default when you install.  

To update ownCloud:

#. Make a backup of the ownCloud folder and the database.
  See :doc:`backup` for details.

  .. note:: To update ownCloud, the Updater app must be enabled in your ownCloud instance. The Updater app is enabled in your ownCloud instance by default when you install.  However, to verify that it is enabled, or to enable the Updater app, see enablingupdaterapp_.

#. Navigate to the 'Admin' page.

#. Click the 'Update' tab.

#. Refresh the page using Ctrl+F5.

If this procedure doesn't work (for example, ownCloud 5.0.10 doesn't show new any new version) you could try to perform
a full upgrade to update to the latest point release (see below).

Verifying the Updater App is Enabled
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
.. _verifyingupdaterapp:

However, to verify that the Updater is enabled in your ownCloud instance:

#. Select the "Admin" option from the "Personal Settings" dropdown menu.

.. figure::  images/oc_personal_settings_dropdown_admin.png

#. Scroll down the resulting web page.  If the Updater app appears in this window, the app is enabled.  If not, then you must enable it.  See enablingupdaterapp_.


Enabling the Updater App
^^^^^^^^^^^^^^^^^^^^^^^^
.. _enablingupdaterapp:

The Updater app is enabled in your ownCloud instance by default when you install.  However, it is possible that it was disabled at some point.   To enable the Updater app:

#. Click the "+ App" function in the Apps Selection Menu.

  The "Select an App" window opens.

  .. figure:: images/oc_select_an_app_window.png

  **Select an App window**

#. Scroll down the list of apps on the left side of the web page and select the Update app.

  .. figure:: images/oc_updater_select.png

  **Selecting the Updater app**

#. In the App View window, click "Enable." 

  .. figure:: images/oc_updater_enable.png

  **Enabling the Updater app**

  ownCloud enables the Updater app.


Upgrading ownCloud
------------------

To upgrade ownCloud:

#. Make sure that you ran the latest point release of the major ownCloud
   version, e.g. 5.0.14a in the 5.0 series. If not, update to that version first
   (see above).
#. Make a backup of the ownCloud folder and the database.
#. Download the latest version to the working directory::
    
    wget http://download.owncloud.org/community/owncloud-latest.tar.bz2

#. Deactivate all third party applications.
#. Delete everything from your ownCloud installation directory, except data and
   config.

#. Unpack the release tarball in the ownCloud directory (or copy the
   files thereto). Assuming that your installation directory is called 'owncloud' and that it's inside your working
   directory, you could execute this command::
   
    tar xjf owncloud-latest.tar.bz2

#. Set the permissions properly   
#. With the next page request the update procedures will run.
#. If you had 3rd party applications, check if they provide versions compatible
   with the new release. If so, install and enable them, update procedures will r