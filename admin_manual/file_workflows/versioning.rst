=====================
Block file versioning
=====================

.. versionadded:: 34

The Versions app (``files_versions``) provides the **Block file versioning**
Flow operation. Administrators can use it to prevent new file versions from
being created when a file matches specified rules. The operation is available
for system-wide flows, not personal flows.

Configuration
-------------

In Administration settings, open Flow and add a **Block file versioning**
flow. Add at least one rule specifying which files should not be versioned.
The operation is evaluated when a new version would otherwise be created.

For example, add a **File collaborative tag** rule to block version creation
for files with a particular tag. The rule also matches files in folders with
that tag; see :ref:`available-rules-label` for details.

Effects
-------

When a flow matches, the Versions app skips creating the new version. This
does not block the file change or delete existing versions. Existing versions
remain subject to the normal version expiration rules.

.. warning::

   Changes made without creating a version cannot be recovered through that
   skipped version.

For general version retention and expiration settings, see
:doc:`../configuration_files/file_versioning`.
