===================
Command Line Client
===================

The Nextcloud Client packages contain a command line client, ``nextcloudcmd``, that can
be used to synchronize Nextcloud files to client machines.

``nextcloudcmd`` performs a single *sync run* and then exits the synchronization
process. In this manner, ``nextcloudcmd`` processes the differences between
client and server directories and propagates the files to bring both
repositories to the same state. Contrary to the GUI-based client,
``nextcloudcmd`` does not repeat synchronizations on its own. It also does not
monitor for file system changes.


Install
~~~~~~~

+---------------+---------------------------------------------------------------------------------------------------------+
| OS            | Package                                                                                                 |
+===============+=========================================================================================================+
| Alpine        | https://pkgs.alpinelinux.org/package/edge/community/x86_64/nextcloud-client                             |
+---------------+---------------------------------------------------------------------------------------------------------+
| Debian        | https://packages.debian.org/search?suite=all&arch=any&searchon=names&keywords=nextcloud-desktop-cmd     |
+---------------+---------------------------------------------------------------------------------------------------------+
| Fedora        | https://packages.fedoraproject.org/pkgs/nextcloud-client/nextcloud-client/                              |
+---------------+---------------------------------------------------------------------------------------------------------+
| Ubuntu        | https://packages.ubuntu.com/search?keywords=nextcloud-desktop-cmd                                       |
+---------------+---------------------------------------------------------------------------------------------------------+
| Ubuntu (PPA)  | https://launchpad.net/~nextcloud-devs/+archive/ubuntu/client                                            |
+---------------+---------------------------------------------------------------------------------------------------------+
| Windows       | https://nextcloud.com/install/#install-clients                                                          |
+---------------+---------------------------------------------------------------------------------------------------------+

Usage
~~~~~

To invoke ``nextcloudcmd``, you must provide the local and the remote repository
URL using the following command::

  nextcloudcmd [OPTIONS...] sourcedir nextcloudurl

where ``sourcedir`` is the local directory and ``nextcloudurl`` is
the server URL.

Other command line switches supported by ``nextcloudcmd`` include the following:

``--path``
       Overrides default remote root folder to a specific subfolder on the server(e.g.: /Documents would sync the Documents subfolder on the server)

``--user``, ``-u`` `<user>`
       Use ``user`` as the login name.

``--password``, ``-p`` `<password>`
       Use `password` as the password.

``-n``
       Use`netrc(5)` for login.

``--non-interactive``
       Do not prompt for questions and tries to read $NC_USER and $NC_PASSWORD from the environment.

``--silent``, ``--s``
       Inhibits verbose log output.

``--trust``
       Trust any SSL certificate, including invalid ones.

``--httpproxy``  `http://[user@pass:]<server>:<port>`
      Uses `server` as HTTP proxy.

``--exclude`` `<file>`
      Exclude list file

``--unsyncedfolders`` `<file>`
      File containing the list of unsynced folders (selective sync)

``--max-sync-retries`` `<n>`
      Retries maximum n times (defaults to 3)

``-h``
      Sync hidden files,do not ignore them


Credential Handling
~~~~~~~~~~~~~~~~~~~

``nextcloudcmd`` requires the user to specify the username and password using the standard URL pattern, e.g.,

::

  $ nextcloudcmd /home/user/my_sync_folder https://carla:secret@server/nextcloud

To synchronize the Nextcloud directory ``Music`` to the local directory
``media/music``, through a proxy listening on port ``8080``, and on a gateway
machine using IP address ``192.168.178.1``, the command line would be::

  $ nextcloudcmd --httpproxy http://192.168.178.1:8080 --path /Music \
                $HOME/media/music \
                https://server/nextcloud

``nextcloudcmd`` will prompt for the user name and password, unless they have
been specified on the command line or ``-n`` has been passed.

Exclude List
~~~~~~~~~~~~

``nextcloudcmd`` requires access to an exclude list file. It must either be
installed along with ``nextcloudcmd`` and thus be available in a system location,
be placed next to the binary as ``sync-exclude.lst`` or be explicitly specified
with the ``--exclude`` switch.

The required file content is one exclude item per line where wildcards are allowed, e.g.:
::

    ~*.tmp
    ._*
    ]Thumbs.db
    ]photothumb.db
    System Volume Information

Example
~~~~~~~~~~~~

- Synchronize a local directory to the specified directory of the nextcloud server

::

    $ nextcloudcmd --path /<Directory_that_has_been_created> /home/user/<my_sync_folder> \
    https://<username>:<secret>@<server_address>
