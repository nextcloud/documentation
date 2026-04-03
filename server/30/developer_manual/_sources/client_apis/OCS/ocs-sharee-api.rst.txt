==============
OCS Sharee API
==============

The OCS Sharee API allows you to access the sharing API from outside over
pre-defined OCS calls.

The base URL for all calls to the share API is: ``<nextcloud_base_url>/ocs/v1.php/apps/files_sharing/api/v1``

All calls to OCS endpoints require the ``OCS-APIRequest`` header to be set to ``true``.

Search
------

Search sharees
^^^^^^^^^^^^^^

Get all sharees matching a search term.

* Syntax: /sharees
* Method: GET

* URL Arguments: search - (string) the search term
* URL Arguments: lookup - (bool) whether to search globally on the Nextcloud lookup server
* URL Arguments: perPage - (int) number of sharees per page
* URL Arguments: itemType - (string) type of share, e.g. "file"

* Result: XML with all sharees

Status codes:

* 100 - successful

Recommendation
--------------

Sharee recommendations
^^^^^^^^^^^^^^^^^^^^^^

Get sharees the sharer might want to share with.

* Syntax: /sharees_recommended
* Method: GET

* URL Arguments: itemType - (string) type of share, e.g. "file"

* Result: XML with recommended sharees

Status codes:

* 100 - successful
