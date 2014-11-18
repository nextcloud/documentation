Uploading big files > 512MB (as set by default)
===============================================
It's useful to know limiting factors that make it impossible to exceed the 
values given by the ownCloud-system:

Not outnumberable upload limits:
--------------------------------
* < 2GB on 32Bit OS-architecture
* < 2GB with Server Version 4.5 or older
* < 2GB with IE6 - IE8
* < 4GB with IE9 - IE10

Other recommendable preconditions:
----------------------------------

* Make sure that the latest version of PHP (at least 5.4.9) is installed
* Disable user quota. This means: set the user quota of the account, you are 
  currently logged in, to "unlimited".

This is important, because you possibly could not watch otherwise whether the 
desired changes take effect.

Enabling uploading big files
----------------------------

**Configuring your webserver**

ownCloud comes with a .htaccess - file which propagates all config to your 
webserver. To adapt those settings go to the ownCloud - Folder on your server 
and set the following two parameters inside the .htaccess file:

* ``upload_max_filesize = 16G``   (e.g., to stay consistent with the example 
  value above)
* ``post_max_size = 16G``   (e.g., to stay consistent with the example value 
  above)

If you don't want to use the shipped .htaccess - file, outcomment those options 
there and edit them in your global php.ini file:

You can easily learn the loaded configuration file by saving ``<?php phpinfo(); 
?>`` code piece into a php file and calling it with your browser. Then look for 
the **Loaded Configuration File** value.

Alternatively:

* Under Debian or SUSE and their derivatives this file lies at 
  /etc/php5/apache2/php.ini
* On Windows, you can find this file within C:/Program Files (x86)/PHP/PHP.ini

Set the following two parameters inside the php.ini to the same value as chosen 
inside the admin-section one step before:

* ``upload_max_filesize = 16G``   (e.g., to stay consistent with the example 
  value above)
* ``post_max_size = 16G``   (e.g., to stay consistent with the example value 
  above)

**Output Buffering** must be turned off in ``.htaccess`` or ``php.ini``, or PHP 
will return memory-related errors.

* ``output_buffering = 0``

**These client configurations have been proven by testing maximum file sizes of 16 GB:**

* Linux 32 Bit: Ubuntu, Firefox => 16GB
* Windows 8  64 Bit: Google Chrome => 8GB

**Note:**
You will need a minimum of 16GB (e.g, to stay consistent with the example value 
above), in your upload_tmp_dir. Normally this points to /tmp. If your /tmp has 
not enough space, you can change the value of upload_tmp_dir in your php.ini
