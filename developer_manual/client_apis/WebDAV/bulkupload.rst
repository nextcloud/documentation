===========
Bulk upload
===========

.. sectionauthor:: Matthieu Gallien <matthieu.gallien@nextcloud.com>

Introduction
------------

Uploading many small files individually adds request overhead and can reduce effective
throughput. The bulk upload API lets a client upload multiple files in one HTTP request,
reducing that overhead and improving overall throughput.

The API is intended for workloads containing many independent files whose individual
payloads are small relative to the overhead of separate HTTP requests. It does not define
a fixed per-file size threshold or a minimum number of files. Clients should choose a
batching policy appropriate for their environment, limit the total multipart request size
to the limits of the Nextcloud instance and any reverse proxy, and use chunked upload for
large individual files.

Endpoint and capability discovery
---------------------------------

The API is available to authenticated users at:

.. code-block:: HTTP

   POST <server>/remote.php/dav/bulk

Before using this endpoint, clients should check for ``dav.bulkupload`` version
``1.0`` in the capabilities response. The feature can be disabled by
administrators, so clients must fall back to regular uploads when the capability
is absent.

Request format
^^^^^^^^^^^^^^

A bulk upload is an HTTP ``POST`` request whose outer ``Content-Type`` header
is:

.. code-block:: HTTP

    Content-Type: multipart/related; boundary=<boundary>

The server requires the ``multipart/related`` media type and the
``boundary`` parameter. Multipart boundaries, part headers, and the
header/body separator must use CRLF (``\r\n``).

Each part starts with ``--<boundary>\r\n``. After its headers, send an empty
line (``\r\n``), followed by exactly the number of payload bytes declared in
that part's ``Content-Length`` header, then ``\r\n``. Terminate the request
with ``--<boundary>--\r\n``.

Each part's ``Content-Length`` is the size in bytes of the file payload only. It
does not include multipart boundaries, part headers, or CRLF delimiters. The
server reads exactly the specified number of bytes, so file payloads may contain
newlines and arbitrary binary data.

Each file is sent as one part.

Each file part needs the following headers:

* ``Content-Length: <file size>``
* ``X-File-Path: <destination file path>``
* A checksum header; one or both of:

  * ``OC-Checksum: <algorithm>:<hex digest>``
  * ``X-File-MD5: <md5 checksum>``

The following per-part headers are optional:

* ``Content-Type: <mimetype>``
* ``X-OC-Mtime: <Unix timestamp in seconds>``

The destination file path is within the authenticated user's files root.
All intermediate folders must already exist.

At least one checksum header is required. ``OC-Checksum`` is the preferred
checksum header. For example:

.. code-block:: HTTP

   OC-Checksum: SHA1:3b5d5c3712955042212316173ccf37be800c4f6e

If compatibility with Nextcloud Server versions before 32 is required, clients
should also send the ``X-File-MD5`` header:

* ``X-File-MD5: <md5 checksum>``

On Nextcloud Server 32 and later, when both checksum headers are present, the
server uses the checksum specified in the ``OC-Checksum`` header for validation
and ignores any provided ``X-File-MD5`` header value.

The server also accepts ``X-File-Mtime`` as an alternative to
``X-OC-Mtime``. When both headers are supplied, ``X-File-Mtime`` takes
precedence. The desktop client currently sends ``Content-Type:
application/octet-stream`` and ``X-File-Mtime``.

The example below uses ``OC-Checksum`` only. Clients that need compatibility
with Nextcloud Server versions before 32 must also calculate and send
``X-File-MD5`` for every file part.

Response format
^^^^^^^^^^^^^^^

The reply is a JSON document keyed by the ``X-File-Path`` value. A successful
file upload has the following structure:

.. code-block:: JSON

  {
      "/small file.txt": {
          "error": false,
          "etag": "adb9aa24cbfa8e372c88431d1d99629a",
          "fileid": "123",
          "permissions": "RGDNVCK"
      }
  }

For a file-level error, the corresponding entry contains ``"error": true``
and an error message:

.. code-block:: JSON

  {
      "/unwritable/file.txt": {
          "error": true,
          "message": "..."
      }
  }

The request can return HTTP ``200 OK`` even if one or more individual file
uploads failed. Clients must inspect the response entry for every submitted
file. Malformed multipart requests return HTTP ``400 Bad Request``.

Retrying a failed bulk-upload request may require retransmitting
all files in that request.

GNU/Linux Bash + curl example
-----------------------------

The following Bash script example targets GNU/Linux systems with ``curl``
7.76.0 or newer. Older curl versions can replace ``--fail-with-body`` with
``--fail`` with approximate behavior. The script also requires ``openssl`` and
GNU core utilities. It uploads some test files using the bulk upload protocol.

This example uses the modern ``OC-Checksum`` header and assumes that bulk
upload is enabled. It does not work with Nextcloud Server versions before 32
as-is, but can be easily modified to do so. Production clients should confirm
that ``dav.bulkupload`` is advertised via the capabilities API before
attempting a bulk upload transaction.

The server can return HTTP ``200 OK`` while individual parts (files) generate
error response entries. The script displays but does not validate the per-file
JSON results. Production clients must parse the JSON response and inspect the
``error`` value for every submitted destination path.

The number of test files and bytes per test file should be specified on the
command line. The target Nextcloud instance URL (``BASE_URL``) and credentials
(``NC_USER`` and ``NC_PASSWORD``) can be provided as environment variables or,
alternatively, hardcoded in the script itself.

.. code-block:: BASH

    #!/usr/bin/env bash
    set -euo pipefail

    if (( $# != 2 )); then
        echo "Usage: $0 <number-of-files> <bytes-per-file>" >&2
        exit 1
    fi

    NB=$1
    SIZE=$2

    BASE_URL="${BASE_URL:-https://nextcloud.local}"
    BASE_URL="${BASE_URL%/}"
    NC_USER="${NC_USER:-admin}"
    NC_PASSWORD="${NC_PASSWORD:-admin}"

    REQUEST_ID="$(openssl rand -hex 8)"
    BOUNDARY="boundary_${REQUEST_ID}"
    REMOTE_FOLDER="bulk-upload-${REQUEST_ID}"
    WORK_DIR="$(mktemp -d "${TMPDIR:-/tmp}/nextcloud-bulk-upload.XXXXXX")"
    UPLOAD_PATH="$WORK_DIR/request.multipart"

    cleanup() {
        rm -rf "$WORK_DIR"
    }
    trap cleanup EXIT

    for ((i = 1; i <= NB; i++)); do
        file_name="$(openssl rand -hex 8).bin"
        file_local_path="$WORK_DIR/$file_name"
        file_remote_path="/$REMOTE_FOLDER/$file_name"

        head -c "$SIZE" /dev/urandom > "$file_local_path"

        file_mtime="$(stat -c %Y "$file_local_path")"
        file_checksum="$(sha1sum "$file_local_path" | awk '{print $1}')"
        file_size="$(wc -c < "$file_local_path")"

        {
            printf -- '--%s\r\n' "$BOUNDARY"
            printf 'X-File-Path: %s\r\n' "$file_remote_path"
            printf 'X-OC-Mtime: %s\r\n' "$file_mtime"
            printf 'Content-Type: application/octet-stream\r\n'
            printf 'OC-Checksum: SHA1:%s\r\n' "$file_checksum"
            printf 'Content-Length: %s\r\n' "$file_size"
            printf '\r\n'
            cat "$file_local_path"
            printf '\r\n'
        } >> "$UPLOAD_PATH"
    done

    printf -- '--%s--\r\n' "$BOUNDARY" >> "$UPLOAD_PATH"

    echo "Creating /$REMOTE_FOLDER"
    curl \
        --fail-with-body \
        --silent \
        --show-error \
        --user "$NC_USER:$NC_PASSWORD" \
        --request MKCOL \
        "$BASE_URL/remote.php/dav/files/$NC_USER/$REMOTE_FOLDER"

    echo "Uploading $NB files; request body size: $(wc -c < "$UPLOAD_PATH") bytes"
    curl \
        --fail-with-body \
        --show-error \
        --progress-bar \
        --user "$NC_USER:$NC_PASSWORD" \
        --header "Content-Type: multipart/related; boundary=$BOUNDARY" \
        --data-binary "@$UPLOAD_PATH" \
        "$BASE_URL/remote.php/dav/bulk"

    printf '\n'
