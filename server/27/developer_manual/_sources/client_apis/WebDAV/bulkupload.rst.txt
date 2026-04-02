===================
File bulk upload
===================

.. sectionauthor:: Matthieu Gallien <matthieu.gallien@nextcloud.com>

Introduction
------------
Uploading many small files is often slower than what could be achieved because we do not
use the whole network bandwidth. Nextcloud has a bulk upload API where you can upload
many small files together in order to optimize the use of network bandwidth.

Usage
-----

The API is only available for registered users of your instance. And uses the path:
``<server>/remote.php/dav/bulk``.

Starting a bulk upload
^^^^^^^^^^^^^^^^^^^^^^^^^

A bulk upload is simply using a request structured as HTTP multipart with related mime type.

Each file is then sent as one HTTP part.

Each file inside an HTTP Part will need the following headers:

* Content-Length: <file size>
* Content-Type: <mimetype>
* X-File-MD5: <md5 checksum>
* X-File-Mtime: <modification time of file>
* X-File-Path: <destination file path>

The reply is a json document with the following structure:

.. code-block:: JSON

  {
      "/small file.txt": {
          "error": false,
          "etag": "adb9aa24cbfa8e372c88431d1d99629a"
      }
  }

Example of code to upload some test files with bulk upload protocol

.. code-block:: BASH

    #!/bin/bash

    NB=$1
    SIZE=$2

    USER="admin"
    PASS="admin"
    SERVER="nextcloud.local"
    UPLOAD_PATH="/tmp/bulk_upload_request_$(openssl rand --hex 8).txt"
    BOUNDARY="boundary_$(openssl rand --hex 8)"
    REMOTE_FOLDER="/test"

    for ((i=1; i<="$NB"; i++))
    do
            file_name=$(openssl rand --hex 8)
            file_local_path="./$file_name.txt"
            file_remote_path="$REMOTE_FOLDER/$file_name.txt"
            head -c "$SIZE" /dev/urandom > "$file_local_path"
            file_mtime=$(stat -c %Y "$file_local_path")
            file_hash=$(md5sum "$file_local_path" | awk '{ print $1 }')
            file_size=$(du -sb "$file_local_path" | awk '{ print $1 }')

            {
                    echo -en "--$BOUNDARY\r\n"
                    echo -en "X-File-Path: $file_remote_path\r\n"
                    echo -en "X-OC-Mtime: $file_mtime\r\n"
                    echo -en "X-File-Md5: $file_hash\r\n"
                    echo -en "Content-Length: $file_size\r\n"
                    echo -en "\r\n" >> "$UPLOAD_PATH"

                    cat "$file_local_path"
                    echo -en "\r\n" >> "$UPLOAD_PATH"
            } >> "$UPLOAD_PATH"
    done

    echo -en "--$BOUNDARY--\r\n" >> "$UPLOAD_PATH"

    echo "Creating folder /test"
    curl \
            -X MKCOL \
            -k \
            "https://$USER:$PASS@$SERVER/remote.php/dav/files/$USER/test" > /dev/null

    echo "Uploading $NB files with total size: $(du -sh "$UPLOAD_PATH" | cut -d '   ' -f1)"
    echo "Local file is: $UPLOAD_PATH"
    curl \
            -X POST \
            -k \
            --progress-bar \
            --cookie "XDEBUG_PROFILE=true;path=/;" \
            -H "Content-Type: multipart/related; boundary=$BOUNDARY" \
            --data-binary "@$UPLOAD_PATH" \
            "https://$USER:$PASS@$SERVER/remote.php/dav/bulk"
