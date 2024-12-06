Managing ExApps
===============

Managing ExApps can be done from App Management UI as with other Nextcloud Apps,
but you can also use the AppAPI commands in the OCC CLI tool.

There are several commands to work with ExApps:

1. Register
2. Unregister
3. Update
4. Enable
5. Disable
6. List ExApps

Register
--------

Command: ``app_api:app:register [--info-xml INFO-XML] [--json-info JSON-INFO] [--] <appid> <daemon-config-name>``

The register command is the first ExApp installation step.

Arguments
*********

    * ``appid`` - unique name of the ExApp (e.g. ``app_python_skeleton``, must be the same as in deployed container)
    * ``daemon-config-name`` - unique name of the daemon (e.g. ``docker_local_sock``)

Options
*******

    * ``--json-info JSON-INFO`` *[optional]* - ExApp deploy JSON info (json string)
    * ``--info-xml INFO-XML`` *[optional]* - path to info.xml file (url or local absolute path)


Unregister
----------

Command: ``app_api:app:unregister [--rm-data] [--force] [--silent] [--] <appid>``

To remove an ExApp, you can use the unregister command.
By default, this command does *not* delete the ExApp's persistent storage (data volume) to avoid accidental removal of any user data.

Arguments
*********

    * ``appid`` - unique name of the ExApp (e.g. ``app_python_skeleton``, must be the same as in deployed container)

Options
*******

    * ``--rm-data`` *[optional]* - remove ExApp persistent storage (data volume)
	* ``--force`` *[optional]* - continue removal even if some error occurs
	* ``--silent`` *[optional]* - print a minimum of information, display only some errors, if any

Update
------

Command: ``app_api:app:update [--info-xml INFO-XML] [--force-update] [-e|--enabled] [--] <appid>``

ExApp will be updated if there is a new version available.

Arguments
*********

    * ``appid`` - unique name of the ExApp (e.g. ``app_python_skeleton``, must be the same as in deployed container)

Options
*******

    * ``--info-xml INFO-XML`` *[optional]* - path to info.xml file (url or local absolute path)
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
