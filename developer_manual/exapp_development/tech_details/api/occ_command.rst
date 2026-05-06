.. _occ_command:

===========
OCC Command
===========

This API allows you to register OCC CLI commands.
The principle is similar to the regular occ command for PHP apps that are working within the context of the Nextcloud instance,
but for ExApps, it is a trigger via the Nextcloud OCC interface to perform some action on the ExApp side.


.. note::

    Passing files directly as an input argument to the occ command is not supported.

Register
^^^^^^^^

OCS endpoint: ``POST /apps/app_api/api/v1/occ_command``

Params
******

.. code-block:: json

    {
        "name": "appid:unique:command:name",
        "description": "Description of the command",
        "hidden": "1/0",
        "arguments": [
            {
                "name": "argument_name",
                "mode": "required/optional/array",
                "description": "Description of the argument",
                "default": "default_value"
            }
        ],
        "options": [
            {
                "name": "option_name",
                "shortcut": "s",
                "mode": "required/optional/none/array/negatable",
                "description": "Description of the option",
                "default": "default_value"
            }
        ],
        "usages": [
            "occ appid:unique:command:name argument_name --option_name",
            "occ appid:unique:command:name argument_name -s"
        ],
        "execute_handler": "handler_route"
    }

For more details on the command arguments and options modes,
see the original docs for the Symfony console input parameters, which are actually being built from the provided data:
`https://symfony.com/doc/current/console/input.html#using-command-arguments <https://symfony.com/doc/current/console/input.html#using-command-arguments>`_


Example
*******

Let's assume we have a command `ping` that takes an argument `test_arg` and has an option `test-option`:

.. code-block:: json

    {
        "name": "my_app_id:ping",
        "description": "Test ping command",
        "hidden": 0,
        "arguments": [
            {
                "name": "test_arg",
                "mode": "required",
                "description": "Test argument",
                "default": 123
            }
        ],
        "options": [
            {
                "name": "test-option",
                "shortcut": "t",
                "mode": "none",
                "description": "Test option",
            }
        ],
        "usages": [
            "occ my_app_id:ping 12345",
            "occ my_app_id:ping 12345 --test-option",
            "occ my_app_id:ping 12345 -t"
        ],
        "execute_handler": "handler_route"
    }

Unregister
^^^^^^^^^^

OCS endpoint: ``DELETE /apps/app_api/api/v1/occ_command``

Params
******

To unregister an OCC CLI command, you just need to provide a command `name`:

.. code-block:: json

	{
		"name": "occ_command_name"
	}
