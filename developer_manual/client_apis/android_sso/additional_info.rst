===============
Additional Info
===============

In case that you require some sso features that were introduced in a specific nextcloud files app version, you can run a simple version check using the following helper method:

.. code-block:: java
  int MIN_NEXTCLOUD_FILES_APP_VERSION_CODE = 30030052;

  if (VersionCheckHelper.verifyMinVersion(context, MIN_NEXTCLOUD_FILES_APP_VERSION_CODE)) {
    // Version requirement is satisfied! 
  } 

Nextcloud Conference 2018 Talk (5min)
-------------------------------------

.. youtube:: gnLOwmrJLUw
    width=600
    height=400
    someOtherParam=value

Video
-----

.. image:: https://user-images.githubusercontent.com/4489723/41563281-75cbc196-734f-11e8-8b22-7b906363e34a.gif
  :width: 400
  :alt: Android Single Sign On