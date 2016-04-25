======================
ownCloud Server Tuning
======================

Using cron to perform background jobs
-------------------------------------

See :doc:`background_jobs_configuration` for a description and the 
benefits.

Enable JavaScript and CSS Asset Management
------------------------------------------

See :doc:`js_css_asset_management_configuration` for a description and the 
benefits.

.. _caching:

Caching
-------

Caching improves performance by storing data, code, and other objects in memory. 
Memory cache configuration for the ownCloud server is no longer automatic in 
ownCloud 8.1 and up, but must be installed and configured. See      
:doc:`caching_configuration`.

Using MariaDB/MySQL instead of SQLite
-------------------------------------

MySQL or MariaDB are preferred because of the `performance limitations of 
SQLite with highly concurrent applications 
<http://www.sqlite.org/whentouse.html>`_, like ownCloud.

See the section :doc:`../configuration_database/linux_database_configuration` for how to
configure ownCloud for MySQL or MariaDB. If your installation is already running on
SQLite then it is possible to convert to MySQL or MariaDB using the steps provided
in :doc:`../configuration_database/db_conversion`.

Using Redis-based Transactional File Locking
--------------------------------------------

File locking is enabled by default, using the database locking backend. This 
places a significant load on your database. See the section
:doc:`../configuration_files/files_locking_transactional` for how to
configure ownCloud to use Redis-based Transactional File Locking.

SSL / Encryption App
--------------------

SSL (HTTPS) and file encryption/decryption can be offloaded to a processor's 
AES-NI extension. This can both speed up these operations while lowering 
processing overhead. This requires a processor with the `AES-NI instruction set 
<http://wikipedia.org/wiki/AES_instruction_set>`_.

Here are some examples how to check if your CPU / environment supports the 
AES-NI extension:

* For each CPU core present: ``grep flags /proc/cpuinfo`` or as a summary for 
  all cores: ``grep -m 1 ^flags /proc/cpuinfo`` If the result contains any 
  ``aes``, the extension is present.   

* Search eg. on the Intel web if the processor used supports the extension 
  `Intel Processor Feature Filter 
  <http://ark.intel.com/MySearch.aspx?AESTech=true>`_ You may set a filter by 
  ``"AES New Instructions"`` to get a reduced result set.
   
* For versions of openssl >= 1.0.1, AES-NI does not work via an engine and 
  will not show up in the ``openssl engine`` command. It is active by default 
  on the supported hardware. You can check the openssl version via ``openssl 
  version -a``
    
* If your processor supports AES-NI but it does not show up eg via grep or 
  coreinfo, it is maybe disabled in the BIOS.
  
* If your environment runs virtualized, check the virtualization vendor for 
  support.