=============
Server tuning
=============

Using cron to perform background jobs
-------------------------------------

See :doc:`../configuration_server/background_jobs_configuration` for a description and the
benefits.

Reducing system load
--------------------

High system load will slow down Nextcloud and might also lead to other unwanted
side effects. To reduce load you should first identify the source of the problem.
Tools such as htop, iotop, `netdata <https://my-netdata.io>`_ or
`glances <https://nicolargo.github.io/glances/>`_
will help to identify the process or the drive that slows down your system. First
you should make sure that you installed/assigned enough RAM. Swap usage should be
prevented by all means. If you run your database inside a VM, you should not
store it inside a VM image file. Better put it on a dedicated block device to
reduce latency due to multiple abstraction layers.

.. _caching:

Log Levels
----------

Verify the ``loglevel`` in your ``config.php``. The default the log level is 
set to ``2`` (WARN) in new installations. Sometimes this parameter is inadvertently 
left at the DEBUG level (``0``) after a troubleshooting event. In some older installations this 
parameter may also be something other than the default. Use ``0`` (DEBUG) 
when you have a problem to diagnose, and then reset your log level to a 
less-verbose level. DEBUG outputs a lot of information, and can affect your 
server performance.

Debug Mode
----------

Verify that ``debug`` is ``false`` in your ``config.php``. The default is ``false`` in new 
installations (or when not specified). While similar to the DEBUG logging level, this option
also disables various optimizations (to facilitate easier debugging) and generates additional 
debug output both at the browser level and server-side. It should not be enabled in production 
environments outside of isolated troubleshooting situations.

Caching
-------

Caching improves performance by storing data, code, and other objects in memory.
Memory cache configuration for the Nextcloud server must be installed and configured.
See :doc:`../configuration_server/caching_configuration`.

Compression
-----------

Enabling compression in your web server for JavaScript, CSS, and SVG files improves the 
performance because fewer bytes need to be transferred to the clients.

Using MariaDB/MySQL instead of SQLite
-------------------------------------

MySQL or MariaDB are preferred because of the `performance limitations of
SQLite with highly concurrent applications
<https://www.sqlite.org/whentouse.html>`_, like Nextcloud.

See the section :doc:`../configuration_database/linux_database_configuration` for how to
configure Nextcloud for MySQL or MariaDB. If your installation is already running on
SQLite then it is possible to convert to MySQL or MariaDB using the steps provided
in :doc:`../configuration_database/db_conversion`.

For more details and help tuning your database, check `this article at MariaDB <https://mariadb.com/kb/en/optimization-and-tuning/>`_.

Using Redis-based transactional file locking
--------------------------------------------

File locking is enabled by default, using the database locking backend. This
places a significant load on your database. See the section
:doc:`../configuration_files/files_locking_transactional` for how to
configure Nextcloud to use Redis-based Transactional File Locking.

TLS / encryption app
--------------------

TLS (HTTPS) and file encryption/decryption can be offloaded to a processor's
AES-NI extension. This can both speed up these operations while lowering
processing overhead. This requires a processor with the `AES-NI instruction set
<https://wikipedia.org/wiki/AES_instruction_set>`_.

Here are some examples how to check if your CPU / environment supports the
AES-NI extension:

* For each CPU core present: ``grep flags /proc/cpuinfo`` or as a summary for
  all cores: ``grep -m 1 '^flags' /proc/cpuinfo`` If the result contains any
  ``aes``, the extension is present.

* Search eg. on the Intel web if the processor used supports the extension
  `Intel Processor Feature Filter
  <https://ark.intel.com/MySearch.aspx?AESTech=true>`_ You may set a filter by
  ``"AES New Instructions"`` to get a reduced result set.

* For versions of openssl >= 1.0.1, AES-NI does not work via an engine and
  will not show up in the ``openssl engine`` command. It is active by default
  on the supported hardware. You can check the openssl version via ``openssl
  version -a``

* If your processor supports AES-NI but it does not show up eg via grep or
  coreinfo, it is maybe disabled in the BIOS.

* If your environment runs virtualized, check the virtualization vendor for
  support.

Enable HTTP/2 for faster loading
--------------------------------

HTTP/2 has `huge speed improvements <https://www.troyhunt.com/i-wanna-go-fast-https-massive-speed-advantage/>`_ over HTTP with multiple request. Most `browsers already support HTTP/2 over TLS (HTTPS) <https://caniuse.com/#feat=http2>`_. Refer to your web server manual for guides on how to enable HTTP/2.

Tune PHP-FPM
------------

If you are using a default installation of PHP-FPM you might have noticed
excessive load times on the web interface or even sync issues. This is due
to the fact that each simultaneous request of an element is handled by a
separate PHP-FPM process. So even on a small installation you should allow
more processes to run in parallel to handle the requests.

`This link <https://spot13.com/pmcalculator/>`_ can help you calculate the good values for your system.

Enable PHP OPcache
------------------

The `OPcache <https://php.net/manual/en/intro.opcache.php>`_ improves the performance of PHP applications by caching precompiled bytecode.

Revalidation
^^^^^^^^^^^^

OPcache revalidation in PHP handles changes made to PHP application code stored on disk. Code changes occur whenever:

- Nextcloud or a Nextcloud app is upgraded 
- a configuration change is made (e.g. ``config.php`` is modified) 

Nextcloud, as much as possible, handles cache revalidation internally when required. However this is not foolproof. In a default PHP environment, revalidation is 
enabled and cached scripts are revalidated to ensure that changes (on disk) take effect every ``2`` seconds. In many environments, these default 
values are reasonable (and may never need to be changed). 

However, the revalidation frequency can be adjusted and may *potentially* enhance performance. We make no recommendations here about appropriate values for revalidation (other than the PHP defaults).

.. danger::
    Lengthening the time between revalidation (or disabling it completely) means that manual changes to scripts, including ``config.php``, will take longer before they become active (or will never do so, if
    revalidation is disabled completely). Lengthening also increases the likelihood of transient server and application upgrade problems. It also prevents the proper toggling of maintenance mode.
    
.. warning::
    If you adjust these parameters, you are more likely to need to restart/reload your web server (mod_php) or fpm after making configuration changes or performing upgrades. If you forget to do so, you 
    will likely experience unusual behavior due to a mismatch between what is on disk and is in memory. These may appear to be bugs, but will go away as soon as you restart/reload mod_php/fpm.

To change the default from ``2`` and check for changes on disk at most every ``60`` seconds, use the following setting:

.. code:: ini

  opcache.revalidate_freq = 60

To disable the revalidation completely:

.. code:: ini

  opcache.validate_timestamps = 0

Any Server/app upgrades or changes to ``config.php`` will then require restarting PHP (or otherwise manually clearing the cache or invalidating this particular script).

.. warning::
   To avoid false reports, if your environment isn't using the PHP default revalidation values, please do not report bugs/odd behavior after upgrading Nextcloud or Nextcloud apps until after you've 
   restarted mod_php/fpm (to confirm they are not simply caused by local revalidation configuration).

Sizing
^^^^^^

If any cache size limit is reached by more than 90%, the admin panel will show a related warning and suggested changes.

For more details check out the `official PHP documentation <https://php.net/manual/en/opcache.configuration.php>`_. To monitor OPcache usage, clear individual or all cache entries, `opcache-gui <https://github.com/amnuts/opcache-gui>`_ can be used.

Comments
^^^^^^^^

Nextcloud strictly requires code comments to be preserved in opcode, which is the default. But in case PHP settings are changed on your system, you may need set the following:

.. code:: ini

  opcache.save_comments = 1

JIT
^^^

PHP 8.0 and above ship with a JIT compiler that can be enabled on x86 platforms to benefit any CPU intensive apps you might be running. To enable a tracing JIT with all optimizations:

.. code:: ini

  opcache.jit = 1255
  opcache.jit_buffer_size = 8M

.. note::

    Single Nextcloud instances have shown to use less than 2 MiB of the configured JIT buffer size, so that 8 MiB is sufficient by a large margin. The overall OPcache usage however raises by a larger amount, so that ``opcache.memory_consumption`` might need to be raised in some cases. The Nextcloud admin panel will then show a related warning.
    JIT buffer usage can be monitored with `opcache-gui <https://github.com/amnuts/opcache-gui>`_ as well.

Previews
--------

It is possible to speed up preview generation using an
external microservice: `Imaginary <https://github.com/h2non/imaginary>`_.

.. warning::

   Imaginary is currently incompatible with server-side-encryption. 
   See https://github.com/nextcloud/server/issues/34262

We strongly recommend running our custom docker image that is more up to date than the official image.
You can find the image at `docker.io/nextcloud/aio-imaginary:latest`.

To do so, you will need to deploy the service and make sure that it is
not accessible from outside of your servers. Then you can configure
Nextcloud to use Imaginary by editing your `config.php`:

.. code:: php

    <?php
    'enabledPreviewProviders' => [
        'OC\Preview\MP3',
        'OC\Preview\TXT',
        'OC\Preview\MarkDown',
        'OC\Preview\OpenDocument',
        'OC\Preview\Krita',
        'OC\Preview\Imaginary',
    ],
    'preview_imaginary_url' => 'http://<url of imaginary>',

.. warning::

   Make sure to start Imaginary with the `-return-size` command line parameter. Otherwise, there will be a minor performance impact. The flag requires a recent version of Imaginary (newer than v1.2.4) and is by default added to the `aio-imaginary` container.
   Also make sure to add the capability `SYS_NICE` via `--cap-add=sys_nice` or `cap_add: - SYS_NICE` as it is required by imaginary to generate HEIC previews.

.. note::

    For large instance, you should follow `Imaginary's scalability recommendation <https://github.com/h2non/imaginary#scalability>`.

Settings
^^^^^^^^

If you want set the preview format for imaginary.  
You can change between jpeg and webp, the default is jpeg:

::

  <?php
    'preview_format' => 'webp',

If you want set a api key for imaginary':

::

  <?php
    'preview_imaginary_key' => 'secret',

Default WebP quality setting for preview images is '80'. Change this with:

::

  occ config:app:set preview webp_quality --value="30"
