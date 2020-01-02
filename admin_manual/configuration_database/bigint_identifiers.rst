==========================
BigInt (64bit) identifiers
==========================

Since Nextcloud 13 big integers are used to store identifiers and auto-increment keys in the database.
Because changing columns on huge tables can take quite a while (up to hours or days), the update from
Nextcloud 12 or earlier did not perform this migration on the filecache and activity table.

To make it easy to force the update on those tables too, we've added a console command, which can be used
to migrate the remaining columns to bigints.

The command can safely be executed. It will show a success message when there is nothing to do::

    sudo -u www-data php occ db:convert-filecache-bigint
    All tables already up to date!

or otherwise ask for confirmation, before performing the heavy actions::

    sudo -u www-data php occ db:convert-filecache-bigint
    This can take up to hours, depending on the number of files in your instance!
    Continue with the conversion (y/n)? [n]

to suppress the confirmation message append ``--no-interaction`` to the argument list::

    sudo -u www-data php occ db:convert-filecache-bigint --no-interaction


.. note:: Similar to a normal update, you should shutdown your apache or nginx server or enable maintenance
          mode before running the command to avoid issues with your sync clients.
