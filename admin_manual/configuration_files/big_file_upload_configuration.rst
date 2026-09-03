.. _uploading_big_files:

=====================
Uploading large files
=====================

Understanding upload limits
---------------------------

Nextcloud does not impose a single default maximum file size for all uploads.
The effective limit depends on the client, the upload method, and every
component in the end-to-end request path, including:

* the web server;
* any reverse proxy, load balancer, or content delivery network;
* PHP configuration and timeouts;
* the operating system and filesystem;
* the primary or External Storage backend;
* available temporary and staging space; and
* the user's available quota.

A direct upload sends the file in one HTTP request. Request-size limits must
therefore permit the complete file.

A chunked upload divides the file into multiple requests. Request-size limits
normally apply to each individual chunk rather than directly to the complete
file. Storage, quota, staging-space, and finalization-time constraints still
apply to the complete file.

The relevant limits must be configured consistently, or at least compatibly,
across every component in the upload path. The lowest applicable limit
determines whether an upload can complete.

.. note:: Official Nextcloud clients normally use chunked uploading for 
   larger files. This reduces the likelihood of encountering per-request size
   limits, but it does not eliminate all possible constraints.

   The configured chunk size can itself still exceed a restrictive request-size
   limit imposed by a proxy, content delivery network, or other intermediary.
   See :ref:`files_configure_max_chunk_size` and the `client documentation
   <https://docs.nextcloud.com/server/latest/user_manual/en/desktop/configfile.html#general-section>`_
   for relevant options.

Upload paths at a glance
------------------------

The following table summarizes the main upload scenarios from an
administrator's perspective. Exact behavior depends on the storage backend and
the capabilities it provides.

.. list-table::
   :header-rows: 1
   :widths: 20 24 28 28

   * - Scenario
     - Request-size limits
     - Storage behavior
     - Main administrative concerns

   * - Direct upload
     - Apply to the complete file because it is sent in one request.
     - May use a temporary ``.part`` file or write directly through the
       destination backend.
     - Maximum request size, request timeout, temporary capacity, and
       destination-backend behavior.

   * - Chunked upload
     - Apply to each individual chunk rather than directly to the complete
       file.
     - Chunks may be staged in the user's upload storage or sent through a
       storage-native multipart mechanism.
     - Chunk size, staging capacity, quota, and the time required to finalize
       the upload.

   * - Upload to External Storage
     - Depend on whether the client uses a direct or chunked upload.
     - May stream to the backend or be staged before a final cross-storage
       transfer.
     - Capacity may be required in both the staging storage and the external
       backend. Finalization may generate significant network and storage
       traffic.

   * - Upload to primary object storage
     - Depend on the client upload method and each component in the request
       path.
     - Compatible S3 primary storage can receive chunked uploads through the
       S3 multipart-upload API.
     - Distributed-cache availability, multipart support, request timeouts,
       and object-store connectivity.

Client-side chunking should not be confused with a storage provider's
multipart-upload API. A chunked WebDAV upload may be stored as temporary
files, passed to a storage-native chunked-write implementation, or mapped to a
provider-specific multipart upload.

Capacity and timeout planning
-----------------------------

Before increasing upload-size limits, identify every component and storage
location involved in the upload path.

Depending on the client, upload method, and storage backend, capacity may be
required in:

* the web server's request-body temporary directory;
* PHP's ``upload_tmp_dir``;
* Nextcloud's ``tempdirectory``;
* a temporary ``.part`` file;
* the user's ``uploads`` directory;
* the user's primary or home storage;
* an External Storage backend; or
* provider-side multipart-upload storage.

These locations serve different purposes and are not interchangeable. Not
every upload uses every location.

When planning capacity, account for multiple simultaneous uploads. For
example, a chunked upload to External Storage can temporarily require capacity
in both the user's upload storage and the external destination.

Request-size limits generally apply to one HTTP request:

* For a direct upload, one request may contain the complete file.
* For a chunked upload, one request normally contains one chunk.

Timeouts can also affect the final WebDAV ``MOVE`` request. During that
request, Nextcloud may need to read all staged chunks and write the complete
file to the destination. This is particularly important when the destination
is on a different storage instance.

User quota must be sufficient for the completed file. Clients that supply the
``OC-Total-Length`` header allow Nextcloud to check available quota while the
chunks are being uploaded rather than waiting until finalization.

Configuring the upload path
---------------------------

Every web server, reverse proxy, content delivery network, load balancer, PHP
runtime, and storage service in the request path must accept the required
request size and duration.

Reverse proxies and web servers
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Web-server and reverse-proxy limits apply to each HTTP request. Consult the
documentation for every intermediary in the upload path.

Settings that may need adjustment include:

* maximum request-body size;
* request-body buffering and temporary-file location;
* client request-body timeout;
* upstream or FastCGI response timeout; and
* general connection or request timeout.

A timeout while finalizing a chunked upload often appears during the WebDAV
``MOVE`` request even though all individual chunks uploaded successfully.

Apache
^^^^^^

Relevant Apache directives include:

* `LimitRequestBody
  <https://httpd.apache.org/docs/current/en/mod/core.html#limitrequestbody>`_
* `SSLRenegBufferSize
  <https://httpd.apache.org/docs/current/mod/mod_ssl.html#sslrenegbuffersize>`_
* `Timeout
  <https://httpd.apache.org/docs/current/mod/core.html#timeout>`_

In Apache HTTP Server 2.4.53 and earlier, ``LimitRequestBody`` defaulted to
unlimited. Newer releases default to 1 GiB. This can limit direct uploads and
can also limit individual chunk requests.

Set ``LimitRequestBody`` to a value appropriate for your deployment. Set it to
``0`` only if you intentionally want to disable this limit.

The `mod_reqtimeout
<https://httpd.apache.org/docs/current/mod/mod_reqtimeout.html>`_ module can
also stop large or slow uploads from completing. If uploads fail while this
module is enabled, adjust the configured ``RequestReadTimeout`` values as
appropriate.

Apache with mod_fcgid
^^^^^^^^^^^^^^^^^^^^^

Relevant ``mod_fcgid`` directives include:

* `FcgidMaxRequestInMem
  <https://httpd.apache.org/mod_fcgid/mod/mod_fcgid.html#fcgidmaxrequestinmem>`_
* `FcgidMaxRequestLen
  <https://httpd.apache.org/mod_fcgid/mod/mod_fcgid.html#fcgidmaxrequestlen>`_

.. note:: Older ``mod_fcgid`` releases were affected by `Apache bug #51747
   <https://bz.apache.org/bugzilla/show_bug.cgi?id=51747>`_, which could cause
   segmentation faults unless ``FcgidMaxRequestInMem`` was increased
   significantly.

   Check whether the Apache and ``mod_fcgid`` versions in your deployment are
   affected before applying this historical workaround.

Apache with mod_proxy_fcgi
^^^^^^^^^^^^^^^^^^^^^^^^^^

The relevant timeout directive is:

* `ProxyTimeout
  <https://httpd.apache.org/docs/current/mod/mod_proxy.html#proxytimeout>`_

Apache and chunked HTTP request bodies
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

HTTP request-body chunking through ``Transfer-Encoding: chunked`` is distinct
from the Nextcloud chunked-upload protocol.

Some WebDAV clients use HTTP requests with ``Transfer-Encoding: chunked``.
When Apache forwards these requests to FastCGI or PHP-FPM, it must pass the
request body to Nextcloud correctly.

Nextcloud's supplied ``.htaccess`` includes a compatibility rule that asks
Apache to buffer these request bodies and forward them with a
``Content-Length`` header. Ensure that the supplied ``.htaccess`` rules are
active when using Apache.

nginx
^^^^^

Relevant nginx directives include:

* `client_max_body_size
  <https://nginx.org/en/docs/http/ngx_http_core_module.html#client_max_body_size>`_
* `client_body_buffer_size
  <https://nginx.org/en/docs/http/ngx_http_core_module.html#client_body_buffer_size>`_
* `client_body_temp_path
  <https://nginx.org/en/docs/http/ngx_http_core_module.html#client_body_temp_path>`_
* `client_body_timeout
  <https://nginx.org/en/docs/http/ngx_http_core_module.html#client_body_timeout>`_
* `fastcgi_read_timeout
  <https://nginx.org/en/docs/http/ngx_http_fastcgi_module.html#fastcgi_read_timeout>`_
* `proxy_read_timeout
  <https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_read_timeout>`_

Use ``fastcgi_read_timeout`` when nginx communicates with PHP through
FastCGI. Use ``proxy_read_timeout`` when nginx proxies requests to another
HTTP server.

Make sure that ``client_body_temp_path`` points to storage with sufficient
space and I/O capacity for the largest request nginx may buffer. Avoid sharing
this storage with unrelated I/O-intensive workloads.

PHP
~~~

Nextcloud includes a ``.user.ini`` file containing required PHP settings. PHP
caches this file for a period controlled by ``user_ini.cache_ttl``, which
defaults to 300 seconds, so changes may not take effect immediately.

For PHP-FPM or CGI deployments, configure the applicable ``php.ini`` or
``.user.ini`` file using PHP INI syntax::

  upload_max_filesize = 16G
  post_max_size = 16G

``post_max_size`` should be at least as large as ``upload_max_filesize``.

These settings primarily affect uploads processed through PHP's form-upload
mechanism. Raw WebDAV ``PUT`` requests and chunked WebDAV uploads are not
necessarily restricted by these settings in the same way, but remain subject
to web-server limits and timeout settings.

If PHP needs a dedicated request-upload temporary directory, configure it in
``php.ini``::

  upload_tmp_dir = /var/big_temp_file/

Ensure that the directory exists, is writable by the PHP process, and has
sufficient free space.

Output buffering must be disabled in ``.htaccess``, ``.user.ini``, or
``php.ini``, as appropriate for the deployment::

  output_buffering = 0

For PHP running as an Apache module, equivalent values can instead be set in
Apache configuration when local PHP overrides are permitted::

  php_value upload_max_filesize 16G
  php_value post_max_size 16G
  php_value output_buffering 0

Adjust PHP timeouts if large requests or upload-finalization operations time
out::

  max_input_time = 3600
  max_execution_time = 3600

Nextcloud attempts to raise these timeout values to at least one hour at
runtime, but PHP or web-server configuration can prevent runtime changes.
Configure appropriate values explicitly when necessary.

Nextcloud
~~~~~~~~~

Make sure that the installed PHP version is supported by the installed version
of Nextcloud.

Nextcloud temporary directory
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

The ``tempdirectory`` setting in ``config.php`` controls the temporary
directory used by Nextcloud's temporary-file manager.

If ``tempdirectory`` is not configured, Nextcloud considers PHP's
``upload_tmp_dir`` and operating-system temporary directories.

The Nextcloud temporary directory and PHP's request-upload directory serve
different purposes. Depending on the upload path, either or both may be used.

See :doc:`../configuration_server/config_sample_php_parameters` for details.

Temporary ``.part`` file location
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

For direct, non-chunked WebDAV uploads, the ``part_file_in_storage`` setting
controls where Nextcloud creates a temporary ``.part`` file when the target
storage requires one::

  'part_file_in_storage' => true,

The default is ``true``.

With the default setting, Nextcloud creates the temporary file in the storage
containing the destination path. This normally avoids an additional
cross-storage transfer and can improve reliability and performance when the
backend supports efficient same-storage moves or renames.

If set to ``false``, Nextcloud creates the temporary file in the user's root
storage first and transfers it to the destination after the upload completes.
This can help with External Storage backends that have limited rename or move
behavior, but it can require additional storage, network traffic, and
finalization time.

This setting has no effect when the target storage indicates that it does not
require a Nextcloud-managed part file.

It applies only to direct, non-chunked uploads. It does not control the staging
location used by standard chunked assembly or Chunking v2.

.. _files_configure_max_chunk_size:

Chunk size and parallel uploads
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Nextcloud advertises a maximum chunk size to supporting clients. To change
this value, set ``files.chunked_upload.max_size`` in bytes.

For example, to configure a maximum chunk size of 20 MiB::

  sudo -E -u www-data php occ config:system:set \
    --type int --value 20971520 files.chunked_upload.max_size

The default is ``104857600`` bytes (100 MiB).

Larger chunks can improve throughput in high-bandwidth environments, but the
benefit generally diminishes above 100 MiB. Reverse proxies, content delivery
networks, and other services in the request path may also impose per-request
limits.

Set the value to ``0`` to disable chunking in supporting Nextcloud clients
that honor this capability. Independently implemented WebDAV clients may
choose their own upload behavior.

The number of chunks that supporting clients may upload in parallel is
controlled separately by ``files.chunked_upload.max_parallel_count``. The
default is ``5``.

For example, to configure a maximum of three parallel chunk uploads::

  sudo -E -u www-data php occ config:system:set \
    --type int --value 3 files.chunked_upload.max_parallel_count

Increasing the parallel count can improve throughput, but it also increases
concurrent web-server, PHP, network, memory, and storage load.

Changing either setting does not change where the complete file is staged and
does not disable cross-storage transfers. Those behaviors are determined by
the upload path and storage backend.

.. note:: Browser-initiated uploads may also be affected by session and
   automatic-logout settings such as ``session_lifetime``,
   ``session_keepalive``, ``session_relaxed_expiry``, and ``auto_logout``.

   WebDAV clients using app passwords are normally affected more directly by
   request, network, web-server, and storage timeouts than by browser-session
   lifetime.

Storage-specific behavior
-------------------------

Storage behavior affects where upload data is staged, how the upload is
published at its final path, and whether the complete file must be transferred
between storage instances during finalization.

External Storage
~~~~~~~~~~~~~~~~

External Storage is not a single storage backend. FTP, SFTP, SMB, WebDAV,
local mounts, S3, Swift, and other backends can use different upload
strategies.

Nextcloud remains in the data path for uploads to External Storage. Depending
on the upload method and backend, data may be streamed to the external service
as it is received or first staged and transferred during finalization.

For a staged upload whose destination is on another storage instance,
administrators should generally expect:

* the upload to be staged in the storage used by the user's upload directory;
* the finalization step to transfer the data to External Storage;
* additional finalization time and server-side network traffic; and
* sufficient capacity to be required in both the staging storage and the
  external backend.

Direct uploads to a backend that provides its own streaming, temporary-file,
or multipart implementation may require less local staging space.

For example, an external WebDAV backend may send a direct ``PUT`` to the
remote path, while an external S3 backend can use the S3 client's upload
behavior.

Do not assume that all External Storage backends use the same temporary-file,
streaming, or multipart strategy.

Primary object storage
~~~~~~~~~~~~~~~~~~~~~~

Primary object storage is different from object storage configured as an
External Storage mount.

For compatible S3 primary storage, Chunking v2 can send upload parts through
the S3 multipart-upload API and complete the file in S3. The final WebDAV
``MOVE`` does not need to assemble the complete file in the Nextcloud
temporary directory.

This optimized path requires:

* a distributed cache configured with Redis or Memcached;
* primary storage implementing ``IChunkedFileWrite``; and
* an object-store implementation supporting multipart upload.

If these requirements are not met, Nextcloud uses standard chunked assembly.
That path can require Nextcloud to read the stored chunks and write the
complete file during finalization, increasing staging, network, and timeout
requirements.

For object storage configured as External Storage, behavior is determined by
the External Storage backend. Depending on the upload method and backend,
Nextcloud may stage the upload, stream directly to the external target, or use
the backend library's native multipart behavior.

Upload processing details
-------------------------

The following sections describe how Nextcloud processes direct and chunked
WebDAV uploads internally. Administrators normally do not select these paths
directly; the client request, server configuration, and storage capabilities
determine which path is used.

Direct uploads
~~~~~~~~~~~~~~

A direct WebDAV upload sends the file in one ``PUT`` request.

Nextcloud asks the target storage whether a temporary part file is required.

When the storage requires a part file, Nextcloud:

#. creates a temporary filename ending in ``.part``;
#. streams the request body into the temporary file;
#. verifies the number of bytes written against ``Content-Length``, when that
   header is available;
#. acquires the required file lock;
#. moves the temporary file to the final path; and
#. updates the file cache and upload metadata.

The temporary file prevents a partially received upload from appearing as a
completed file at its final path.

Some storage backends do not require a Nextcloud-managed part file. They can
write directly to the target or provide their own temporary, streaming, or
multipart behavior.

Chunked uploads
~~~~~~~~~~~~~~~

The Nextcloud chunked WebDAV protocol stores an upload below the user's
``uploads`` directory.

Clients:

#. create an upload directory;
#. send numbered chunks to that directory; and
#. complete the upload with a WebDAV ``MOVE`` request.

Clients should provide the ``OC-Total-Length`` header with the complete file
size. This allows Nextcloud to check available quota while the chunks are
being uploaded and reject the upload earlier if insufficient space is
available.

During finalization, Nextcloud also verifies that the received chunks add up
to the declared size.

Abandoned chunked uploads occupy space until they are removed by Nextcloud's
upload-cleanup jobs.

Nextcloud can process a chunked upload through one of two server-side paths:

* standard chunked assembly; or
* storage-native chunked writing through Chunking v2.

Chunking v2 is attempted when its request, cache, and storage prerequisites are
met. Otherwise, Nextcloud uses standard chunked assembly.

Standard chunked assembly
^^^^^^^^^^^^^^^^^^^^^^^^^

With standard chunked assembly, the numbered chunks remain separate files in
the user's upload directory until finalization. They are not first combined
into another complete temporary file.

During the final ``MOVE``, Nextcloud exposes the chunks as one ordered,
read-only stream and writes that stream to the destination.

If the destination is on a different storage instance, this is a
cross-storage transfer rather than a simple filesystem rename.

A chunked upload to External Storage can therefore follow this path::

  client -> chunks in user's upload storage -> External Storage target

The finalization request must remain active while Nextcloud reads the staged
chunks and writes the completed file to the destination.

Chunking v2
^^^^^^^^^^^

Chunking v2 allows a compatible storage backend to receive and complete
individual upload parts through its native chunked-write mechanism.

Internally, compatible storage backends expose this capability through
``IChunkedFileWrite``.

Chunking v2 requires a distributed cache configured with Redis or Memcached.
The distributed cache stores the upload identifier and target metadata between
requests.

Chunking v2 is used only when the storage behind the user's upload directory
supports ``IChunkedFileWrite`` and the other request prerequisites are met. In
the current built-in implementation, this capability is used by compatible
primary object storage.

Chunking v2 is not selected merely because the final destination is on
External Storage.

If an existing, writable target file is on the same Nextcloud storage instance
as the upload directory, Chunking v2 can write directly to that target.

If the target does not yet exist or is on another storage instance, Nextcloud
creates a temporary ``.target`` file in the upload directory. After all parts
have been received, Nextcloud completes the chunked write and moves or copies
the result to the destination.

When creating a new destination, Nextcloud can normally move the staged file.
When replacing an existing destination, it may copy the staged file so that
the existing target is not removed before the replacement has completed. The
exact operation remains backend-dependent.

Federated Cloud Sharing
-----------------------

When using :doc:`Federated Cloud Sharing
<federated_cloud_sharing_configuration>` with large files, requests to the
federated server may require a longer timeout.

The ``davstorage.request_timeout`` setting in ``config.php`` controls this
timeout. Its default value is 30 seconds.

See :doc:`../configuration_server/config_sample_php_parameters` for details.
