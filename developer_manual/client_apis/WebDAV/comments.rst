=========
Comments
=========

Comments have a PHP API within OCP and also via WebDAV. Here is a very basic description of the WebDAV API.

The Comments resource has an endpoint::

   remote.php/comments/($OBJECTTYPE/$OBJECTID) [/$COMMENTID]

The ObjectID endpoint accepts:

================  ============  =========================================  =============
Function          Action        URL                                        Remark
================  ============  =========================================  =============
create comment    POST          …/${entityType}/${entityId}/               in future maybe also this url with several IDs appended (== replies)
update comment     PROPPATCH    …/${entityType}/${entityId}/ ${commentId}  to update the read mark, property name: {http://owncloud.org/ns}readMarker
delete comment    DELETE        …/${entityType}/${entityId}/ ${commentId}
list comments     PROPFIND      …/${entityType}/${entityId}                The Comments Manager returns back the whole comments. *Filter restrictions (limit, offset, datetime) can not be provided with PROPFIND.*
list comments     REPORT        …/${entityType}/${entityId}                The Comments Manager returns back the whole comments. Filter restrictions (limit, offset, datetime) may be provided per request header.
================  ============  =========================================  =============

The CommentID endpoint accepts:

* PROPPATCH to update the comment
* DELETE to delete it
* PROPFIND to list all properties


Here is a full list of current properties::

    id
    parentId
    topmostParentId
    childrenCount
    verb
    actorType
    actorId
    creationDateTime
    latestChildDateTime
    objectType
    objectId
    // re-used property names are defined as constants
    self::PROPERTY_NAME_MESSAGE,
    self::PROPERTY_NAME_ACTOR_DISPLAYNAME,
    self::PROPERTY_NAME_UNREAD,
    self::PROPERTY_NAME_MENTIONS,
    self::PROPERTY_NAME_MENTION,
    self::PROPERTY_NAME_MENTION_TYPE,
    self::PROPERTY_NAME_MENTION_ID,
    self::PROPERTY_NAME_MENTION_DISPLAYNAME

For the most up-to-date list of properties, `see the code here. <https://github.com/nextcloud/server/blob/master/apps/dav/lib/Comments/CommentNode.php#L108>`_



Examples
-------

You can do a PROPFIND request this way, putting in the XML you have to send via data-binary in a local propfind.xml file:

:: 

   curl -u user:password --data-binary "@propfind.xml" -X PROPFIND -H "Content-Type: text/xml" http://nextcloud.server.com/remote.php/dav/comments/files/12

content of propfind.xml:

.. code-block:: xml

    <?xml version="1.0" encoding="utf-8" ?>
    <a:propfind xmlns:a="DAV:" xmlns:oc="http://owncloud.org/ns">
     <a:prop>
      <oc:message/>
     </a:prop>
    </a:propfind>

Example Output (using xmllint and without headers):

.. code-block:: xml
    
  <?xml version="1.0"?>
    <d:multistatus xmlns:d="DAV:" xmlns:s="http://sabredav.org/ns" xmlns:oc="http://owncloud.org/ns" xmlns:nc="http://nextcloud.org/ns">
      <d:response>
        <d:href>/nextcloud/remote.php/dav/comments/files/12/</d:href>
        <d:propstat>
          <d:prop>
            <oc:message/>
          </d:prop> --data-binary '{"message":"This is a test comment","actorType":"users","verb":"comment"}'
          <d:status>HTTP/1.1 404 Not Found</d:status>
        </d:propstat>
      </d:response>
      <d:response>
        <d:href>/nextcloud/remote.php/dav/comments/files/12/86</d:href>
        <d:propstat>
          <d:prop>
            <oc:message>this is a first test comment</oc:message>
          </d:prop>
          <d:status>HTTP/1.1 200 OK</d:status>
        </d:propstat>
      </d:response>
    </d:multistatus>

Adding a comment requires a JSON body with the comment. Here an example:

::

    curl -u user:password -X POST -H "Content-Type: application/json" --data-binary '{"message":"This is a test comment","actorType":"users","verb":"comment"}' http://nextcloud.server.com/remote.php/dav/comments/files/12


.. note::

    max length of message text is 1,000 characters.


Here is an example of updating a comment:

:: 

    curl -s  -u admin:admin -X PROPPATCH -H "Content-Type: text/xml" --data-binary "@update.xml" http://127.0.0.1/nextcloud/remote.php/dav/comments/files/12/86


update.xml contains this:

.. code-block:: xml

  <?xml version="1.0" encoding="utf-8" ?>
  <a:propertyupdate xmlns:a="DAV:" xmlns:oc="http://owncloud.org/ns">
   <a:set>
    <a:prop>
     <oc:message>update.</oc:message>
    </a:prop>
   </a:set>
  </a:propertyupdate>

When the update went well, you receive a ``200 OK`` status update back.


A delete is very simple::

    curl -s  -u admin:admin -X DELETE http://127.0.0.1/nextcloud/remote.php/dav/comments/files/12/86

If the delete failed because the comment does not exist, you get a ``404`` back, otherwise a ``204 No Content`` is returned.



More usage examples can be found in the Announcement center. For example, see the comments related files in `this JS file <https://github.com/nextcloud/announcementcenter/tree/master/js>`_ for frontend matters. Backendwise ``OCP\Comments\ICommentsManager`` is worth looking at. It was introduced `in this pull request <https://github.com/nextcloud/announcementcenter/pull/12>`_, but there are also some follow up PRs.


note::

    files also have comment related attributes (→webdav), comments-href, comments-count and comments-unread. First points to the related comments resource, the others just say how many comments were left and how many are unread.
