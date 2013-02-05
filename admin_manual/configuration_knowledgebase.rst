Knowledge Base Configuration
============================

The usage of ownCloud is more or less self explaining but nevertheless a user
might run into a problem where he needs to consult the documentation or knowledge
base. To ease access to the ownCloud documentation and knowledge base, a help menu
item is shown in the settings menu by default.

Parameters
----------

If you want to disable the ownCloud help menu item for some reason you can use
the ``knowledgebaseenabled`` parameter. The ``knowledgebaseurl`` parameter is used
to set the http path to the ownCloud help page. (The server should understand OCS
(Open Collaboration Services).

**Hint:**
Keep in mind that disabling the help menu item might increase the number of
support request you have to answer in the future.
::
    "knowledgebaseenabled" => true,
    "knowledgebaseurl"     => "http://api.apps.owncloud.com/v1",
