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
to get into the code and note our :doc:`../../prologue/index`.

For authentication, you can use our usual login flow, and in addition (or instead
if you are OK for users to depend on our Files app) use the great
`Android SingeSignOn library <https://github.com/nextcloud/Android-SingleSignOn/#how-to-use-this-library>`_

Nextcloud Android library
-------------------------

This document will describe how to the use Nextcloud Android Library.  The
Nextcloud Android Library allows a developer to communicate with any Nextcloud
server; among the features included are file synchronization, upload and
download of files, delete or rename files and folders, etc.

This library may be added to a project and seamlessly integrates any
application with Nextcloud.

The tool needed is any IDE for Android; the preferred IDE at the moment is Android Studio.

.. toctree::
   :maxdepth: 2
   :hidden:

   library_installation
   examples

