=======================================
Apps, background jobs & config commands
=======================================

.. _apps_commands_label:

Apps commands
-------------

The ``app`` commands list, enable, and disable apps::

 app
  app:install      install selected app
  app:disable      disable an app
  app:enable       enable an app
  app:getpath      get an absolute path to the app directory
  app:list         list all available apps
  app:update       update an app or all apps
  app:remove       disable and remove an app

Download and install an app::

 sudo -E -u www-data php occ app:install twofactor_totp

Install but don't enable::

 sudo -E -u www-data php occ app:install --keep-disabled twofactor_totp

Install regardless of the Nextcloud version requirement::

 sudo -E -u www-data php occ app:install --force twofactor_totp

List all of your installed apps, and show whether they are
enabled or disabled::

 sudo -E -u www-data php occ app:list

List all of your installed and enabled (flag ``--enabled``) or disabled (flag ``--disabled``) apps::

 sudo -E -u www-data php occ app:list --enabled

List non-shipped installed apps only::

 sudo -E -u www-data php occ app:list --shipped false

Enable an app, for example the External Storage Support app::

 sudo -E -u www-data php occ app:enable files_external
 files_external enabled

Enable an app regardless of the Nextcloud version requirement::

 sudo -E -u www-data php occ app:enable --force files_external
 files_external enabled

Enable an app for specific groups of users (i.e. restrict an app so only specific groups can see and use them)::

 sudo -E -u www-data php occ app:enable --groups admin --groups sales files_external
 files_external enabled for groups: admin, sales

Enable multiple apps simultaneously::

 sudo -E -u www-data php occ app:enable app1 app2 app3
 app1 enabled
 app2 enabled
 app3 enabled

Disable an app::

 sudo -E -u www-data php occ app:disable files_external
 files_external disabled

Disable and remove an app::

 sudo -E -u www-data php occ app:remove files_external
 files_external disabled
 files_external 1.21.0 removed

Remove an app, but keep the app data::

 sudo -E -u www-data php occ app:remove --keep-data files_external
 files_external 1.21.0 removed

You can get the full filepath to an app::

    sudo -E -u www-data php occ app:getpath notifications
    /var/www/nextcloud/apps/notifications

To update an app, for instance Contacts::

    sudo -E -u www-data php occ app:update contacts

To update all apps::

    sudo -E -u www-data php occ app:update --all

To show available update(s) without updating::

    sudo -E -u www-data php occ app:update --showonly

To update an app to an unstable release, for instance News::

    sudo -E -u www-data php occ app:update --allow-unstable news

.. _background_jobs_selector_label:

Background jobs selector
------------------------

Use the ``background`` commands to select which scheduler you want to use for
controlling background jobs. This is the same as using
the **Cron** section on your Nextcloud Admin page::

 background
  background:cron       Set background jobs to cron mode
  background:ajax       Set background jobs to ajax mode
  background:webcron    Set background jobs to webcron mode

Example::

 sudo -E -u www-data php occ background:cron
   Set mode for background jobs to 'cron'

The other two commands are:

* ``background:ajax``
* ``background:webcron``

See :doc:`configuration_server/background_jobs_configuration` to learn more.

.. _config_commands_label:

Config commands
---------------

The ``config`` commands are used to configure the Nextcloud server::

 config
  config:app:delete      Delete an app config value
  config:app:get         Get an app config value
  config:app:set         Set an app config value
  config:import          Import a list of configs
  config:list            List all configs
  config:system:delete   Delete a system config value
  config:system:get      Get a system config value
  config:system:set      Set a system config value


While setting a configuration value, multiple options are available:

     - ``--value=VALUE`` change the configuration value
     - ``--type=TYPE`` change the type of the value. Use carefully; can break your instance
     - ``--lazy|--no-lazy`` set value as `lazy`
     - ``--sensitive|--no-sensitive`` set value as `sensitive`
     - ``--update-only`` only updates if a value is already stored

.. note::
	See `Appconfig Concepts`_ to learn more about `typed value`, `lazy` and `sensitive` flag.

.. _Appconfig Concepts: https://docs.nextcloud.com/server/latest/developer_manual/digging_deeper/config/appconfig.html#concept-overview

You can list all configuration values with one command::

 sudo -E -u www-data php occ config:list

By default, passwords and other sensitive data are omitted from the report, so
the output can be posted publicly (e.g. as part of a bug report). In order to
generate a full export of all configuration values the ``--private`` flag
needs to be set::

 sudo -E -u www-data php occ config:list --private

The exported content can also be imported again to allow the fast setup of
similar instances. The import command will only add or update values. Values
that exist in the current configuration, but not in the one that is being
imported are left untouched::

 sudo -E -u www-data php occ config:import filename.json

It is also possible to import remote files, by piping the input::

 sudo -E -u www-data php occ config:import < local-backup.json

.. note::

  While it is possible to update/set/delete the versions and installation
  statuses of apps and Nextcloud itself, it is **not** recommended to do this
  directly. Use the ``occ app:enable``, ``occ app:disable`` and ``occ app:update``
  commands instead.

Getting a single configuration value
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

These commands get the value of a single app or system configuration::

  sudo -E -u www-data php occ config:system:get version
  19.0.0.12

  sudo -E -u www-data php occ config:app:get activity installed_version
  2.2.1

Setting a single configuration value
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

These commands set the value of a single app or system configuration::

  sudo -E -u www-data php occ config:system:set logtimezone
  --value="Europe/Berlin"
  System config value logtimezone set to Europe/Berlin

  sudo -E -u www-data php occ config:app:set files_sharing
  incoming_server2server_share_enabled --value="yes"
  Config value incoming_server2server_share_enabled for app files_sharing set to yes

The ``config:system:set`` command creates the value, if it does not already
exist. To update an existing value,  set ``--update-only``::

  sudo -E -u www-data php occ config:system:set doesnotexist --value="true"
  --type=boolean --update-only
  Value not updated, as it has not been set before.

Note that in order to write a Boolean, float, or integer value to the
configuration file, you need to specify the type on your command. This
applies only to the ``config:system:set`` command. The following values are known:

* ``boolean``
* ``float``
* ``integer``
* ``json``
* ``null``
* ``string`` (default)

When you want to e.g. disable the maintenance mode run the following command::

  sudo -E -u www-data php occ config:system:set maintenance --value=false --type=boolean
  Nextcloud is in maintenance mode - no app have been loaded
  System config value maintenance set to boolean false

Setting an array configuration value
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Some configurations (e.g. the trusted domain setting) are an array of data.
In this case, ``config:system:get`` for this key will return multiple values::

  sudo -E -u www-data php occ config:system:get trusted_domains
  localhost
  nextcloud.local
  sample.tld

To set one of multiple values, you need to specify the array index as the
second ``name`` in the ``config:system:set`` command, separated by a
space. For example, to replace ``sample.tld`` with ``example.com``,
``trusted_domains => 2`` needs to be set::

  sudo -E -u www-data php occ config:system:set trusted_domains 2 --value=example.com
  System config value trusted_domains => 2 set to string example.com

  sudo -E -u www-data php occ config:system:get trusted_domains
  localhost
  nextcloud.local
  example.com

Alternatively, you can set the entry array at once by using the ``json`` type::

  sudo -E -u www-data php occ config:system:set trusted_domains --type json --value '["nextcloud.local","example.com"]'
  System config value trusted_domains set to json ["nextcloud.local","example.com"]

  sudo -E -u www-data php occ config:system:get trusted_domains
  nextcloud.local
  example.com

Setting a hierarchical configuration value
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Some configurations use hierarchical data. For example, the settings
for the Redis cache would look like this in the ``config.php`` file::

  'redis' => array(
    'host' => '/var/run/redis/redis.sock',
    'port' => 0,
    'dbindex' => 0,
    'password' => 'secret',
    'timeout' => 1.5,
  )

Setting such hierarchical values works similarly to setting an array
value above. For this Redis example, use the following commands::

  sudo -E -u www-data php occ config:system:set redis host \
  --value=/var/run/redis/redis.sock
  sudo -E -u www-data php occ config:system:set redis port --value=0
  sudo -E -u www-data php occ config:system:set redis dbindex --value=0
  sudo -E -u www-data php occ config:system:set redis password --value=secret
  sudo -E -u www-data php occ config:system:set redis timeout --value=1.5

Alternatively, you can set the entry configuration at once by using the ``json`` type::

  sudo -E -u www-data php occ config:system:set redis --type json --value '{"host":"/var/run/redis/redis.sock","port":0,"dbindex":0,"password":"secret","timeout":1.5}'


Deleting a single configuration value
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

These commands delete the configuration of an app or system configuration::

  sudo -E -u www-data php occ config:system:delete maintenance:mode
  System config value maintenance:mode deleted

  sudo -E -u www-data php occ config:app:delete appname provisioning_api
  Config value provisioning_api of app appname deleted

The delete command will by default not complain if the configuration was not set
before. If you want to be notified in that case, set the
``--error-if-not-exists`` flag::

  sudo -E -u www-data php occ config:system:delete doesnotexist
  --error-if-not-exists
  System config value doesnotexist could not be deleted because it did not exist


