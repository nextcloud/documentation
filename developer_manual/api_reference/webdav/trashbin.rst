.. _webdavtrashbin:

========
Trashbin
========

Nextcloud makes the trashbin of a user available via the webdav endpoint.

Listing the trashbin content
----------------------------

To obtain all the files in the trashbin a normal :code:`PROPFIND` has to be send to
:code:`https://cloud.example.com/remote.php/dav/trashbin/USER/trash`. This will
list the content of the trashbin.

The endpoint provides three extra properties:

* :code:`{http://nextcloud.org/ns}trashbin-filename`
* :code:`{http://nextcloud.org/ns}trashbin-original-location`
* :code:`{http://nextcloud.org/ns}trashbin-deletion-time`

The result is a normal response to a :code:`PROPFIND` and can be listed as such.


Restoring from the trashbin
---------------------------

To restore from the trashbin all that needs to be done is to move the item to
the special restore folder at :code:`https://cloud.example.com/remote.php/dav/trashbin/USER/restore`

This will automatically restore the item to its original location.


Deleting from the trashbin
--------------------------

To delete from the trashbin just perform a :code:`DELETE` on the item.


Emptying the trashbin
---------------------

Perform a :code:`DELETE` on `https://cloud.example.com/remote.php/dav/trashbin/USER/trash`
