==========================
Automated tagging of files
==========================

Nextcloud's Files Automated Tagging app allows to assign collaborative tags
to files and folders based on rules, similar to :doc:`access_control`.

Assigning restricted and invisible tags
---------------------------------------

The main functionality of this app is to allow users to indirectly assign
restricted and invisible tags to files they upload.

This is especially useful for retention and :doc:`access_control`, so people
that got the files shared can not remove the tag to stop the retention or
allow access against the owners will.

Example
-------

After installing the Files automated tagging app as described in :doc:`../apps_management`
navigate to the configuration and locate the Workflow settings.

    .. figure:: images/automated_tagging_sample_rule.png
       :alt: Example rule to assign a restricted tag.

In the example you can see a simple rule with only one condition.
It will tag all files with the restricted tag ``Protected file`` that are
uploaded into a folder that is tagged with ``Protect content``. No user can
remove the tag ``Protected file`` and therefore access control and retention
both work fine without users being able to work around them.

In this case folder will be also tagged with tag ``Protected file``, to avoid
this, simply modify the rule to exclude Directory ``httpd/unix-directory`` from it.

    .. figure:: images/automated_tagging_sample_rule_exclude_folder.png
       :alt: Example rule to assign a restricted tag except to Directory.

Available rules
---------------

The available rules can be seen in the access control section: :ref:`available-rules-label`.

.. note::

    Please note that the rules do not apply when creating external storages and groupfolders.
    The root folders of those need to be tagged manually with the desired initial tags.
    Items created inside later on apply the rules as defined.

Executing actions
-----------------

It is possible to execute actions like ```convert to PDF``` based on assigned tags. Nextcloud
GmbH assists customers in this with hands-on help and documentation on our
`customer portal <https://portal.nextcloud.com>`_.
