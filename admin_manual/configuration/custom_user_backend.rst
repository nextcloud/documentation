Custom User Backend Configuration
=================================

Starting with ownCloud 4.5 is possible to configure additional user backends
in ownCloud's configuration :file:`config/config.php` using the following
syntax:

.. code-block:: php

  <?php

  "user_backends" => array (
      0 => array (
              "class"     => ...,
              "arguments" => array (
                                0 => ...
                                ),
      ),
  ),

Currently the “External user support” (user_external) app provides the following user backends:

IMAP
----
Provides authentication against IMAP servers

- **Class:** OC_User_IMAP
- **Arguments:**  a mailbox string as defined `in the PHP documention <http://www.php.net/manual/en/function.imap-open.php>`_
- **Example:**

.. code-block:: php

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
- **Example:**

.. code-block:: php

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
~~~

Provides authentication against FTP servers

- **Class:** OC_User_FTP
- **Arguments:** the FTP server to authenticate against
- **Example:**

.. code-block:: php

  <?php

  "user_backends" => array (
      0 => array (
              "class"     => "OC_User_FTP",
              "arguments" => array (
                                0 => 'localhost'
                                ),
      ),
  ),
