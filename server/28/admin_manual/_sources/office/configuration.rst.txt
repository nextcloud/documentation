=============
Configuration
=============

Nextcloud Office App Settings
=============================

Collabora Online Server
***********************

URL (and port) of the Collabora Online server that provides the editing functionality as a WOPI client. Collabora Online should use the same protocol (http:// or https://) as the server installation. Naturally, https:// is recommended.

Restrict usage to specific groups
*********************************
By default the app is enabled for all. When this setting is active, only members of specified groups can use Nextcloud Office.

Restrict edit to specific groups
********************************
By default all users can edit documents with Nextcloud Office. When this setting is active, only the members of specified groups can edit, others can only view documents.

Use OOXML by default for new files
**********************************
By default new files created by users are in OpenDocument Format (ODF). When this setting is active, new files will be created in Office Open XML (OOXML) format.

Enable access for external apps
*******************************
Nextcloud internally passes an access token to Collabora Online that is used later by it to do various operations. By default, it's not possible to generate this token by 3rd parties; only Nextcloud can generate and pass it to Collabora Online.

In some applications, it might be necessary to generate the token by a 3rd party application. For this, one needs to add the 3rd party application (external apps) in this setting. You need to add an application identifier and a secret
token. These credentials then can be used by the 3rd party application to make calls to `wopi/extapp/data/{fileId}` to fetch the access token and URL source for given fileId, both required to open a connection to Collabora Online.

Canonical webroot
*****************
Canonical webroot, in case there are multiple, for Collabora Online to use. Provide the one with least restrictions. E.g.: Use non-shibbolized webroot if this instance is accessed by both shibbolized and non-shibbolized webroots. You can ignore this setting if only one webroot is used to access this instance.


Additional configuration options
================================

The coolwsd service allows additional configuration options which can be found in the `Collabora Online documentation <https://sdk.collaboraonline.com/docs/installation/Configuration.html>`_.

Previews
********

In order to allow Nextcloud to use the coolwsd conversion API to generate previews, the Nextcloud host IP needs to be added to the allow list:

.. code-block:: bash

    sudo coolconfig set net.post_allow.host 10.0.0.4


Custom fonts
************

When you install coolwsd package, the post-install script will look for additional fonts on your system, and install them in the systemplate. If you install fonts to your system after installing coolwsd, you need to update the systemplate manually.

.. code-block:: bash

    coolconfig update-system-template


.. seealso::
    https://sdk.collaboraonline.com/docs/installation/Fonts.html


Secure view settings
********************

The secure view settings enables Nextcloud to embed watermarks on your office files. The watermark may be set according to different rules:

- **Tags:** will watermark files for files containing the defined tags
- **Groups:** will watermark files when opened by users belonging to the defined groups.
- **All shares:** will watermark files accessed via a share.
- **Read-only shares:** will watermark files if they are accessed via a read-only share.

.. warning::
    To enforce the confidentiality of your files it is crucial to restrict the ability to download the documents.

    This includes ensuring that your `WOPI configuration <#wopi-settings>`_ is configured to only serve documents between Nextcloud and Collabora.


Wopi settings
*************

It is highly recommended to restrict WOPI requests to the IP addresses of the Collabora servers that are expected to request files from the Nextcloud installation. This can be done by setting the ``Allow list for WOPI requests`` option from the Office admin settings.

Similarly, it is advised to configure `Collabora's WOPI host configuration <https://sdk.collaboraonline.com/docs/installation/Configuration.html#multihost-configuration>`_ to only serve IPs from expected hosts.
