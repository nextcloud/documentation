================================================
Prevent identifier exhaustion in large databases
================================================

Database identifiers stored as 32-bit integers have a limited range. Larger Nextcloud
installations can exhaust this range in heavily used tables, preventing new records from
being created. Converting these identifiers and their auto-increment keys to 64-bit
integers provides more capacity for future growth.

Changing columns in large tables can take several hours or even days, depending on the
number of files in the Nextcloud instance. For this reason, conversion of the
``filecache`` and activity tables must be triggered manually with a console command.

The command can safely be executed. It will show a success message when there is nothing to do::

    sudo -E -u www-data php occ db:convert-filecache-bigint
    All tables already up to date!

or otherwise ask for confirmation, before performing the heavy actions::

    sudo -E -u www-data php occ db:convert-filecache-bigint
    This can take up to hours, depending on the number of files in your instance!
    Continue with the conversion (y/n)? [n]

to suppress the confirmation message append ``--no-interaction`` to the argument list::

    sudo -E -u www-data php occ db:convert-filecache-bigint --no-interaction

.. note:: Similar to a normal update, you should shutdown your Apache or nginx server or enable maintenance
          mode before running the command to avoid issues with your sync clients.
