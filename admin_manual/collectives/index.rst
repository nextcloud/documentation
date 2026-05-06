===========
Collectives
===========

Runtime Dependencies
--------------------

Collectives requires the following apps to be enabled. They're all shipped and enabled by default with
the Nextcloud server installation:

* **Teams** (with Nextcloud >= 29) or **Circles** (with Nextcloud <= 28)
* **Text**
* **Viewer**
* **files_versions**

Collectives and `group_everyone`
--------------------------------

When using the `group_everyone app`_, existing users will not see collectives with the "everyone" group
as member. The group members need to be synced once in the circles app: ``occ circles:sync --groups``

.. _group_everyone app: https://github.com/icewind1991/group_everyone/

This only needs to be done once. New users that got created after the app was enabled will see
the collectives straight away.

Collectives and guest users
---------------------------

In order to allow guest users (as provided by the `guests app`_ to access collectives, add the Collectives
and Teams apps to the list of enabled apps for guest users in admin settings.

.. _guests app: https://github.com/nextcloud/guests/

Please note that this enables guest users to create new collectives.

Public shares
-------------

WebDAV access to public shares must not be disabled (i.e. it must be enabled) for publicly shared
collectives to work. Please make sure that the following admin option is enabled:
"Allow users on this server to send shares to other servers (This option also enables WebDAV access to public shares)"
under "Sharing -> Federated Cloud Sharing".

Configuration
-------------

Initial Content for new collectives
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

It's possible to create custom content for new collectives by putting files in the app skeleton directory
at ``data/app_<INSTANCE_ID>/collectives/skeleton``. New collectives start with the contents of this directory.

Create a ``Readme.md`` file to change the landing page that is opened automatically when entering a collective.

If the skeleton directory doesn't contain a ``Readme.md``, the default landing page from
``apps/collectives/skeleton/Readme.md`` will be copied into the collectives directory instead.

Allow for groups in your collectives
------------------------------------

You can configure the Teams app to allow adding groups to teams. Since the Collectives app relies on the
Teams app for user management, this also allows adding entire groups to collectives.

Keep in mind thought that in contrast to teams, groups can only be managed by server admins.

Importing existing data
-----------------------

Import existing Markdown files is possible with the occ command ``occ collectives:import:markdown``.

The command imports Markdown files from a directory as new pages into a collective. After
importing all files, it processes relative links and referenced local attachments in the
Markdown files. It tries to fix links to other pages and uploads referenced attachments when
the source file is found in the import directory.

Please beware that the command is memory intensive. When importing a directory with many
Markdown files, make sure to increase the PHP memory limit accordingly:

.. code-block:: shell

   php -d memory_limit=<X>G ./occ collectives:import:markdown -c <collectiveId> -u <userId> /path/to/markdown/files

Importing from Dokuwiki
^^^^^^^^^^^^^^^^^^^^^^^

The Markdown directory import command (see above) supports to import Markdown files
generated from a Dokuwiki instance and tries to fix relative links to other pages and
upload referenced attachments.

Importing is tested with Markdown files generated with the `Dokuwiki2Markdown`_ tool.

.. _Dokuwiki2Markdown: https://github.com/mm503/Dokuwiki2Markdown

Here's an example how to import from a Dokuwiki instance:

.. code-block:: shell

   /path/to/doku2md.py -d /path/to/dokuwiki/data/pages -T
   php -d memory_limit=2G ./occ collectives:import:markdown -c 123 -u alice /path/to/dokuwiki/data/pages