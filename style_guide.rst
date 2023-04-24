=============================
Nextcloud manuals style guide
=============================

*This is a work in progress*

This is the official style guide for the Nextcloud User, Administration, and Developer manuals.

Unless otherwise specified in this guide, Nextcloud documentation adheres to the `Google developer documentation style guide <https://developers.google.com/style>`_.
Please follow these conventions for consistency, and easier proofreading and copyediting.

.. note:: Refer to the documentation `README <https://github.com/nextcloud/documentation/blob/master/README.rst>`_ for information about how to edit and build source documentation.


Tone and content
----------------

When you are writing your text, make it as literal and specific as possible.

Put yourself in the place of the person who is using Nextcloud and looking for instructions on performing a task.
Don't make her guess, but spell out every step in order, and tell her exactly what buttons to click or what form fields to fill out.

Give complete information.
For example, when configuring a timeout value be sure to say if it is in seconds or some other unit.

Say ``config.php`` rather than "the configuration file".

When you are describing features of a GUI administration form use the exact literal names of buttons, form fields, and menus.
Specify if menus are dropdown, right-click, left-click, or mouseover.


Page filenames
--------------

Use lowercase filenames with underscores, for example, ``file_name_config.rst``.


Markup
------

Nextcloud uses `reStructuredText <http://docutils.sourceforge.net/rst.html>`_ markup language to format the source documentation files.

See Sphinx's `reStructuredText Primer <http://sphinx-doc.org/rest.html>`_ or one of the several `rST cheatsheets <https://github.com/ralsina/rst-cheatsheet/blob/master/rst-cheatsheet.rst>`_ available online for markup reference.


Page titles and headings
------------------------

There are many ways to markup headings and subheadings.
This is the official Nextcloud way:

* Use sentence case.
* Over and underlining must have the same length as the heading text.
* Three levels are enough.
  If you find that you want more, then re-think the organization of your text.
* Separate sections (h2) from preceding content with two blank lines for better readability.

::

    ==============
    Page title, h1
    ==============


    Section, h2
    -----------

    Subsection, h3
    ^^^^^^^^^^^^^^

This is how they render:

==============
Page title, h1
==============


Section, h2
-----------

Subsection, h3
^^^^^^^^^^^^^^


Text formatting
---------------

Line breaks
^^^^^^^^^^^

.. The maximum line length is 80 characters for normal text, but tables, deeply indented code samples and long links may extend beyond that.

Use `Semantic Line Breaks <https://sembr.org/>`_ to improve the readability and effectiveness of internationalized narrative texts managed in a version control system, namely Git.

Semantic Line Breaks are used to break up long paragraphs or sentences into smaller, more manageable chunks that are easier to read, understand, translate, and compare between versions.

This technique is also called `One sentence per line <https://asciidoctor.org/docs/asciidoc-recommended-practices/#one-sentence-per-line>`_ and, as this name suggests, consists in putting sentences on separate lines, without wrapping text at a fixed column width.

Indentation
^^^^^^^^^^^

All reStructuredText files use an indentation of 3 spaces; no tabs are allowed.

Code example bodies should use normal indentation for the corresponding language.


Lists
-----

For ordered lists, the ``#.`` notation is preferred as it eases the lists modifications by avoiding tedious renumbering when inserting or reordering list entries::

    #. First entry
    #. Second entry

Which renders as:

#. First entry
#. Second entry


GUI labels and navigation
-------------------------

Elements in a GUI configuration form are in **bold** and should be described as literally as possible so that your description matches what your reader sees on the screen.

For example, on the User listing page, describe the various elements like the following::

    * **Username** field
    * **Password** field
    * **Groups** dropdown menu
    * **Create** button
    * **Full Name** field
    * **Quota** dropdown menu

This is how they render:

* **Username** field
* **Password** field
* **Groups** dropdown menu
* **Create** button
* **Full Name** field
* **Quota** dropdown menu

.. figure:: users-config.png
    :alt: User listings and administration page.

   *Figure 1: The Nextcloud user listing and administration page.*


Code, files, and paths
----------------------

Use double-backticks for inline elements like:

* code,
* file names and paths,
* simple, short command examples,
* URL/hyperlink examples (rather than creating a live hyperlink).

For example::

    * ``maintenance:install``
    * ``sudo -u www-data php occ files:scan --help``
    * ``conf.py``
    * ``/home/user``
    * ``https://example.com``

Will render as:

* ``maintenance:install``
* ``sudo -u www-data php occ files:scan --help``
* ``conf.py``
* ``/home/user``
* ``https://example.com``

Use code blocks for block elements like:

* long code excerpts,
* files and directories listings,
* commands with output examples.

For example::

    .. code-block::bash

        building [html]: targets for 298 source files that are out of date
        updating environment:
        [new config]
        298 added, 0 changed, 0 removed
        reading sources...

Renders as:

.. code-block::

    building [html]: targets for 298 source files that are out of date
    updating environment:
    [new config]
    298 added, 0 changed, 0 removed
    reading sources...


Placeholders and user-replaced values
-------------------------------------

These are the values that the users should change in commands, code samples, file paths, and other text strings for these to be relevant in their situations.

User-replaced values should be descriptive and follow this general format: ``<value_name>``. Which is:

* Enclosed in angle brackets.
* Lowercase, unless the rest of the text uses another capitalization scheme.
* Separated by underscores if multi-worded.


Images
------

Images should be in ``PNG`` format.

Use lowercase with hyphens for image names, for example, ``image-name.png``.

Keep your screenshots *focused* on the items you are describing.
When you need an image of something large like a configuration form on the Nextcloud admin page, narrow your Web browser to fold the fields into a smaller space, because a long skinny graphic is not very readable.
Think *square*.

Both images and figures must have brief and descriptive ``alt`` tags.

All figures must have *captions* with figure numbers.
Sphinx rST markup does not have a tag for figure numbers, so you must use the caption element to add it manually.
You may use simple numbering like "Figure 1, Figure 2", or add a caption. 
Captions must follow a blank line and be italicized, like this example::

    .. figure:: images/users-config.png
        :alt: User listings and administration page.
        
        *Figure 1: The Nextcloud user listing and administration page.*

Images must go into a sub-directory of the directory containing your manual page.
Currently, the manuals have both a single master images directory and image directories local to each chapter.
A single master images directory is difficult to maintain and inevitably becomes cluttered with obsolete images.
Eventually, the single master directories will be gone.

.. TODO: Style guide: Admonitions

Spelling and Capitalization Conventions
---------------------------------------

As this grows it may be moved to its own page.

* Nextcloud App Store
* synchronize
* Web (Web page, Web site)
