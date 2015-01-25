Performance Tips
================

The performance of ownCloud, like any `LAMP application <http://wikipedia.org/wiki/LAMP_%28software_bundle%29>`_,
is dependent on all components of the stack.
Maximizing performance can be achieved by optimizing the operations and interactions
of the underlying network, hardware, operating systems, webservers, databases, and storage.

This guide cannot cover all possible configurations and will instead
cover tips that are specific to ownCloud or give the greatest benefit.

SSL / Encryption App
--------------------

SSL (HTTPS) and file encryption/decryption can be offloaded to a processor's AES-NI extension.
This can both speed up these operations while lowering processing overhead.
This requires a processor with the `AES-NI instruction set <http://wikipedia.org/wiki/AES_instruction_set>`_.

Here are some examples how to check if your CPU / environment supports the AES-NI extension:

* | For each CPU core present: ``grep flags /proc/cpuinfo``
  | or as a summary for all cores: ``grep -m 1 ^flags /proc/cpuinfo``
  | If the result contains any ``aes``, the extension is present.
  | 
  
* | On Windows you can run ``coreinfo`` from Sysinternals 
  | `Windows Sysinternals Download Coreinfo <https://technet.microsoft.com/en-us/sysinternals/cc835722.aspx>`_
  | which gives you details of the processor and extensions present.
  | Note: you may have to run the command shell as administrator to get an output.
  | 
  
* | Search eg. on the Intel web if the processor used supports the extension 
  | `Intel Processor Feature Filter <http://ark.intel.com/MySearch.aspx?AESTech=true>`_
  | You may set a filter by ``"AES New Instructions"`` to get a reduced result set.
  | 
  
* | For versions of openssl >= 1.0.1, AES-NI does not work via an engine and will not show up in the ``openssl engine`` command. It is active by default on the supported hardware.
  | You can check the openssl version via ``openssl version -a``
  | 
  
* | If your processor supports AES-NI but it does not show up eg via grep or coreinfo, it is maybe disabled in the BIOS.
  | 
  
* | If your environment runs virtualized, check the virtualization vendor for support.
  | 
  
OPcache Extension
-----------------

OPcache improves PHP performance by storing precompiled script bytecode in shared memory,
thereby removing the need for PHP to load and parse scripts on each request.
This extension is bundled with PHP 5.5.0 and later, and is available in PECL for PHP versions 5.2, 5.3, and 5.4.

Object Caching
--------------

ownCloud is written to take advantage of object caching.
Object caching can be done locally with the APCu extension,
or for distributed PHP environments using Memcached.
Memcached servers must be specified in the "memcached_servers" array in ownCloud's config file.

`Serving static files via web server <serving_static_files_configuration.rst>`_
-----------------------------------

`Using cron to perform background jobs <background_jobs_configuration.rst#cron>`_
-------------------------------------

`Using MySQL instead of SQLite <database_configuration.rst#configuring-a-mysql-or-mariadb-database>`_
-----------------------------

MySQL or MariaDB should be preferred because of the `performance limitations of SQLite with highly concurrent applications <http://www.sqlite.org/whentouse.html>`_, like ownCloud.
