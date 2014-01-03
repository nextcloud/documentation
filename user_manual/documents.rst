Documents
=========

Document editing is one of the new features in ownCloud 6. With this app, multiple users
can edit a rich-text simultaneously. The documents can be created from within the
web-interface or existing documents can be uploaded. Sharing and editing can be done
securely in the browser and be shared inside ownCloud or via a public link. User that
have an account on the same server can be invited or public invitations can also be
sent be email. The editing works on top of normal ODF files that are stored in ownCloud.

The main interface
------------------

.. figure:: images/oc_documents.png

Create/Upload a document
~~~~~~~~~~~~~~~~~~~~~~~~

In documents application, click on appropriate buttons to create or upload a document into your ownCloud. *New document* button will create a document named "New document.odt". The extension ODT is an OpenDocument format which many major office applications let you create/edit/view.

Upload button allows you to upload any kind of documents, but currently you can only edit ODT files using ownCloud.

Edit a document
~~~~~~~~~~~~~~~

If you have at least one ODT file in your ownCloud, you can immediately start editing by clicking on
the file in documents app. Clicking on documents in files app will only display it. Below, you
can see editing a newly created document file:

.. figure:: images/oc_documents_edit.png

Here is the explanation of each field in the image shown above:

#. Clicking on the file name allows you to change filename.
#. Allows you to share the document to public, specific users or groups. Will be explained in detail in :ref:`Share a document <share-a-document>` section.
#. Formatting toolbar lets you change text styles.
#. Zoom in/out
#. Close document by saving changes
#. Users who currently editing this document

Collaboratively editing a document
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

To edit a file collaboratively, it needs to be shared with at least one user by using *Share* button. When a user had the permission to edit the document, he/she will be able to edit it at the same time with you. The cursor of the users will be the same color as the border color of their user picture.

.. figure:: images/oc_documents_col_edit.png

If a user is not a local user (e.g accessing the file using public link), he/she will be shown as guest in user list and they will type a nickname before editing.


Delete a document
~~~~~~~~~~~~~~~~~

A document can be deleted by using files app and following the same procedure as the other files. Using the cross icon deletes the selected document.

.. _share-a-document:

Share a document
~~~~~~~~~~~~~~~~

Document sharing has the same options as sharing other files with other users. While editing the document, you can use *Share* button to enable editing the document by another users. This button will display all available options to share:

.. figure:: images/oc_documents_share.png

By default, you can enter local users or groups to share with. Clicking on *Share link* will enable public share then which you can set a password to protect editing from unwanted users. Shares can also have an expiration date which will expire the link after given date. The public link can be sent to multiple users by email by typing email addresses seperated with space into email field.

To see all features of ownCloud document app, you can watch the video below:

.. raw:: html

        <iframe width="420" height="315" src="http://www.youtube.com/embed/70pCBnNPdew" frameborder="0" allowfullscreen></iframe>
