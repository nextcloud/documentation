=============================================
Using end-to-end encryption
=============================================

If enabled server side, Nextcloud provides the possibility to encrypt your files on your devices.
This is called end-to-end encryption, or E2EE, because the files are encrypted on your device and only decrypted on your device.
The server never sees the unencrypted files, further protecting user privacy and data security.

Enabling E2EE
-------------

If your administrator enabled the [End-to-End Encryption app](https://apps.nextcloud.com/apps/end_to_end_encryption), you can start using it from one of your devices.
Open the settings of the Nextcloud client and look for the EE2E encryption settings.

.. raw:: html

   <details>
   <summary>Desktop</summary>

.. image:: ../images/e2ee-desktop-setup.png
    :width: 750px
    :alt: Setup E2EE on the desktop client

.. raw:: html

   </details>


.. raw:: html

   <details>
   <summary>Android</summary>

.. image:: ../images/e2ee-android-setup.png
    :width: 400px
    :alt: Setup E2EE on Android

.. raw:: html

   </details>


.. raw:: html

   <details>
   <summary>iOS</summary>

.. image:: ../images/e2ee-ios-setup-1.png
    :width: 400px
    :alt: Setup E2EE on iOS step 1

.. image:: ../images/e2ee-ios-setup-2.png
    :width: 400px
    :alt: Setup E2EE on iOS step 2

.. image:: ../images/e2ee-ios-setup-3.png
    :width: 400px
    :alt: Setup E2EE on iOS step 3

.. raw:: html

   </details>


.. raw:: html

   <details>
   <summary>Web</summary>

.. warning::
    It is not possible to enable encryption on a folder in the browser. This must be done on a client app, either a desktop or mobile client.

.. raw:: html

   </details>


.. raw:: html

    <br />

Encrypting a folder
-----------------------

.. warning::

    You can only enable encryption on empty folders.


.. raw:: html

   <details>
   <summary>Desktop</summary>

.. image:: ../images/e2ee-desktop-encrypt-1.png
    :width: 750px
    :alt: Encrypting a folder on the desktop client step 1

.. image:: ../images/e2ee-desktop-encrypt-2.png
    :width: 750px
    :alt: Encrypting a folder on the desktop client step 2

.. image:: ../images/e2ee-desktop-encrypt-3.png
    :width: 750px
    :alt: Encrypting a folder on the desktop client step 3

.. raw:: html

   </details>


.. raw:: html

   <details>
   <summary>Android</summary>

.. image:: ../images/e2ee-android-encrypt.png
    :width: 400px
    :alt: Encrypting a folder on an Android device

.. raw:: html

   </details>


.. raw:: html

   <details>
   <summary>iOS</summary>

.. image:: ../images/e2ee-ios-encrypt.png
    :width: 400px
    :alt: Encrypting a folder on an iOS device

.. raw:: html

   </details>


.. raw:: html

   <details>
   <summary>Web</summary>

.. warning::

    It is not possible to enable encryption on a folder in the browser. This must be done on a client app, either a desktop or mobile client.

.. raw:: html

   </details>


.. raw:: html

    <br />

Adding an E2EE device
---------------------

.. raw:: html

   <details>
   <summary>Desktop</summary>

.. image:: ../images/e2ee-desktop-add.png
    :width: 750px
    :alt: Setup a new desktop client

.. raw:: html

   </details>


.. raw:: html

   <details>
   <summary>Android</summary>

.. image:: ../images/e2ee-android-add.png
    :width: 400px
    :alt: Setup a new Android device

.. raw:: html

   </details>


.. raw:: html

   <details>
   <summary>iOS</summary>

.. image:: ../images/e2ee-ios-add.png
    :width: 400px
    :alt: Setup a new iOS device

.. raw:: html

   </details>


.. raw:: html

   <details>
   <summary>Web</summary>

In the browser, first enable E2EE in the personal settings. This is needed, as E2EE is less secure in the browser, requiring you to fully trust the administrator to not alter the source code the browser will execute.
E2EE folders are currently read-only. Therefore, it is not possible to add, remove, edit, or share an E2EE file from the browser.

.. image:: ../images/e2ee-web-add-1.png
    :width: 750px
    :alt: Setup a new browser session step 1

.. image:: ../images/e2ee-web-add-2.png
    :width: 750px
    :alt: Setup a new browser session step 2

.. image:: ../images/e2ee-web-add-3.png
    :width: 750px
    :alt: Setup a new browser session step 3

.. raw:: html

   </details>


.. raw:: html

    <br />


Displaying the mnemonic
-----------------------

The mnemonic is a list of words that is used to encrypt and decrypt your files. It is important to keep this mnemonic safe, as it is the only way to access your files if you lose access to your device. If you lose access to your mnemonic, you will lose access to your files.

.. raw:: html

   <details>
   <summary>Desktop</summary>

.. image:: ../images/e2ee-desktop-mnemonic.png
    :width: 750px
    :alt: Displaying the mnemonic on the desktop client

.. raw:: html

   </details>


.. raw:: html

   <details>
   <summary>Android</summary>

.. image:: ../images/e2ee-android-mnemonic.png
    :width: 400px
    :alt: Displaying the mnemonic on an Android device

.. raw:: html

   </details>


.. raw:: html

   <details>
   <summary>iOS</summary>

.. image:: ../images/e2ee-ios-mnemonic.png
    :width: 400px
    :alt: Displaying the mnemonic on an iOS device

.. raw:: html

   </details>


.. raw:: html

   <details>
   <summary>Web</summary>

.. warning::

    It is not possible to display the mnemonic in the browser.

.. raw:: html

   </details>

.. raw:: html

    <br />
