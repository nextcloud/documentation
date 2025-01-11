=============
Dashboard app
=============

The Nextcloud Dashboard is your starting point of the day, giving users an overview of your upcoming appointments, urgent emails, chat messages, incoming tickets, latest tweets and much more! Users can add the widgets they like and change the background to their liking.

Enabling the dashboard app
--------------------------

The Dashboard App is shipped and enabled by default. If it is not enabled
simply go to your Nextcloud Apps page to enable it.

Configuring your Nextcloud for the activity app
-----------------------------------------------

The dashboard widgets are provided by apps and have a unique identifier. This can be used to customize the default layout of the dashboard as an administrator. The layout is stored as a comma-separated list of widget identifiers.

The layout of an existing user can be read with the following command::

  occ user:setting admin dashboard layout

The layout of the dashboard for a specific user can be set with the following command::

  occ user:setting admin dashboard layout "calendar,files,activity"

The default layout of the dashboard for all users can be set with the following command::

  occ config:app:set dashboard layout --value="files,activity,calendar"

Changing the default layout will not affect existing users that already have a custom layout stored.


It is possible to replace the default app, which is the dashboard app, with a custom app with the following command:

  occ config:app:set core defaultpage --value "/apps/files/extstoragemounts"

