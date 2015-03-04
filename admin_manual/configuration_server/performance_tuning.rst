=============
Server Tuning
=============

.. toctree::
    :maxdepth: 2
    :hidden:

There are a number of options to tune the ownCloud installation and enable a 
high level of performance. The database, for example, needs indexes in the most 
active tables. The number of live Apache connections needs to be turned up to 
1000 or more, and the number of allowed MySQL connections also has to be 
increased to the same. Turning on the Alternative PHP Cache (APC) will also 
increase performance on the app servers, and there are likely a number of 
environment and policy specific configurations needed as well in any given 
deployment.

This chapter gives a few hands-on tips on how to achieve this.


General Linux tuning
====================

System configuration overview
-----------------------------

.. code-block:: console

	# cat /etc/sysctl.conf
        ...
	net.core.somaxconn = 4096
	net.ipv4.tcp_max_syn_backlog = 2048
        ...
	# ulimit -nH 4096

Make sure that your ``/tmp`` is in ramdisk which improves session handling
performance. To do so, add the following to ``/etc/fstab``::

	none /tmp tmpfs,size=6g defaults

Make surethe APC byte code cache is installed:

.. code-block:: console

	# yum install php-pecl-apc

mysql temp in ramdisk

Tuning System Parameters
------------------------

Configuration for more concurrent requests.

.. code-block:: bash

	echo "2048 64512" > /proc/sys/net/ipv4/ip_local_port_range
	echo "1" > /proc/sys/net/ipv4/tcp_tw_recycle
	echo "1" > /proc/sys/net/ipv4/tcp_tw_reuse
	echo "10" > /proc/sys/net/ipv4/tcp_fin_timeout

	echo "65536" > /proc/sys/net/core/somaxconn
	echo "65536" > /proc/sys/net/ipv4/tcp_max_syn_backlog
	echo "262144" > /proc/sys/net/netfilter/nf_conntrack_max

Check if the values have been set accordingly:

.. code-block:: console

	# cat /proc/sys/net/ipv4/ip_local_port_range
        2048 64512
	# cat /proc/sys/net/ipv4/tcp_tw_recycle
        1
	# cat /proc/sys/net/ipv4/tcp_tw_reuse
        1
	# cat /proc/sys/net/ipv4/tcp_fin_timeout
        10
	# cat /proc/sys/net/core/somaxconn
        65536
	# cat /proc/sys/net/ipv4/tcp_max_syn_backlog
        65536
	# cat /proc/sys/net/netfilter/nf_conntrack_max
        262144

Next, persist the settings across reboots by adding them into ``/etc/sysctl.conf``::

	net.ipv4.ip_local_port_range = 2048 64512
	net.ipv4.tcp_tw_recycle = 1
	net.ipv4.tcp_tw_reuse = 1
	net.ipv4.tcp_fin_timeout = 10

	net.core.somaxconn = 65536
	net.ipv4.tcp_max_syn_backlog = 65536
	net.netfilter.nf_conntrack_max = 262144

Tuning
------

Add RAM disk to fstab::

	- none /var/www/html tmpfs defaults,size=6g

Move PHP Code into RAM Disk:

.. code-block:: console

	# mv /var/www/html /var/www/html_fs


Copy ownCloud installation to RAM Disk and symlink storage to ownCloud ``data``
directory.

.. note:: ram disks are not reboot-safe. You need to establish a way to persist them,
          for instance by using ``cp`` or ``rsync`` to transfer them from a location
          on the hard disk to the ram disk before apache starts.


Apache Tuning
=============

Maximum number Apache processes
-------------------------------
An apache process is using around 12MB of RAM. Apache should be configured that the maximum number of httpd processes
time 12MB is lower than the amount of RAM. Otherwise the system begins to swap and the performance goes down. In this
case the maximum number is set to 6000


KeepAlive should be configured with sensible defaults
-----------------------------------------------------

.. code-block:: apache

	KeepAlive On
	KeepAliveTimeout 2
	MaxKeepAliveRequests 10


mod_gzip
--------
mod_gzip should be used because it speeds up the transfer of data and helps to
free server memory and http connections are closed faster.

.. Commented out because oC does not support mod_deflate
.. mod_deflate
.. -----------
.. mod_deflate should be used because it speeds up the transfer of data and helps
.. to free server memory and http connections are closed faster


php safe mode
-------------
php safe mode has to be turned off. It is deprecated and will be removed in
newer PHP versions.

MPM
~~~
Apache prefork has to be used. Don’t use threaded mpm with mod_php because php
is currently not thread safe.

Hostname Lookups
----------------

.. code-block:: bash

	# cat /etc/httpd/conf/httpd.conf
        ...
	HostnameLookups off
        ...


Log files
---------
Log files should be switched off for maximum performance.

Comment out the `CustomLog`` directive. Keep ``ErrorLog`` to be able to track down errors.

.. todo: loglevel?

MaxKeepAliveRequests 4096
-------------------------

.. code-block:: apache

	<IfModule prefork.c>
		StartServers 100
		MinSpareServers 100
		MaxSpareServers 2000
		ServerLimit 6000
		MaxClients 6000
		MaxRequestsPerChild 4000
	</IfModule>

	<Directory "/var/www/html">
		Options Indexes SymLinksIfOwnerMatch AllowOverride All
	</Directory>


Database Best Practice
======================

Currently ownCloud supports the following relational database management systems:

- mysql
- mariadb
- postgresql
- oracle
- mssql

We are using the `doctrine database abstraction layer`_ and schema evolution with a `MDB2 Schema`_ based table description in XML.

.. _doctrine database abstraction layer: http://www.doctrine-project.org/projects/dbal.html
.. _MDB2 Schema: https://raw2.github.com/pear/MDB2_Schema/master/docs/xml_schema_documentation.html

The default indexes are chosen to support every day usage. Additional indexes might further improve the performance.

MySQL / MariaDB
---------------

Usage scenario
~~~~~~~~~~~~~~
Is the recommended setup. Well tested.

Additional Indexes
~~~~~~~~~~~~~~~~~~

Index on uid in oc_group_user:

.. code-block:: sql

	create index oc_group_user_uid on oc_group_user(uid);

Index on oc_share:

.. code-block:: sql

	create index oc_share_file_target on oc_share(file_target);

Index on oc_filecache:

.. code-block:: sql

	create index oc_filepath on oc_filecache(storage,size);

Index on oc_files_versions:

.. code-block:: sql

	create index oc_files_versions_user  on oc_files_versions(user);

Index on oc_files_trashsize:

.. code-block:: sql

	create index oc_files_trashsize_user  on oc_files_trashsize(user);

Progress of adding them to the default code is tracked in https://github.com/owncloud/core/issues/7474.


Other performance improvements
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Mysql: compare https://tools.percona.com/wizard to your current settings
MariaDB: https://mariadb.com/kb/en/optimization-and-tuning/


Postgresql
----------

Usage scenario
~~~~~~~~~~~~~~
Alternative to mysql. Used in production by a few core developers.

Migration
~~~~~~~~~
Requires at least Postgresql 9.0

Additional Indexes
~~~~~~~~~~~~~~~~~~
The ones from mysql should work just fine. Progress of adding them to the default code is tracked in https://github.com/owncloud/core/issues/7474.

Other performance improvements
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
See http://wiki.postgresql.org/wiki/Performance_Optimization

Additional Indexes
~~~~~~~~~~~~~~~~~~
The ones from mysql should work just fine. Progress of adding them to the default code is 
tracked in https://github.com/owncloud/core/issues/7474.

Oracle Database
---------------

Usage scenario
~~~~~~~~~~~~~~
Existing enterprise installations. Only core apps are supported and tested. Not recommended because it involves compiling the oci8

Additional Indexes
~~~~~~~~~~~~~~~~~~
The ones from mysql should work just fine. Progress of adding them to the default code is tracked in https://github.com/owncloud/core/issues/7474.

Other performance improvements
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
http://de.slideshare.net/cjorcl/best-practices-php-and-the-oracle-database and ask your DBA.

Problems
~~~~~~~~
When ORA-56600 occurs (Oracle Bug 8467564) set this php.ini setting:
`oci8.statement_cache_size=1000`, see `oracle forum discussion`_

.. _oracle forum discussion: https://community.oracle.com/message/3468020#3468020


Microsoft SQL Server
--------------------

Usage scenario
~~~~~~~~~~~~~~
Only core apps are supported. **Not** even tested by jenkins.

Additional Indexes
~~~~~~~~~~~~~~~~~~

The ones from mysql should work just fine. Progress of adding them to the default code is tracked in https://github.com/owncloud/core/issues/7474.

Other performance improvements
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

http://www.mssqltips.com/sql-server-tip-category/9/performance-tuning/



