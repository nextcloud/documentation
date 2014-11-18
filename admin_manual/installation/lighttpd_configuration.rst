Lighttpd Configuration
======================

This assumes that you are familiar with installing PHP applications on
Lighttpd.

It is important to note that the :file:`.htaccess` used by ownCloud to
protect the :file:`data` folder is ignored by lighttpd, so you have to secure
it by yourself, otherwise your :file:`owncloud.db` database and user data are
publicly readable even if directory listing is off. You need to add these two
snippets to your Lighttpd configuration file:

Disable access to data folder::

	$HTTP["url"] =~ "^/owncloud/data/" {
		url.access-deny = ("")
	}

Disable directory listing::

	$HTTP["url"] =~ "^/owncloud($|/)" {
		dir-listing.activate = "disable"
	}

**Note for Lighttpd users on Debian stable (wheezy):**

Recent versions of ownCloud make use of the **HTTP PATCH** feature, which was 
added to Lighttpd at version 1.4.32 while Debian stable only ships 1.4.31. The 
patch is simple, however, and easy to integrate if you're willing to build your 
own package.

Download the patch from 
http://redmine.lighttpd.net/attachments/download/1370/patch.patch

Make sure you have the build tools you need::

    apt-get build-dep lighttpd
    apt-get install quilt patch devscripts

Patch the package source::

    apt-get source lighttpd
    cd lighttpd-1.4.31
    export QUILT_PATCHES=debian/patches # This tells quilt to put the patch in 
    the right spot
    quilt new http-patch.patch
    quilt add src/connections.c src/keyvalue.c src/keyvalue.h # Make quilt 
    watch the files we'll be changing
    patch -p1 -i /patch/to/downloaded/patch.patch
    quilt refresh

Increment the package version with ``dch -i``. This will open the changelog with 
a new entry. You can save as-is or add info to it. The important bit is that the 
version is bumped so apt will not try to "upgrade" back to Debian's version.

Then build with ``debuild`` and install the .debs for any Lighttpd packages you 
already have installed.