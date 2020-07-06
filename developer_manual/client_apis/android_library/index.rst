.. _androidindex:

=======
Android
=======
Nextcloud provides an official Nextcloud Android client, which gives its users
access to their files on their Nextcloud. It also includes functionality like
automatically uploading pictures and videos to Nextcloud.

For third party application developers, Nextcloud offers the Nextcloud Android
library under the MIT license.

Android Nextcloud client development
------------------------------------

If you are interested in working on the Nextcloud Android client, you can find
the source code `in GitHub <https://github.com/nextcloud/android/>`_. The
setup and process of contribution is
`documented here <https://github.com/nextcloud/android/blob/master/SETUP.md>`_.

You might want to start with doing one or two `good first issues <https://github.com/nextcloud/android/labels/good%20first%20issue>`_
to get into the code and note our :doc:`../general/index`.

Nextcloud Android library
-------------------------

This document will describe how to the use Nextcloud Android Library.  The
Nextcloud Android Library allows a developer to communicate with any Nextcloud
server; among the features included are file synchronization, upload and
download of files, delete or rename files and folders, etc.

This library may be added to a project and seamlessly integrates any
application with Nextcloud.

The tool needed is any IDE for Android; the preferred IDE at the moment is Android Studio.

Nextcloud Android Single-Sign-on
--------------------------------

This library allows you to use accounts as well as the network stack provided by the `nextcloud android client <https://play.google.com/store/apps/details?id=com.nextcloud.client>`. Therefore you as a developer don't need to worry about asking the user for credentials as well as you don't need to worry about self-signed ssl certificates, two factor authentication, save credential storage etc.

*Please note that the user needs to install the `nextcloud android client <https://play.google.com/store/apps/details?id=com.nextcloud.client>` in order to use those features.* While this might seem like a "no-go" for some developers, we still think that using this library is worth consideration as it makes the account handling much faster and safer.


.. toctree::
   :maxdepth: 2
   :hidden:

   library_installation
   examples