==================
Confidential files
==================

The Confidential files app (``files_confidential``) classifies files automatically and marks them with a collaborative
tag. You define a list of classification labels. Each label is linked to a tag and has rules that decide when a file
gets that label: text in the document, TSCP/BAILS policy categories, or document metadata.

The app only assigns tags. To restrict, retain, or otherwise act on classified files, combine the tags with other
apps, for example :doc:`access_control` or :doc:`retention`.

Requirements
------------

* Nextcloud 33 or later.
* The PHP extensions ``dom``, ``libxml``, and ``zip``.
* To enforce access restrictions based on the assigned tags: the File Access Control app.

How it works
------------

Every time a file is created or its content changes, the app checks it against all classification labels:

1. **TSCP/BAILS categories**: a label matches if the document carries *all* category IDs configured for the label.
2. **Metadata**: a label matches if the document has *all* configured metadata keys with exactly the configured
   values.
3. **Content**: a label matches if the document text contains one of the label's keywords, built-in search
   expressions, or regular expressions. Matching is case-insensitive.

A file receives at most one classification label. If labels from different rule types match, the label that is
higher in the list wins. Use the arrows next to each label to change the order.

The app also removes any of its own tags that no longer apply. If a document is edited and no longer matches a
label, its classification tag is removed. If it now matches a different label, the tag is replaced. Tags that are
not used by a classification label are never touched.

Every change of classification is written to the audit log when the ``admin_audit`` app is enabled.

.. note::

   Files are only classified when they are written. Files that already exist when you enable the app or change the
   rules are not classified until their content changes.

Supported file types
--------------------

.. list-table::
   :header-rows: 1

   * - Rule type
     - File types
   * - Content (keywords and expressions)
     - Plain text, Markdown, CSV, HTML, PDF, ODT/OTT/OTH/ODM, DOCX/DOCM/DOTX/DOTM
   * - Metadata
     - Microsoft Word, Excel, and PowerPoint (OOXML formats such as DOCX, XLSX, PPTX, and their macro and template
       variants)
   * - TSCP/BAILS categories
     - Microsoft OOXML formats as above, and OpenDocument formats (text, spreadsheet, presentation, graphics, and
       their templates)

Content rules do not read spreadsheets and presentations, and they do not perform OCR. Scanned PDFs without a text
layer are only classified through metadata or policy rules, if at all.

Files in end-to-end encrypted folders cannot be read by the server and are therefore never classified.

Configuration
-------------

Install and enable the Confidential files app as described in :doc:`../apps_management`, then open
:menuselection:`Administration settings --> Confidential Files`.

Classification rules
^^^^^^^^^^^^^^^^^^^^

1. Click the **Add new label** button.
2. In the **Select or create tag** field, pick an existing tag or type a name to create a new one. Use restricted or
   invisible tags so that regular users cannot remove the classification.
3. Add one or more rules:

   * **… if document has TSCP policy category ID**: one or more BAILS category IDs.
   * **… or if document has all metadata values**: pairs of **Metadata key** and **Metadata value**. For OOXML files
     these are the custom document properties stored in ``docProps/custom.xml``.
   * **… or if document contains**: keywords, regular expressions, or built-in search expressions. The built-in
     expressions cover common personal data such as e-mail addresses, IBANs, credit card numbers, and several
     national ID and driver's license formats.

Changes are saved automatically. You can only add a new label once every existing label has a tag.

Importing a Business Authorization Framework policy
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Under **Business Authorization Framework**, click **Upload policy** to import a TSCP/BAILS policy in XML format.
The app creates one label for each category in the policy. Each label matches the category ID, and the category name
as a regular expression on the document content.

.. warning::

   Importing a policy replaces all existing classification labels.

After the import, assign a tag to each label. Labels without a tag have no effect.

Example: Block access to classified documents
---------------------------------------------

This example blocks access to any document that contains the word ``Confidential`` for everyone outside the ``Legal``
group.

1. In :menuselection:`Administration settings --> Confidential Files`, add a label with the restricted tag
   ``Confidential`` and the keyword ``Confidential``.
2. In :menuselection:`Administration settings --> Flow`, add a File Access Control rule with these conditions:

   * **File collaborative tag** *is* ``Confidential``
   * **User group membership** *is not member of* ``Legal``

3. Upload a document containing the word ``Confidential``. The file gets the ``Confidential`` tag, and users outside
   the ``Legal`` group can no longer open, download, or sync it.

See :doc:`access_control` for details and common pitfalls, such as public links.
