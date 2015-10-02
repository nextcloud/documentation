================================
Server Tuning & Performance Tips
================================

There are a number of options to tune the ownCloud installation and enable a 
higher level of performance. This chapter gives a few hands-on tips on 
configuring your database, and LAMP stack to improve performance. This chapter 
is community-maintained and unsupported; test these tips carefully before 
deploying them on production servers.

If you wish to add tips to this page, please put them in the relevant section. 
If there isn't an appropriate section then start a new one.

ownCloud Server Tuning
----------------------

Using cron to perform background jobs
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

See :doc:`background_jobs_configuration` for a description and the 
benefits.

Enable JavaScript and CSS Asset Management
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

See :doc:`js_css_asset_management_configuration` for a description and the 
benefits.

.. _caching:

Caching
-------

Caching improves performance by storing data, code, and other objects in memory. 
Memory cache configuration for the ownCloud server is no longer automatic in 
ownCloud 8.1 and up, but must be installed and configured. See      
:doc:`caching_configuration`.

Webserver Tips
--------------

Various hints for Apache and NginX can be found at the separate page
:doc:`performance_tuning/webserver_tips`.

Database Best Practice
----------------------

Various Database Best Practices can be found at the separate page
:doc:`performance_tuning/database_best_practice`.
         
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

.. windows is not supported on 8.x  
.. * On Windows you can run ``coreinfo`` from Sysinternals `Windows 
.. Sysinternals 
..  Download Coreinfo 
..  <https://technet.microsoft.com/en-us/sysinternals/cc835722.aspx>`_ which 
..  gives you details of the processor and extensions present. Note: you may 
.. have 
..  to run the command shell as administrator to get an output.
  
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
