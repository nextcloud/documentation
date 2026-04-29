.. _external_storage_user_label:

============================
Using External Storage
============================

The External Storage application lets your Nextcloud server connect to remote file
systems — such as Amazon S3, SFTP servers, SMB/CIFS shares, or WebDAV servers — and
present them as folders inside your Files view. Your administration team configures
which backends are available and which mounts are shared with you.

If your administrator has enabled user-managed external storage, you can also add
your own connections under Personal Settings.

Accessing external storage
--------------------------

External storage mounts appear as regular folders in your Files view. You can
browse, upload, download, and delete files in them just as you would any other
folder. Whether sharing is available depends on whether your administrator has
enabled it for each individual mount.

A colored indicator next to the folder name shows the connection status:

* Green — the storage is connected and ready to use.
* Yellow — the storage could not be reached; Nextcloud will retry automatically.
* Red — the storage is unavailable. Contact your administrator if this persists.

When a mount is unavailable, Nextcloud marks it as offline for ten minutes before
retrying. You can trigger a manual recheck by clicking the status indicator.

.. note::
   Some external storage mounts may be read-only. You will not be able to upload
   or delete files on a read-only mount.

Sharing files from external storage
------------------------------------

Sharing from an external storage mount works the same as sharing any other file or
folder — use the share icon in the Files view. Sharing must be explicitly enabled on
each mount by your administrator, so the share icon may not be available on all
mounts.

.. note::
   Server-side encryption is not available for external mounts pointing to other
   Nextcloud instances.

Adding your own external storage
---------------------------------

If your administrator has enabled user-managed external storage, you can connect
your own storage services under **Personal Settings → External Storage**.

To add a new mount:

1. Click your profile icon in the top right and select **Personal Settings**.
2. Select **External Storage** from the left sidebar.
3. Choose a backend from the **Add storage** dropdown.
4. Fill in the required fields for the backend (server address, path, credentials, etc.).
5. Select an authentication method from the **Authentication** dropdown.

Required fields are marked with a red border. Once all required fields are filled,
the mount is saved automatically.

A green dot next to the mount confirms a successful connection. A red or yellow icon
means Nextcloud could not connect — check your credentials and network settings.

To remove a mount, open the three-dot overflow menu next to it and select **Delete**.

.. note::
   Mounts you add under Personal Settings are visible only to your account.

Supported backends
------------------

The following backends may be available, depending on what your administrator has
enabled:

* **Amazon S3** — Amazon Simple Storage Service buckets and S3-compatible storage.
* **FTP** — FTP and FTPS servers.
* **Nextcloud / ownCloud** — Another Nextcloud or ownCloud instance over WebDAV.
* **OpenStack Object Storage** — OpenStack Swift buckets.
* **SFTP** — SSH File Transfer Protocol servers.
* **SMB / CIFS** — Windows file shares and Samba servers.
* **WebDAV** — Any WebDAV-compatible server.

For backend-specific configuration details, see
`Configuring External Storage (GUI) <https://docs.nextcloud.com/server/latest/admin_manual/configuration_files/external_storage_configuration_gui.html>`_
in the Administrator's manual.

File change detection
---------------------

Files you add or change through Nextcloud are reflected immediately. Files added
or changed directly on the external storage — without going through Nextcloud — may
not appear until the next background scan.

If externally added files are not appearing, ask your administrator to run
``occ files:scan`` or to configure a periodic background scan for the mount.
