Knowledge Base Configuration
============================
The usage of ownCloud is more or less self explaining but nevertheless a user
might run into a problem where he needs to consult the documentation or knowledge base. To ease access to the ownCloud
documentation and knowledge base, a help menu item is shown in the settings menu by default.

Parameters
----------

If you want to disable the ownCloud help menu item you can use the **knowledgebaseenabled** parameter inside the
:file:`config/config.php`.

::

  <?php

    "knowledgebaseenabled" => true,

.. note:: Disabling the help menu item might increase the number of support requests you have to answer in the future
