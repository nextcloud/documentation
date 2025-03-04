=============================================
Using end-to-end encryption
=============================================

If enabled server side, Nextcloud provides the possibility to encrypt your files on your devices.
This is called end-to-end encryption, or E2EE, because the files are encrypted on your device and only decrypted on your device.
This means that the server never sees the unencrypted files.

Enabling E2EE
-------------

If your administrator enabled the end-to-end encryption app, you can start using it from one of your device.
Open the settings of the Nextcloud client and look for the EE2E encryption settings.

Desktop
^^^^^^^

.. image:: ../images/e2ee-desktop-setup.png
    :width: 750px
    :alt: Setup E2EE on the desktop client

Android
^^^^^^^

.. image:: ../images/e2ee-android-setup.png
    :width: 400px
    :alt: Setup E2EE on Android

iOS
^^^

.. image:: ../images/e2ee-ios-setup.png
    :width: 400px
    :alt: Setup E2EE on iOS

Web
^^^

.. warning::

    It is not possible to enable E2EE in the browser.

Adding an E2EE device
---------------------

Desktop
^^^^^^^

.. image:: ../images/e2ee-desktop-add.png
    :width: 750px
    :alt: Setup a new desktop client

Android
^^^^^^^

.. image:: ../images/e2ee-android-add.png
    :width: 400px
    :alt: Setup a new Android device

iOS
^^^

.. image:: ../images/e2ee-ios-add.png
    :width: 400px
    :alt: Setup a new iOS device

Web
^^^

On the browser, you'll first have to enable E2EE in the browser. This needed, as E2EE is less secure in the browser as you need to fully trust your administrator to not alter the source code that your browser will execute.

.. image:: ../images/e2ee-web-add-1.png
    :width: 750px
    :alt: Setup a new browser session step 1

.. image:: ../images/e2ee-web-add-2.png
    :width: 750px
    :alt: Setup a new browser session step 2

.. image:: ../images/e2ee-web-add-3.png
    :width: 750px
    :alt: Setup a new browser session step 3

Displaying the mnemonic
-----------------------

Desktop
^^^^^^^

.. image:: ../images/e2ee-desktop-mnemonic.png
    :width: 750px
    :alt: Displaying the mnemonic on the desktop client

Android
^^^^^^^

.. image:: ../images/e2ee-android-mnemonic.png
    :width: 400px
    :alt: Displaying the mnemonic on an Android device

iOS
^^^

.. image:: ../images/e2ee-ios-mnemonic.png
    :width: 400px
    :alt: Displaying the mnemonic on an iOS device

Web
^^^

.. warning::

    It is not possible to display the mnemonic in the browser.

Encrypting a folder
-----------------------

.. warning::

    You can only encrypt empty folders.

Desktop
^^^^^^^

.. image:: ../images/e2ee-desktop-encrypt.png
    :width: 750px
    :alt: Encrypting a folder on the desktop client

Android
^^^^^^^

.. image:: ../images/e2ee-android-encrypt.png
    :width: 400px
    :alt: Encrypting a folder on an Android device

iOS
^^^

.. image:: ../images/e2ee-ios-encrypt.png
    :width: 400px
    :alt: Encrypting a folder on an iOS device

Web
^^^

.. warning::

    It is not possible to encrypt a folder in the browser.
