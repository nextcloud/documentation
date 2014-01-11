Documents
=========

Document editing is one of the new features in ownCloud 6. With this app, multiple users
can edit rich-text simultaneously. The documents can be created from within the
web-interface or existing documents can be uploaded. Sharing and editing can be done
securely in the browser and be shared inside ownCloud or via a public link. User that
have an account on the same server can be invited or public invitations can also be
sent be email. The editing works on top of normal ODF files that are stored in ownCloud.

The main interface
------------------

.. figure:: images/oc_documents.png

Create/Upload a Document
~~~~~~~~~~~~~~~~~~~~~~~~

In the documents application, click on the respective buttons to create or upload a document into your ownCloud. The *New document* button will create a document named "New document.odt". The extension ODT is an OpenDocument format, which many major office applications let you create/edit/view.

The *Upload* button allows you to upload any kind of document, but currently you can only edit ODT files within ownCloud.

Edit a Document
~~~~~~~~~~~~~~~

If ownCloud contains at least one ODT file, you can immediately start editing by clicking on
the file within the documents app. Clicking on documents in files app will only display it. Below, you
can see editing a newly created document file:

.. figure:: images/oc_documents_edit.png

Here is the explanation of each field in the image shown above:

#. Clicking on the file name allows you to change filename.
#. Allows you to share the document to public, specific users or groups. Will be explained in detail in :ref:`Share a document <share-a-document>` section.
#. Formatting toolbar lets you change text styles.
#. Zoom in/out
#. Close document by saving changes
#. Users currently editing this document

Collaboratively Editing a Document
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

To edit a file collaboratively, it needs to be shared with at least one user by using the *Share* button. When multiple uses have permission to edit a document, they will be able to edit it at the same time. The cursor of all editing users will be the same color as the border color of their user picture.

.. figure:: images/oc_documents_col_edit.png

If a user is not a local user (e.g accessing the file using public link), he/she will be shown as guest in user list and they will type a nickname before editing.


Delete a Document
~~~~~~~~~~~~~~~~~

A document can be deleted using the files app and following the same procedure as for other file types. Clicking on the cross icon deletes the selected document.

.. _share-a-document:

Share a Document
~~~~~~~~~~~~~~~~

Document sharing has the same options as when sharing other files. While editing a document, you can use the *Share* button to enable other users to edit the document. This button will display all available options to share:

.. figure:: images/oc_documents_share.png

By default, you can enter local users or groups to share with. Checking *Share link* will enable sharing via a public link, for which you can set a password to prevent editing by unwanted users. Shares can also have an expiration date that will expire the link after a given date. ownCloud will send the public link to users by email by typing each email address into the email field.  Separate multiple email addresses with a space.

To see all of the features of the ownCloud document app, watch the
`video on YouTube <https://www.youtube.com/watch?v=70pCBnNPdew>`_.
