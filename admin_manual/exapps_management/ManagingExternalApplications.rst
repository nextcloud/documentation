Managing External Applications
==============================

There are two ways to manage ExApps:

1. Using OCC CLI tool
2. Using the ExApp Management UI


OCC CLI
^^^^^^^

There are several commands to work with ExApps:

1. Register
2. Unregister
3. Update
4. Enable
5. Disable
6. List ExApps
7. List ExApp users (removed since AppAPI 3.0.0)
8. List ExApp scopes

Register
--------

Command: ``app_api:app:register [--force-scopes] [--info-xml INFO-XML] [--json-info JSON-INFO] [--] <appid> <daemon-config-name>``

The register command is the first ExApp installation step.

Arguments
*********

    * ``appid`` - unique name of the ExApp (e.g. ``app_python_skeleton``, must be the same as in deployed container)
    * ``daemon-config-name`` - unique name of the daemon (e.g. ``docker_local_sock``)

Options
*******

    * ``--force-scopes`` *[optional]* - force scopes approval
    * ``--json-info JSON-INFO`` **[optional]** - ExApp deploy JSON info (json string)
    * ``--info-xml INFO-XML`` **[optional]** - path to info.xml file (url or local absolute path)


Unregister
----------

Command: ``app_api:app:unregister [--rm-data] [--force] [--silent] [--] <appid>``

To remove an ExApp you can use the unregister command.
There are additional options to keep the ExApp persistent storage (data volume).

Arguments
*********

    * ``appid`` - unique name of the ExApp (e.g. ``app_python_skeleton``, must be the same as in deployed container)

Options
*******

    * ``--rm-data`` *[optional]* - remove ExApp persistent storage (data volume)
	* ``--force`` *[optional]* - continue removal even if some error occurs.
	* ``--silent`` *[optional]* - print a minimum of information, display only some errors, if any.

Update
------

Command: ``app_api:app:update [--info-xml INFO-XML] [--force-update] [--force-scopes] [-e|--enabled] [--] <appid>``

ExApp will be updated if there is a new version available.

Arguments
*********

    * ``appid`` - unique name of the ExApp (e.g. ``app_python_skeleton``, must be the same as in deployed container)

Options
*******

    * ``--info-xml INFO-XML`` **[optional]** - path to info.xml file (url or local absolute path)
    * ``--force-update`` *[optional]* - force ExApp update (do not prompt for confirmation)
    * ``--force-scopes`` *[optional]* - force scopes approval (accept all scopes)
    * ``-e|--enabled`` *[optional]* - enable ExApp after update

Enable
------

Command: ``app_api:app:enable <appid>``

Disable
-------

Command: ``app_api:app:disable <appid>``

List ExApps
-----------

Command: ``app_api:app:list``

ListExApps command will show all ExApps:

.. code-block::

    ExApps:
    appid (Display Name): version [enabled/disabled]
    to_gif_example (To Gif Example): 1.0.0 [enabled]
    upscaler_example (Upscaler Example): 1.0.0 [enabled]

Using the ExApp Management UI
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

ExApps management is similar to default Apps management.
To access ExApps management navigate using Admin settings dropdown menu or from AppAPI admin settings section.

.. note::

	ExApps management support only apps from App Store. For manual-install type use CLI ExApps management commands.
