.. _remotewipeindex:

===========
Remote wipe
===========

This document provides a quick overview of the remote wipe API that should be used by clients to implement the remote wipe functionality.
This will allow users to wipe a lost device for example.

Note that wiping only works when clients use the login flow so that a dedicated token is set for this client.


Obtaining wipe status
---------------------

Once a client receives a 401 or 403 status response it will do a fetch to :code:`<server>/index.php/core/wipe/check` and set the
token parameter to the apptoken.

.. code-block:: bash

     curl https://cloud.example.com/index.php/core/wipe/check -X POST -d 'token=<TOKEN>'

In case the client gets back a 200 status code and a JSON array with wipe set to true like:

.. code-block:: json

        {
                "wipe":true
        }

then the client should proceed to wipe the device.


Wiping the actual device
------------------------

The client must remove all user data linked to the account. This includes:
  * caches 
  * offline files
  * the actual account itself


Signalling completion
----------------------

Once the client has wiped all the required data a POST to :code:`<server>/index.php/core/wipe/success` has to be made with the token.
This signals the server the wipe is completed and triggers the final cleanup on the server side.

.. code-block:: bash

     curl https://cloud.example.com/index.php/core/wipe/success -X POST -d 'token=<TOKEN>'

