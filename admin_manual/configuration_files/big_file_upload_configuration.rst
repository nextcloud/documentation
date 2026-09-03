.. _uploading_big_files:

=====================
Uploading large files
=====================

General upload limits
---------------------

Nextcloud does not impose a single default maximum file size for uploads. The
effective limit depends on the client, upload method, and every component in the
end-to-end request path, including:

* the web server;
* any reverse proxy, load balancer, or content delivery network;
* PHP configuration and timeouts;
* the operating system;
* the performance of the underlying storage mediums and filesystems;
* the Nextcloud storage backend involved;
* available temporary and staging space; and
* the user's available quota.

For a simple, direct upload, one HTTP request can contain the entire file (i.e. a WebDAV
``PUT`` transaction).

For a chunked upload, a larger file is split into multiple "chunks" to avoid many
end-to-end paths transaction size limits and optimize bandwidth usage, but storage and
quota limits still apply to the complete, re-assembled file. Also, path timeout constraints
may still impact final chunk assembly.

The relevant limits must therefore be configured consistently - or at least in a compatible
manner - across all components of the end-to-end upload path. The lowest applicable limit
determines whether an upload can complete.

.. note:: The official Nextcloud clients upload larger files by splitting them into
   smaller chunks by default. This reduces the likelihood of being impacted by per-request
   size limits, but the complete upload remains subject to request path constraints. And even
   the default chunk size may be inappropriate for particularly restrictive paths. See the 
   server-side chunk sizing parameters (which some clients use to auto-configure themselves) as
   well as the `client documentation
   <https://docs.nextcloud.com/server/latest/user_manual/en/desktop/configfile.html#general-section>`_
   for more information about options.

How Nextcloud handles uploads
-----------------------------

The upload path depends on:

* the client and protocol;
* whether the client uses a single request or a chunked upload;
* the storage backend receiving the upload;
* the capabilities provided by that storage backend; and
* whether the final destination is on the same storage instance as the upload
  staging area.

There are two principal client-side upload methods:

* **Direct upload**: the client sends the file in one WebDAV ``PUT`` request.
* **Chunked upload**: the client divides the file into multiple requests. The
  requests can be retried independently, and clients implementing the
  applicable resumable-upload behavior can resume an interrupted upload.

These client-side methods should be distinguished from storage-provider
mechanisms such as the S3 multipart-upload API. A chunked client upload may be
stored as temporary files, passed to a storage-native chunked-write
implementation, or converted into a provider-specific multipart upload.

The Nextcloud desktop sync client normally uses chunked uploads. WebDAV
clients and other clients may use either direct or chunked uploads.

The following table summarizes the principal upload paths. It is a conceptual
overview; exact behavior depends on the storage backend and the capabilities it
provides.

.. list-table::
   :header-rows: 1
   :widths: 20 27 27 26

   * - Upload path
     - Primary or home storage behavior
     - External Storage destination
     - Practical consequences

   * - Direct WebDAV ``PUT`` with a part file
     - The request is written to a temporary ``.part`` file and published at
       the final path after the upload succeeds.
     - The ``.part`` file can be placed in the storage containing the
       destination or in the user's root storage, depending on configuration
       and backend behavior.
     - Requires space for the temporary file. Publishing across storage
       instances may require an additional transfer.

   * - Direct WebDAV ``PUT`` without a part file
     - The request is written directly to the final path or processed by a
       backend-native upload mechanism.
     - Some External Storage backends manage temporary or multipart behavior
       themselves and do not request a Nextcloud-managed ``.part`` file.
     - Uses less Nextcloud-managed staging space, but failure and visibility
       behavior depend on the backend.

   * - Chunked WebDAV upload using standard assembly
     - Numbered chunks are stored in the user's ``uploads`` directory and
       exposed as one ordered stream during finalization.
     - The chunks remain in the user's upload storage. During finalization,
       the assembled stream is written to the External Storage destination.
     - Requires staging capacity in the user's upload storage and a complete
       transfer to the destination during finalization.

   * - Chunked WebDAV upload using Chunking v2
     - Available when the storage behind the user's upload directory supports
       ``IChunkedFileWrite`` and Redis or Memcached is configured.
     - If the destination is on another storage instance, the completed upload
       is transferred from the upload storage to the destination.
     - Avoids standard chunk assembly on supported storage, but a
       cross-storage destination can still require an additional transfer.

   * - S3 primary storage with multipart support
     - Upload parts can be sent through the S3 multipart-upload API and
       completed in S3.
     - An S3 External Storage mount is a separate backend and does not use the
       primary-storage multipart path.
     - Avoids assembling the complete object in the Nextcloud temporary
       directory for this upload path.

External Storage is not a single backend. FTP, SFTP, SMB, WebDAV, local
mounts, S3, Swift, and other backends can use different upload strategies.

The word "multipart" can refer either to client-side chunked upload requests
or to a storage provider's multipart-upload API. These are related but
different mechanisms.

Direct uploads
~~~~~~~~~~~~~~

For a direct WebDAV ``PUT``, Nextcloud normally asks the target storage whether
a temporary part file is required.

If the storage requires a part file, Nextcloud:

#. creates a temporary filename ending in ``.part``;
#. streams the request body into the temporary file;
#. verifies the number of bytes written against ``Content-Length``, when that
   header is available;
#. acquires the required file lock;
#. moves the temporary file to the final path; and
#. updates the file cache and upload metadata.

The temporary file prevents a partially received upload from appearing as a
completed file at its final path. Publication is normally a rename or move
within the same storage backend.

A storage backend can indicate that it does not require a Nextcloud-managed
part file. Such a backend may receive the data directly at the final path or
use its own temporary, streaming, or multipart mechanism. This can reduce
Nextcloud-managed staging requirements, but the handling of an interrupted
write and the visibility of incomplete data depend on the backend.

Chunked uploads
~~~~~~~~~~~~~~~

The chunked WebDAV protocol stores an upload below the user's ``uploads``
directory. Clients create an upload directory, send numbered chunks to it, and
complete the upload with a WebDAV ``MOVE`` request.

Nextcloud can process this workflow through one of two server-side paths:

* **Standard chunked assembly** stores the chunks as files and exposes them as
  one ordered stream during finalization.
* **Storage-native chunked writing**, implemented by Chunking v2, passes the
  parts to a storage backend that supports ``IChunkedFileWrite``.

Chunking v2 is attempted when its request, cache, and storage prerequisites are
met. Otherwise, Nextcloud uses the standard chunked-assembly path.

Clients should provide the ``OC-Total-Length`` header with the complete file
size. This allows Nextcloud to check available quota while chunks are being
uploaded and reject the upload earlier if insufficient space is available.
During finalization, Nextcloud also verifies that the received chunks add up
to the declared size.

Abandoned chunked uploads occupy space until they are removed by Nextcloud's
upload cleanup jobs.

Standard chunked assembly
^^^^^^^^^^^^^^^^^^^^^^^^^

With standard chunked assembly, the numbered chunks remain separate files in
the user's upload directory until finalization. They are not first combined
into another complete temporary file.

During the final ``MOVE``, Nextcloud exposes the chunks as one ordered,
read-only stream and writes that stream to the destination. If the destination
is on a different storage instance, this is a cross-storage transfer rather
than a simple filesystem rename.

For example, a chunked upload to External Storage commonly follows this data
path::

  client -> chunks in user's upload storage -> External Storage target

The finalization request must remain active while Nextcloud reads the staged
chunks and writes the completed file to the destination. Web-server,
reverse-proxy, PHP, network, and storage timeouts must therefore allow enough
time for this operation.

Chunking v2
^^^^^^^^^^^

Chunking v2 uses the ``IChunkedFileWrite`` storage capability, which provides
operations to:

* start a chunked write;
* receive individual parts;
* complete the write; and
* cancel the write.

Chunking v2 requires a distributed cache configured with Redis or Memcached.
The distributed cache stores the upload identifier and target metadata between
requests.

It is used only when the storage behind the user's upload directory implements
``IChunkedFileWrite`` and the other request prerequisites are met. In the
current built-in implementation, this capability is used by compatible primary
object storage. Chunking v2 is not selected merely because the final
destination is on External Storage.

If an existing, writable target file is on the same Nextcloud storage instance
as the upload directory, Chunking v2 can write directly to that target. If the
target does not yet exist or is on another storage instance, Nextcloud creates
a temporary ``.target`` file in the upload directory.

After all parts have been received, Nextcloud completes the chunked write. If
the completed upload is not already at the final path, Nextcloud moves or
copies it to the destination.

External Storage
~~~~~~~~~~~~~~~~

When the target is on External Storage, the upload behavior depends on:

* whether the upload is direct or chunked;
* whether the upload path uses staging;
* the storage used by the user's upload directory;
* whether the target is on the same storage instance; and
* the capabilities of the External Storage backend.

Nextcloud remains in the data path for uploads to External Storage. Depending
on the upload method and backend, data may be streamed to the external service
as it is received or first staged and transferred during finalization.

When the selected upload path uses staging and the target is on another storage
instance, administrators should generally expect:

* the upload to be staged in the storage used by the upload directory;
* the finalization step to transfer the data to External Storage; and
* sufficient capacity to be required in both the staging storage and the
  external backend.

In the staged Chunking v2 path, creating a new target can normally be
finalized by moving the staged file. Replacing an existing target may require
copying the staged file so that the existing target is not removed before the
replacement has completed. The exact operation remains backend-dependent.

Staged cross-storage uploads add a complete storage transfer during
finalization. This can increase finalization time, server-side network
traffic, and load on the Nextcloud host.

Direct uploads to a backend that provides its own streaming, temporary-file,
or multipart implementation may require less local staging space. For example,
an external WebDAV backend may send a direct ``PUT`` to the remote path, while
an external S3 backend can use the S3 client's upload behavior.

Do not assume that all External Storage backends use the same temporary-file,
streaming, or multipart strategy.

Primary object storage
~~~~~~~~~~~~~~~~~~~~~~

Primary object storage, such as S3 or Swift configured as Nextcloud's primary
storage, is different from S3 or Swift configured as an External Storage
mount.

When the primary object-store implementation supports multipart uploads and
the upload uses Chunking v2, the chunked write can map to the object store's
multipart API:

* initiate a multipart upload;
* upload the individual parts;
* complete the multipart upload; or
* abort it if the upload cannot be completed.

For this upload path, the parts are sent to the object store and completed
there. Nextcloud does not need to download and assemble the complete file in
its temporary directory during the final ``MOVE``.

If the required distributed cache or storage capability is unavailable,
Nextcloud uses the standard chunked-assembly path. That path may require
additional temporary or staging capacity and a longer finalization request.

The object-store client and Nextcloud server still need adequate request
timeouts, connection capacity, and any temporary buffering space required by
the specific implementation.

System configuration
--------------------

Make sure that a PHP version supported by the installed version of Nextcloud
is used.

User quotas must provide sufficient space for the completed upload. Supplying
``OC-Total-Length`` during a chunked upload allows Nextcloud to perform an
earlier quota check.

Temporary and staging space
~~~~~~~~~~~~~~~~~~~~~~~~~~~

Temporary or staging space can be required in several different locations:

* the web server's request-body temporary directory;
* PHP's ``upload_tmp_dir``;
* Nextcloud's ``tempdirectory``;
* a ``.part`` file in the destination or user storage;
* the user's ``uploads`` directory;
* a temporary ``.target`` file;
* an External Storage backend; or
* provider-side multipart-upload storage.

These locations have different purposes and are not interchangeable. Ensure
that every location used by the clients, web-server configuration, and storage
backends in your deployment has sufficient free space.

Direct uploads using a temporary ``.part`` file, standard chunked assembly,
and cross-storage uploads can require substantial temporary or staging space.
Object-store multipart uploads and backends that stream directly to the target
may require less local space, although the web server, reverse proxy, PHP, or
backend library may still buffer data.

When planning capacity, account for multiple simultaneous uploads and identify
the largest staging location used by your clients and storage backends. If
files can be uploaded to External Storage, allow for the possibility that a
chunked upload is first staged in the user's upload storage and then
transferred to the external destination.

Configuring your web server
---------------------------

Web-server and reverse-proxy limits apply to each HTTP request. For a direct
upload, the request may contain the entire file. For a chunked upload, they
normally apply to each individual chunk, while timeout settings also affect the
finalization request.

There are several web-server configuration options that can prevent larger
uploads from completing. Consult the documentation for every web server,
reverse proxy, content delivery network, or load balancer in the request path.

Apache
~~~~~~

Relevant Apache directives include:

* `LimitRequestBody
  <https://httpd.apache.org/docs/current/en/mod/core.html#limitrequestbody>`_
* `SSLRenegBufferSize
  <https://httpd.apache.org/docs/current/mod/mod_ssl.html#sslrenegbuffersize>`_
* `Timeout
  <https://httpd.apache.org/docs/current/mod/core.html#timeout>`_

In Apache HTTP Server 2.4.53 and earlier, ``LimitRequestBody`` defaulted to
unlimited. Newer releases default to 1 GiB. This can limit requests from
non-chunking clients to 1 GiB and can also limit individual requests from
chunking clients.

Set ``LimitRequestBody`` to a value appropriate for your deployment. Set it to
``0`` only if you intentionally want to disable this limit.

The `mod_reqtimeout
<https://httpd.apache.org/docs/current/mod/mod_reqtimeout.html>`_ module can
also stop large uploads from completing. If uploads fail while this module is
enabled, increase the configured ``RequestReadTimeout`` values as appropriate.

Apache with mod_fcgid
~~~~~~~~~~~~~~~~~~~~~

Relevant ``mod_fcgid`` directives include:

* `FcgidMaxRequestInMem
  <https://httpd.apache.org/mod_fcgid/mod/mod_fcgid.html#fcgidmaxrequestinmem>`_
* `FcgidMaxRequestLen
  <https://httpd.apache.org/mod_fcgid/mod/mod_fcgid.html#fcgidmaxrequestlen>`_

.. note:: Older ``mod_fcgid`` releases were affected by `Apache bug #51747
   <https://bz.apache.org/bugzilla/show_bug.cgi?id=51747>`_, which could cause
   segmentation faults unless ``FcgidMaxRequestInMem`` was increased
   significantly. Check whether the Apache and ``mod_fcgid`` versions in your
   deployment are affected before applying this historical workaround.

Apache with mod_proxy_fcgi
~~~~~~~~~~~~~~~~~~~~~~~~~~

The relevant timeout directive is:

* `ProxyTimeout
  <https://httpd.apache.org/docs/current/mod/mod_proxy.html#proxytimeout>`_

Apache and chunked request bodies
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Some WebDAV clients use HTTP requests with ``Transfer-Encoding: chunked``.
When Apache forwards these requests to FastCGI or PHP-FPM, the request body
must be passed to Nextcloud correctly.

Nextcloud's supplied ``.htaccess`` includes a compatibility rule that asks
Apache to buffer these request bodies and forward them with a
``Content-Length`` header. Make sure that the supplied ``.htaccess`` rules are
active when using Apache.

nginx
~~~~~

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

Use ``fastcgi_read_timeout`` when nginx communicates with PHP through FastCGI.
Use ``proxy_read_timeout`` when nginx proxies requests to another HTTP server.

A timeout while finalizing a chunked upload often appears during the
``MOVE`` request, even though the individual chunks uploaded successfully.
The finalization request can take longer because Nextcloud may need to read all
staged chunks and write the complete file to the destination.

Make sure that ``client_body_temp_path`` points to storage with sufficient
space and I/O capacity for the largest request nginx may buffer. Avoid sharing
this storage with unrelated I/O-intensive workloads.

Configuring PHP
---------------

Nextcloud includes a ``.user.ini`` file with required PHP settings. PHP caches
this file for a period controlled by ``user_ini.cache_ttl``, which defaults to
300 seconds, so changes may not take effect immediately.

For PHP-FPM or CGI deployments, configure the applicable ``php.ini`` or
``.user.ini`` file using PHP INI syntax::

  upload_max_filesize = 16G
  post_max_size = 16G

``post_max_size`` should be at least as large as ``upload_max_filesize``.
These settings primarily affect PHP form uploads and do not necessarily limit
raw WebDAV ``PUT`` requests in the same way.

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

Adjust PHP timeouts if large requests or upload finalization operations time
out::

  max_input_time = 3600
  max_execution_time = 3600

Nextcloud attempts to raise these timeout values to at least one hour at
runtime, but PHP or web-server configuration can prevent runtime changes.
Configure appropriate values explicitly when necessary.

Configuring Nextcloud
---------------------

Nextcloud temporary directory
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

The ``tempdirectory`` setting in ``config.php`` controls the temporary
directory used by Nextcloud's temporary-file manager. If it is not configured,
Nextcloud considers PHP's ``upload_tmp_dir`` and operating-system temporary
directories.

The Nextcloud temporary directory and PHP's request-upload directory serve
different purposes. Depending on the upload path, either or both may be used.
See :doc:`../configuration_server/config_sample_php_parameters`.

Temporary ``.part`` file location
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

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

Session length
~~~~~~~~~~~~~~

For uploads initiated through an authenticated browser session, ensure that
session and automatic-logout settings do not expire the user's session during
the expected upload workflow.

The effect of ``session_lifetime`` depends on related settings such as
``session_keepalive``, ``session_relaxed_expiry``, and ``auto_logout``, as
well as PHP or external session-backend cleanup.

WebDAV clients using app passwords are normally more directly affected by
request, network, web-server, and storage timeouts than by the browser session
lifetime.

See :doc:`../configuration_server/config_sample_php_parameters` for details
about these settings.

.. _files_configure_max_chunk_size:

Adjust chunk upload behavior
----------------------------

Nextcloud advertises a maximum chunk size to supporting clients. To change this
value, set ``files.chunked_upload.max_size`` in bytes. For example, to advertise
a maximum chunk size of 20 MiB::

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
default is ``5``. For example, to advertise a maximum of three parallel chunk
uploads::

  sudo -E -u www-data php occ config:system:set \
    --type int --value 3 files.chunked_upload.max_parallel_count

Increasing the parallel count can improve throughput, but it also increases
concurrent web-server, PHP, network, memory, and storage load.

Changing either setting does not change where the complete file is staged and
does not disable cross-storage transfers. Those behaviors are determined by
the upload path and storage backend.

Large file uploads on object storage
------------------------------------

Object storage can be configured in two different ways:

* as **Nextcloud primary storage**; or
* as **External Storage**, such as an S3 or Swift mount.

These configurations do not necessarily use the same upload path.

For compatible S3 primary storage, Chunking v2 can send the upload parts
through the S3 multipart-upload API and complete the file in S3. The final
``MOVE`` does not need to assemble the complete file in the Nextcloud
temporary directory.

This optimized path requires:

* a distributed cache configured with Redis or Memcached;
* primary storage implementing ``IChunkedFileWrite``; and
* an object-store implementation supporting multipart upload.

If these requirements are not met, Nextcloud uses standard chunked assembly.
That path can require Nextcloud to read the stored chunks and write the
complete file during finalization, increasing temporary-space, network, and
timeout requirements.

For object storage configured as External Storage, behavior is determined by
the External Storage backend. Depending on the upload method and backend,
Nextcloud may stage the upload, stream directly to the external target, or use
the backend library's native multipart behavior.

In all cases, ensure that PHP, the web server, reverse proxies, load balancers,
and the storage service allow the expected request duration and request size.
Required temporary and staging capacity depends on the selected backend and
upload path.

Federated Cloud Sharing
-----------------------

When using :doc:`Federated Cloud Sharing
<federated_cloud_sharing_configuration>` with large files, requests to the
federated server may require a longer timeout.

The ``davstorage.request_timeout`` setting in ``config.php`` controls this
timeout. Its default value is 30 seconds. See
:doc:`../configuration_server/config_sample_php_parameters` for details.
