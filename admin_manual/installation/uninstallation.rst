==============
Uninstallation
==============

The application is stored in a server directory and works with a database to store the metadata for files and their shares (EFSS functionality).

There are no general uninstallation instructions, as Nextcloud offers a high degree of flexibility with regard to the operating model or operating platform; examples include abstract containers, virtual machines or “bare metal”, i.e. installation directly on one or more servers.

It is therefore important for the uninstallation to understand where the Nextcloud application is installed and where the corresponding data is located.

- Application directory (created before installation)
- File storage of the users (configured within the application directory or outside)
- Metadata storage in the database (within the application directory when using SQLite or outside on the same or another server)
- Caching via Redis server or similar (if used)

For uninstallation, a decision must be made as to whether the file storage should be backed up or whether the data should also be deleted. In addition, either the corresponding servers must be completely deprovisioned or the application directory deleted, as well as the database schemas and Redis entries, depending on the deployment scenario. If dedicated containers or virtual machines are used, these must be deprovisioned and the Nextcloud application must also be deprovisioned.

To uninstall, you can read values from your configuration in ``config`` directory. Check:

- Source code (manually installed, usually in ``/var/www`` or ``/opt/nextcloud``): remove the directory on all servers
- Database (related configuration keys: ``dbtype``, ``dbhost``): remove the corresponding database on all your database servers (you may want to make a backup first)
- Cache (related configuration keys:  ``memcache.*``): if persistent, remove the corresponding database or key from all cache servers
- Data (related configuration keys: ``datadirectory``): delete the directory on all servers (you may need to create a backup beforehand). Nextcloud has the option to store data in different locations. Also check external storage and objectstore
- Logs (related configuration keys: ``logfile``, ``logfile_audit``): normally in the data directory, but can also be in another location such as ``/var/log/``