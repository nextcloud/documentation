uploading big files > 512MB (as set by default)
===============================================
It's usefull to know limiting factors, that make it impossible to exceed the values given to the ownCloud-system:

Non ownCloud caused upload limits:
----------------------------------
* < 2GB on 32Bit OS-architecture
* < 2GB with IE6 - IE8
*< 2GB with Server Version 4.5 or older
* < 4GB with IE9 - IE10

Other recommendable preconditions:
----------------------------------

* make sure, that the latest version of php (at least 5.4.9) is installed

Enabling uploading big files
============================
Note: The order of the following steps is important! If you swap steps or substeps described below, the settings may fail.



