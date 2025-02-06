======================
OCS FullTextSearch API
======================

.. versionadded:: 27

FullTextSearch includes an OCS API to index the content of your Nextcloud into an external search engine.


Concept overview
----------------

Because your structure might already host its own search engine, the FullTextSearch apps provide an OCS API to helps you index your users' content and maintain an up-to-date index.
The OCS API will allow your script to:

* returns a list of not indexed, or freshly updated, document from Nextcloud,
* extract content from document,
* update internal index once a document have been indexed on your external search engine,


First steps
-----------

Installing the apps
^^^^^^^^^^^^^^^^^^^

On top of the `fulltextsearch` app, at least one content provider needs to be installed on the Nextcloud; meaning that a minimum of 2 apps have to be installed before using this feature:

.. code-block:: console

   $ ./occ app:enable fulltextsearch files_fulltextsearch


Initializing the collection
^^^^^^^^^^^^^^^^^^^^^^^^^^^

Using `occ`, create a new collection that will be used to sync the content indexed on the external search engine with the current content of the Nextcloud.

.. code-block:: console

   $ ./occ fulltextsearch:collection:init test

.. note: `test` will be the name of the collection used in all example from this page.


Linking a collection to a user account
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

By default this API can only be used with an admin account but, for security reason, you can choose to link a non-admin account and use this account when requesting the API.

.. code-block:: console

   $ ./occ fulltextsearch:collection:link test user1

.. note: Keep in mind that the linked account will have access to the content of all documents of the Nextcloud through the API


Using the collection OCS API
----------------------------

Once the collection have been initialized, the normal uses of this API implies that your script:

- make an OCS request to retrieve a list of document that have been created, modified and shared,
- make OCS requests to get the content for the documents from the list,
- index the content on your search engine and make an OCS request to confirm it,
- returns to first step until the list of document is empty,

.. note: This process should be executed from time to time on a schedule of your choice to keep your index up to date for each freshly created, moved, deleted, modified and/or shared a new entry will be added to the list of documents



Retrieving the list of document to be (re-)indexed
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

The endpoint to get this list is:

``/ocs/v2.php/apps/fulltextsearch/collection/<collection_name>/index``

.. code-block:: console

	$ curl -X GET "https://cloud.example.net/ocs/v2.php/apps/fulltextsearch/collection/test/index?format=json&length=50" -H "OCS-APIRequest: true" -u "admin:password"
	{
		"ocs": {
			"meta": {
				"status": "ok",
				"statuscode": 200,
				"message": "OK"
			},
			"data": [
				{
					"url": "https://cloud.example.net/ocs/v2.php/apps/fulltextsearch/collection/test/document/files/597996",
					"status": 28
				}
			]
		}
	}

Details about the response:

- ``url`` is the link to the document,
- ``status`` is a bitflag based on this list:
	* `1` => document has already been marked as indexed before,
	* `4` => meta have been modified,
	* `8` => content have been modified,
	* `16` => parts have been modified
	* `32` => document have been removed




Get data and metadata from a document
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

The endpoint to get data about a document is:

``/ocs/v2.php/apps/fulltextsearch/collection/<collection_name>/document/<provider_id>/<document_id>``

.. code-block:: console

	$ curl -X GET "https://cloud.example.net/ocs/v2.php/apps/fulltextsearch/collection/test/document/files/597996?format=json" -H "OCS-APIRequest: true" -u "admin:password"
	{
		"ocs": {
			"meta": {
				"status": "ok",
				"statuscode": 200,
				"message": "OK"
			},
			"data": {
				"id": "597996",
				"providerId": "files",
				"access": {
					"ownerId": "user1",
					"users": ['user2', 'user3'],
					"groups": ['group1'],
					"circles": [],
					"links": []
				},
				"index": {
					"ownerId": "user1",
					"providerId": "files",
					"collection": "test",
					"source": "files_local",
					"documentId": "597996",
					"lastIndex": 0,
					"errors": [],
					"errorCount": 0,
					"status": 28,
					"options": []
				},
				"title": "640-240-max.png",
				"link": "https://cloud.example.net/index.php/f/597996",
				"parts": {
					"comments": "<user3> This is a comment !"
				},
				"content": "VGhlIHF1aWNrIGJyb3duIGZveApqdW1wcyBvdmVyCnRoZSBsYXp5IGRvZy4=",
				"isContentEncoded": 1
			}
		}
	}


.. note:: If `isContentEncoded` is set to 1, content needs to be decoded

.. code-block:: console

	$ php -r "echo base64_decode('VGhlIHF1aWNrIGJyb3duIGZveApqdW1wcyBvdmVyCnRoZSBsYXp5IGRvZy4=');"
	The quick brown fox
	jumps over
	the lazy dog.




Set document as indexed
^^^^^^^^^^^^^^^^^^^^^^^

Once a document has been indexed in your external search engine, you have to notice the FullTextSearch of this action. This is done by doing a ``POST`` request on the following path:

``/ocs/v2.php/apps/fulltextsearch/collection/<collection_name>/document/<provider_id>/<document_id>/done``


.. code-block:: console

	$ curl -X POST "https://cloud.example.net/ocs/v2.php/apps/fulltextsearch/collection/test/document/files/597996/done" -H "OCS-APIRequest: true" -u "admin:password"
	{
 	 	"ocs": {
    		"meta": {
		    	"status": "ok",
    	  		"statuscode": 200,
	      		"message": "OK"
	    	},
    		"data": []
	  	}
	}

Once set as indexed, the document will only returns to the list of document to be (re-)indexed if they get modified.


Reset collection
^^^^^^^^^^^^^^^^

If needed, an endpoint is available to reset the whole index:

``/ocs/v2.php/apps/fulltextsearch/collection/<collection_name>/index``

.. code-block:: console

	$ curl -X DELETE -u "cult:cultycult" "https://cloud.example.net/ocs/v2.php/apps/fulltextsearch/collection/test/index" -H "OCS-APIRequest: true" -k
