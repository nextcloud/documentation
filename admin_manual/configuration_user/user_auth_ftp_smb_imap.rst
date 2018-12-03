===========================================
User authentication with IMAP, SMB, and FTP
===========================================

You may configure additional user backends
in Nextcloud's configuration :file:`config/config.php` using the following
syntax:

::

  "user_backends" => [
    [
      "class"     => ...,
      "arguments" => [
        ...
      ],
    ],
  ],

.. note:: A non-blocking or correctly configured SELinux setup is needed
   for these backends to work. Please refer to the :ref:`selinux-config-label`.

Currently the “External user support” (user_external) app, which you need to
enable first (See :doc:`../apps_management`)
provides the following user backends:

IMAP
----
Provides authentication against IMAP servers

- **Class:** OC_User_IMAP
- **Arguments:**  a mailbox string as defined `in the PHP documentation <http://www.php.net/manual/en/function.imap-open.php>`_
- **Dependency:** php-imap (See :doc:`../installation/source_installation`)
- **Example:**

::

  "user_backends" => [
    [
      "class"     => "OC_User_IMAP",
      "arguments" => [
        '{imap.gmail.com:993/imap/ssl}'
      ],
    ],
  ],

SMB
---
Provides authentication against Samba servers

- **Class:** OC_User_SMB
- **Arguments:** the samba server to authenticate against
- **Dependency:** PHP smbclient module or smbclient (see 
  :doc:`../configuration_files/external_storage/smb`)
- **Example:**

::

  "user_backends" => [
    [
      "class"     => "OC_User_SMB",
      "arguments" => [
        'localhost'
      ],
    ],
  ],

FTP
---

Provides authentication against FTP servers

- **Class:** OC_User_FTP
- **Arguments:** the FTP server to authenticate against
- **Dependency:** php-ftp (See :doc:`../installation/source_installation`)
- **Example:**

::

  "user_backends" => [
    [
      "class"     => "OC_User_FTP",
      "arguments" => [
        'localhost'
      ],
    ],
  ],
