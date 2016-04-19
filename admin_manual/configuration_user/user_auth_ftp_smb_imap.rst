===========================================
User Authentication with IMAP, SMB, and FTP
===========================================

You may configure additional user backends
in ownCloud's configuration :file:`config/config.php` using the following
syntax:

::

  <?php

  "user_backends" => array (
      0 => array (
              "class"     => ...,
              "arguments" => array (
                                0 => ...
                                ),
      ),
  ),

.. note:: A non-blocking or correctly configured SELinux setup is needed
   for these backends to work. Please refer to the :ref:`selinux-config-label`.

Currently the “External user support” (user_external) app, which you need to
enable first (See :doc:`../installation/apps_management_installation`)
provides the following user backends:

IMAP
----
Provides authentication against IMAP servers

- **Class:** OC_User_IMAP
- **Arguments:**  a mailbox string as defined `in the PHP documentation <http://www.php.net/manual/en/function.imap-open.php>`_
- **Dependency:** php-imap (See :doc:`../installation/source_installation`)
- **Example:**

::

  <?php

  "user_backends" => array (
      0 => array (
              "class"     => "OC_User_IMAP",
              "arguments" => array (
                                0 => '{imap.gmail.com:993/imap/ssl}'
                                ),
      ),
  ),

SMB
---
Provides authentication against Samba servers

- **Class:** OC_User_SMB
- **Arguments:** the samba server to authenticate against
- **Dependency:** PHP smbclient module or smbclient (see 
  :doc:`../configuration_files/external_storage/smb`)
- **Example:**

::

  <?php

  "user_backends" => array (
      0 => array (
              "class"     => "OC_User_SMB",
              "arguments" => array (
                                0 => 'localhost'
                                ),
      ),
  ),

FTP
---

Provides authentication against FTP servers

- **Class:** OC_User_FTP
- **Arguments:** the FTP server to authenticate against
- **Dependency:** php-ftp (See :doc:`../installation/source_installation`)
- **Example:**

::

  <?php

  "user_backends" => array (
      0 => array (
              "class"     => "OC_User_FTP",
              "arguments" => array (
                                0 => 'localhost'
                                ),
      ),
  ),
