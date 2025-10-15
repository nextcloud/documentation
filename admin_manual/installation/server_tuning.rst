=============
Server tuning
=============

.. TODO: Add introductory paragraph
.. TODO: Sort according to (generalized) difficulty
.. TODO: Consider adding a category (or even table) with Impact vs Difficulty

Using cron to perform background jobs
-------------------------------------

See :doc:`../configuration_server/background_jobs_configuration` for a description and the
benefits.

Reducing system load
--------------------

High system load will slow down Nextcloud and may also lead to other unwanted
side effects. To reduce load, you should first identify the source of the problem.
Tools such as htop, iotop, `netdata <https://my-netdata.io>`_, or
`glances <https://nicolargo.github.io/glances/>`_
can help you identify the process or drive that slows down your system.
First, make sure that you have installed and assigned enough RAM. Minimize swap 
usage as much as possible, as excessive swapping can severely degrade performance.
If you run your database inside a VM, use a dedicated block device for database storage
rather than storing it inside the VM's disk image file, to reduce latency caused by 
multiple abstraction layers.

.. _caching:

Log Levels
----------

Verify the ``loglevel`` in your ``config.php`` file. The default log level is 
set to ``2`` (WARN) in new installations. Sometimes this parameter is inadvertently 
left at the DEBUG level (``0``) after troubleshooting. In some older installations, this 
parameter may also be something other than the default. Use ``0`` (DEBUG) 
when you have a problem to diagnose, and then reset your log level to a 
less-verbose level. DEBUG outputs a lot of information, and can affect your 
server performance.

Debug Mode
----------

Verify that ``debug`` is set to ``false`` in your ``config.php`` file. The default is ``false`` in new 
installations (or when not specified). While similar to the DEBUG logging level, this option
also disables various optimizations (to facilitate easier debugging) and generates additional 
debug output both at the browser level and server-side. It should not be enabled in production 
environments except during isolated troubleshooting.

Caching
-------

Caching improves performance by storing data, code, and other objects in memory. Memory caching is not enabled by default because it requires optional extensions (such as APCu) and/or system components (e.g., Redis). Although these add-ons are generally not challenging to install and activate—at least in single-server deployments—you must install them before enabling their use in Nextcloud. See :doc:../configuration_server/caching_configuration for guidance.

Compression
-----------

Enabling compression in your web server for JavaScript, CSS, and SVG files improves performance 
because less data is transferred to clients.

Replacing SQLite
----------------

SQLite is a suitable database for some use cases, but using MariaDB, MySQL, or PostgreSQL can be 
more beneficial with Nextcloud.

If you do not select a database at installation time, SQLite is used by default because it does not require 
any external components.

However, MySQL/MariaDB or PostgreSQL are generally recommended for Nextcloud because of the 
`performance limitations of SQLite with highly concurrent applications
<https://www.sqlite.org/whentouse.html>`_, like Nextcloud.

If your installation is already running on
SQLite, you can convert to MySQL or MariaDB using the steps provided in 
:doc:`../configuration_database/db_conversion`.

See the section :doc:`../configuration_database/linux_database_configuration` for instructions
on configuring Nextcloud for MySQL or MariaDB.

Tuning your database
--------------------

Databases are not plug-and-play. They benefit not only from basic configuration for compatibility 
with Nextcloud, but also from tuning within the environment in which they are deployed. This
tuning should be based on your hardware, storage, usage patterns, underlying operating system,
priorities, and other factors.

For more details and help tuning your database:

- `MariaDB – Optimization and Tuning <https://mariadb.com/docs/server/ha-and-performance/optimization-and-tuning/>`_
- `PostgreSQL – Resource Consumption <https://www.postgresql.org/docs/17/runtime-config-resource.html>`_
- `PostgreSQL – Tuning Your PostgreSQL Server <https://wiki.postgresql.org/wiki/Tuning_Your_PostgreSQL_Server>`_

Using Redis-based transactional file locking
--------------------------------------------

Transactional File Focking uses the database as the default backend. This
additional load on your database. See the section
:doc:`../configuration_files/files_locking_transactional` for instructions on
configuring Nextcloud to use Redis-based Transactional File Locking.

TLS / encryption app
--------------------

TLS (HTTPS) and file encryption/decryption can be offloaded to a processor's
AES-NI extension. This can both speed up these operations while lowering
processing overhead. This requires a processor with the `AES-NI instruction set
<https://wikipedia.org/wiki/AES_instruction_set>`_.

Here are some examples of how to check if your CPU/environment supports the
AES-NI extension:

* For each CPU core present: ``grep flags /proc/cpuinfo`` or as a summary for
  all cores: ``grep -m 1 '^flags' /proc/cpuinfo``. If the result contains
  ``aes``, the extension is present.

* For Intel processors, you can search the Intel ARK database to check if your CPU supports AES-NI. Use the `Intel Processor Feature Filter
  <https://ark.intel.com/MySearch.aspx?AESTech=true>`_, filtering by "AES New Instructions".

* For versions of openssl >= 1.0.1, AES-NI does not work via an engine and
  will not show up in the ``openssl engine`` command. It is active by default
  on supported hardware. You can check the OpenSSL version via ``openssl
  version -a``.

* If your processor supports AES-NI but it does not show up via ``grep`` or
  ``coreinfo``, it may be just be disabled in the BIOS. Check your BIOS settings.

* If your environment runs virtualized, check the virtualization vendor for
  support.

Enable HTTP/2 for faster loading
--------------------------------

HTTP/2 has `huge speed improvements <https://www.troyhunt.com/i-wanna-go-fast-https-massive-speed-advantage/>`_ over HTTP with multiple requests. Most `browsers already support HTTP/2 over TLS (HTTPS)`.

Tune PHP-FPM
------------

The default configuration of PHP-FPM is extremely conservative. You might notice
excessive load times on the web interface or even sync issues. Each simultaneous
request is handled by a separate PHP-FPM process, so even on a small installation you
should allow more processes to run in parallel to handle requests. 

`This link <https://spot13.com/pmcalculator/>`_ can help you calculate the optimal values for your system.

Enable PHP OPcache
------------------

The `OPcache <https://php.net/manual/en/intro.opcache.php>`_ improves the performance of PHP applications by caching precompiled bytecode.

Revalidation
^^^^^^^^^^^^

OPcache revalidation in PHP handles changes made to PHP application code stored on disk. Code changes occur whenever:

- Nextcloud or a Nextcloud app is upgraded 
- a configuration change is made (e.g. when ``config.php`` is modified) 

Nextcloud, as much as possible, handles cache revalidation internally when required. However, this is not foolproof. In a default PHP environment, revalidation is enabled, and cached scripts are checked for changes on disk every ``2`` seconds. In many environments, these default values are reasonable and may never need to be changed.

However, the revalidation frequency can be adjusted and may *potentially* enhance performance. We make no recommendations here about appropriate values for revalidation (other than the PHP defaults).

.. danger::
    Increasing the time between revalidations (or disabling it completely) means that changes to scripts, including ``config.php``, will take longer to become active (or may never do so if revalidation is disabled completely). Increasing the interval also raises the risk of transient server and application upgrade problems and prevents the proper toggling of maintenance mode.

.. warning::
    If you adjust these parameters, you are more likely to need to restart/reload your web server (``mod_php``) or PHP-FPM after making configuration changes or performing upgrades. If you forget to do so, you may experience unusual behavior due to a mismatch between what is on disk and what is in memory. These may appear to be bugs, but will go away as soon as you restart/reload ``mod_php`` / fpm.

To change the default from ``2`` and check for changes on disk at most every ``60`` seconds, add the following setting to your ``php.ini`` file:

.. code:: ini

  opcache.revalidate_freq = 60

Alternatively, you can disable the revalidation completely:

.. code:: ini

  opcache.validate_timestamps = 0

Any server or app upgrades, or changes to ``config.php``, will then require restarting PHP (or otherwise manually clearing the cache or invalidating this particular script).

.. warning::
   Please do not report bugs or odd behavior after upgrading Nextcloud or Nextcloud apps until after you've 
   restarted mod_php/fpm (to confirm the issue is not caused by local revalidation configuration).

Sizing
^^^^^^

If any OPcache size limit exceeds 90% of its allocated size, the admin panel will show a related warning and suggest changes.

For more details, check the `official PHP documentation <https://php.net/manual/en/opcache.configuration.php>`_. To monitor OPcache usage and clear individual or all cache entries, you can use `opcache-gui <https://github.com/amnuts/opcache-gui>`_.

Comments
^^^^^^^^

.. NOTE: This is more a troubleshooting item than a tuning one IMO

Nextcloud strictly requires code comments to be preserved in opcode, which is the default. If your PHP settings have changed, ensure the following is set in your ``php.ini``:

.. code:: ini

  opcache.save_comments = 1

JIT
^^^

PHP ships with a JIT compiler that can be enabled on x86 platforms to benefit any CPU-intensive apps you might be running. To enable a tracing JIT with all optimizations, add to your ``php.ini``:

.. code:: ini

  opcache.jit = 1255
  opcache.jit_buffer_size = 8M

.. note::

    Most Nextcloud instances use less than 2 MiB of the configured JIT buffer size, so 8 MiB is generally sufficient. 
    The overall OPcache usage, however, increases by a larger margin. The PHP parameter ``opcache.memory_consumption``
    might need to be raised in some cases. JIT buffer usage can be monitored with 
    `opcache-gui <https://github.com/amnuts/opcache-gui>`_ as well.

Previews
--------

It is possible to speed up preview generation using an
external microservice: `Imaginary <https://github.com/h2non/imaginary>`_.

.. warning::

   Imaginary is currently incompatible with server-side encryption. 
   See https://github.com/nextcloud/server/issues/34262

We strongly recommend running our custom Docker image, which is more up to date than the official image.
You can find the image at `<https://ghcr.io/nextcloud-releases/aio-imaginary>`_. When running it, map a port by adding `-p <port>:9000` to the `docker run` command (or Compose equivalent), e.g. 

.. code::

  docker run -d -p 9000:9000 --name nextcloud_imaginary --restart always ghcr.io/nextcloud-releases/aio-imaginary:latest

Ensure the service is only accessible from your internal servers. Then, configure
Nextcloud to use Imaginary by editing your ``config.php`` file:

.. code:: php

    'enabledPreviewProviders' => [
        'OC\Preview\TXT',
        'OC\Preview\MarkDown',
        'OC\Preview\OpenDocument',
        'OC\Preview\Krita',
        'OC\Preview\Imaginary',
    ],
    'preview_imaginary_url' => 'http://<url of imaginary>:<port>',

.. warning::

   Make sure to start Imaginary with the ``-return-size`` command line parameter. Otherwise, there will be a 
   minor performance impact. The flag requires a recent version of Imaginary (newer than v1.2.4).
   Also, ensure to add the capability ``SYS_NICE`` via ``--cap-add=sys_nice`` or (for Compose)
   ``cap_add: - SYS_NICE``, as it is required by Imaginary to generate HEIC previews.

.. note::

    For large instances, follow `Imaginary's scalability recommendation <https://github.com/h2non/imaginary#scalability>`_.

Settings
^^^^^^^^

To set the preview format for Imaginary (default is jpeg), add to your ``config.php``:

::

    'preview_format' => 'webp',

To set an API key for Imaginary:

::

    'preview_imaginary_key' => 'secret',

The default WebP quality setting for preview images is '80'. Change this with:

::

  occ config:app:set preview webp_quality --value="30"
