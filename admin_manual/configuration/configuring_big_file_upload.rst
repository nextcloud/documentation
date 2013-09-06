Uploading big files > 512MB (as set by default)
===============================================
It's usefull to know limiting factors, that make it impossible to exceed the values given to the ownCloud-system:

Not outnumberable upload limits:
--------------------------------
* < 2GB on 32Bit OS-architecture
* < 2GB with Server Version 4.5 or older
* < 2GB with IE6 - IE8
* < 4GB with IE9 - IE10

Other recommendable preconditions:
----------------------------------

* Make sure, that the latest version of php (at least 5.4.9) is installed
* Disable user quota. This means set the User quota of the account, you are currently logged in, to "unlimited". This is important, because you could not watch otherwise, whether the desired changes take effect.

Enabling uploading big files
============================
Note: The order of the following steps is important! If you swap steps or substeps described below, the settings may fail.

**Go to the admin section in the ownCloud-WebUI and do the following:**

* Under "File handling" set the Maximum upload size to the desired value (e.g. 16GB)
* Klick the "save"-Button

**Open the php.ini - file**

* Under Debian or Suse and their derivates this file lies at /etc/php5/apache2/php.ini
* On Windows, you can find this file within C:/Program Files (x86)/PHP/PHP.ini 

**Do the following:**

* Set the following three parameters inside th php.ini to the same value as choosen inside the admin-section one step before:
* upload_max_filesize = 16G   (e.g.)
* post_max_size = 16G   (e.g.)
* output_buffering = 16384

whereas the "output_buffering" has to be given in MegaBytes but as a plain figure (without size-units as 'M' or 'G')

These configurations have been prooven by test up to filesizes of 16 GigaBytes.
