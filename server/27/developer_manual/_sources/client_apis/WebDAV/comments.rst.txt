########
Comments
########

Comments have a PHP API within OCP and also via WebDAV. Basic documentation below.


Endpoint
^^^^^^^^

The Comments resource has an endpoint:

```
remote.php/comments/$OBJECTTYPE/$OBJECTID [/$COMMENTID]
```

The `ObjectID` endpoint accepts:
* `POST` for creating a comment
* `PROPFIND` to list comments, and also the read mark. You need to specify
attributes in the request.
* `PROPPATCH` to update the read mark, property name:
{http://owncloud.org/ns}readMarker
* `REPORT` to search comments

The `CommentID` endpoint accepts:
* `PROPPATCH` to update the comment
* `DELETE` to delete it
* `PROPFIND` to list all properties

For a list of properties, see:
`https://github.com/nextcloud/server/blob/master/apps/dav/lib/Comments/CommentNode.php#L108`

Examples
********

REPORT request::

  curl -u user:pwd -i --data-binary "@report.xml" -X REPORT -H "Content-Type: text/xml" http://test.nextcloud.bla/master/remote.php/dav/comments/files/2156

report.xml your receive:

.. code-block:: xml

    <?xml version="1.0" encoding="utf-8" ?>
    <D:report xmlns:D="DAV:" xmlns:oc="http://owncloud.org/ns" >
      <oc:limit>5</oc:limit>
      <oc:offset>0</oc:offset>
      <oc:datetime>2016-01-18 22:10:30</oc:datetime>
    </D:report>


Example Output (without headers):

.. code-block:: xml

  <?xml version="1.0"?>
  <d:multistatus xmlns:d="DAV:" xmlns:s="http://sabredav.org/ns" xmlns:cal="urn:ietf:params:xml:ns:caldav" xmlns:cs="http://calendarserver.org/ns/" xmlns:card="urn:ietf:params:xml:ns:carddav" xmlns:oc="http://owncloud.org/ns">
   <d:response>
    <oc:comment>
     <oc:id>3</oc:id>
     <oc:parentId>0</oc:parentId>
     <oc:topmostParentId>0</oc:topmostParentId>
     <oc:childrenCount>0</oc:childrenCount>
     <oc:message>first</oc:message>
     <oc:verb>comment</oc:verb>
     <oc:actorType>users</oc:actorType>
     <oc:actorId>master</oc:actorId>
     <oc:objectType>files</oc:objectType>
     <oc:objectId>2156</oc:objectId>
     <oc:creationDateTime>2016-01-18 22:01:16</oc:creationDateTime>
     <oc:latestChildDateTime>2016-01-20 14:01:24</oc:latestChildDateTime>
    </oc:comment>
   </d:response>
   <d:response>
    <oc:comment>
     <oc:id>2</oc:id>
     <oc:parentId>0</oc:parentId>
     <oc:topmostParentId>0</oc:topmostParentId>
     <oc:childrenCount>0</oc:childrenCount>
     <oc:message>first</oc:message>
     <oc:verb>comment</oc:verb>
     <oc:actorType>users</oc:actorType>
     <oc:actorId>master</oc:actorId>
     <oc:objectType>files</oc:objectType>
     <oc:objectId>2156</oc:objectId>
     <oc:creationDateTime>2016-01-18 22:01:12</oc:creationDateTime>
     <oc:latestChildDateTime>2016-01-20 14:01:24</oc:latestChildDateTime>
    </oc:comment>
   </d:response>
  </d:multistatus>

If you want a real life example of use, the announcement center has comments implemented.
See the comments related files in `https://github.com/nextcloud/announcementcenter/tree/master/js`
for frontend matters. Backendwise `OCP\Comments\ICommentsManager` is mostly close for housekeeping.
It was introduced in https://github.com/nextcloud/announcementcenter/pull/12, but
there are also some follow up PRs.


