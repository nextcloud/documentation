===============
Web server Tips
===============

PHP safe mode
-------------

PHP safe mode has to be turned off. It is deprecated and has been removed in 
newer PHP versions. Verify its status with :ref:`label-phpinfo`, and look for 
``safe_mode 
on/off``. If it is on, then add this line to ``php.ini`` to turn it off::

 safe_mode = Off


Enable the SPDY / http_v2 protocol
----------------------------------

If you want to enable SPDY for Apache please note the `Known Issues 
<https://code.google.com/p/mod-spdy/wiki/KnownIssues>`_ of this module to avoid 
problems after enabling it.

`<mod-spdy <https://code.google.com/p/mod-spdy/>`_

Apache Tuning
-------------

Maximum number of Apache processes
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

An Apache process uses around 12MB of RAM. Apache should be configured so that 
the maximum number of HTTPD processes times 12MB is lower than the amount of 
RAM. Otherwise the system begins to swap and the performance goes down. 

KeepAlive should be configured with sensible defaults
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

The KeepAlive directive enables persistent HTTP connections, allowing multiple 
requests to be sent over the same TCP connection. This reduces latency by as 
much as 50%. Especially in combination with the periodic checks of the sync
client the following settings are recommended:

::

	KeepAlive On
	KeepAliveTimeout 100
	MaxKeepAliveRequests 200

mod_gzip
^^^^^^^^

``mod_gzip`` should be used because it speeds up the transfer of data and 
helps to free server memory, and HTTP connections are closed faster.

MPM
^^^

Apache prefork has to be used. Don’t use threaded ``mpm`` with ``mod_php`` 
because PHP is currently not thread safe.

Hostname Lookups
^^^^^^^^^^^^^^^^

::

	# cat /etc/httpd/conf/httpd.conf
        ...
	HostnameLookups off

Log files
^^^^^^^^^

Log files should be switched off for maximum performance.

Comment out the ``CustomLog`` directive. Keep ``ErrorLog`` to be able to track 
down errors.

.. todo: loglevel?

.. commented out until somebody knows what to do with it
.. MaxKeepAliveRequests 4096
.. ^^^^^^^^^^^^^^^^^^^^^^^^^

.. ::

..	<IfModule prefork.c>
..		StartServers 100
..		MinSpareServers 100
..		MaxSpareServers 2000
..		ServerLimit 6000
..		MaxClients 6000
..		MaxRequestsPerChild 4000
..	</IfModule>

..	<Directory "/var/www/html">
..		Options Indexes SymLinksIfOwnerMatch AllowOverride All
..	</Directory>

