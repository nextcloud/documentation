============================================
Excluding Directories and Blacklisting Files
============================================

Definitions of terms
--------------------

:**Blacklisted**:
  Files that may harm the ownCloud environment like a foreign ``.htaccess`` file. Blacklisting prevents anyone from uploading blacklisted files to the ownCloud server.
:**Excluded**:
  Existing directories on your ownCloud server, including external storage mounts, that are excluded from being processed by ownCloud. In effect they are invisible to ownCloud.

Both types are defined in ``config.php``. Blacklisted files and excluded directories are not scanned by ownCloud, not viewed, not synced, and cannot be created, renamed, deleted, or accessed via direct path input from a file explorer. Even when a filepath is entered manually via a file explorer, the path cannot be accessed.  

For example configurations please see ``owncloud/config/config.sample.php``.

Impact on System Performance
----------------------------

If you have a filesystem mounted with 200,000 files and directories and 15 snapshots in rotation, you would now scan and process 200,000 elements plus 200,000 x 15 = 3,000,000 elements additionally. These additional 3,000,000 elements, 15 times more than the original quantity, would also be available for viewing and synchronisation. Because this is a big and unnecessary overhead, most times confusing to clients, further processing can be eliminated by using excluded directories.

Blacklisted Files
-----------------

By default, ownCloud blacklists the file ``.htaccess`` to secure the running instance, which is important when using Apache as webserver. A foreign ``.htaccess`` file could overwrite rules defined by ownCloud. There is no explicit need to enter the file name ``.htaccess`` as parameter to the ``blacklisted_files`` array in ``config.php``, but you can add more blacklisted file names if necessary.

Excluded Directories
--------------------

**Reason for excluding directories:**

1. Enterprise storage systems, or special filesystems like ZFS and BtrFS are capable of snapshots. These snapshots are directories and keep point-in-time views of the data.
2. Snapshot directories are read-only.
3. There is no common naming for these directories, and most likely will never be. NetApp uses ``.snapshot`` and ``~snapshot``, EMC eg ``.ckpt``, HDS eg ``.latest`` and ``~latest``, the ZFS filesystem uses ``.zfs`` and so on.
4. Viewing and scanning of these directories does not make any sense as these directories are used to ease backup, restores, and cloning
5. Directories which are part of the mounted filesystem, but must not be accessible via ownCloud.

**Example:**

If you have a snapshot-capable storage or filesystem where snapshots are enabled and presented to clients, each directory will contain a "special" visible directory named e.g. ``.snapshot``. Depending on the system, you may find underneath a list of snapshots taken and in the next lower level the complete set of files and directories which were present when the snapshot was created. In most systems, this mechanism is true in all directory levels::

   /.snapshot
	/nightly.0
		/home
		/dat
		/pictures
		file_1
		file_2
	/nightly.1
		/home
		/dat
		/pictures
		file_1
		file_2
	/nightly.2
		/home
		/dat
		/pictures
		file_1
		file_2
	...
   /home
   /dat
   /pictures
   file_1
   file_2
   ...
   
Example ``excluded_directories`` entries in ``config.php`` look like this::

 'excluded_directories' =>
	array (
		'.snapshot',
		'~snapshot',
		'dir1',
		'dir2',
	),
	
Note that these are not pathnames, but directory names without any slashes. Excluding ``dir1`` excludes::

 /home/dir1 
 /etc/stuff/dir1
 
But not::

 /home/.dir1 
 /etc/stuff/mydir1	
	
Example ``blacklisted_files`` entries in ``config.php`` look like this::
	
 'blacklisted_files' => 
        array (
                'hosts',
                'evil_script.sh',
        ),
