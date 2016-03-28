=======================
Enterprise Logging Apps
=======================


The **Log user and file sharing actions** app (``apps/admin_audit``) records the 
file sharing activity of your users, file tagging, and user logins and logouts.

.. figure:: images/logging-1.png
   :alt: Enterprise logging app on the Apps page.
   
Your logging level must be set to at least **Info, warnings, errors, and fatal 
issues** on your ownCloud admin page, or ``'loglevel' => 1`` in ``config.php``. 
 
View your logfiles on your admin page. Click the **Download logfile** button to 
dump the plain text log, or open the logfile directly in a text editor. The 
default location is ``owncloud/data/owncloud.log``. 
 
See :doc:`../configuration_server/logging_configuration` and 
:doc:`../enterprise_file_management/files_tagging` for more information on 
logging and tagging.
