Writing Documentation for ownCloud
==================================

In order to improve ownCloud's documentation, the
documentation repository has been created. This allows
everyone to contribute. Even though or particularly
because it is now a lot easier to contribute to
documentation, it is important that everyone
obeys certain principles

1. in terms of technicalities, such as dealing with Git,
   learning reStructuredText, etc.
2. in terms of writing the actual documentation,
   i.e. writing style, choosing examples,
   structuring new texts, etc.

Getting Started with the Documentation Repository
-------------------------------------------------

You have two basic choices, editing the manual `directly
on GitHub`_, or checking out the sources. If you want to
use direct editing, please make sure to pick "stable45" (or
whatever the latest stable branch is) from the branch selector
before proceeding. If you want to check out the documentation
locally, follow these steps:

1. Check out ``git://github.com/owncloud/documentation``
2. Select the branch that you want to edit. Check out the
   ``Policy`` section to know which branch is right for you.
   Usually, it's the latest stable branch, i.e. ``git checkout stable45``
   if the latest stable ownCloud version is 4.5.
3. Find the manual you want to edit, pick the correct .rst file and
   start working. Check the next section about target audiences!
4. Run "make html" and "make latexpdf" (requires a full LaTeX installation!)
   to verify you have not broken anything.
5. Commit your work, if you have write access to ownCloud, or create a pull
   request otherwise.
6. If you have committed the work yourself, please merge the result
   into the latest branch (in this example: stable6)::

    git fetch origin
    git checkout stable6 
    git merge origin/stable5 master
    <resolve possible conflicts>
    git add <resolved conflict files>
    git commit
    git push

For editing, you will need to learn reStructuredText. It's a simple markup, but
it's usually not known by heart, contrary to e.g. HTML. Thus, I recommend printing
this `RST Cheat Sheet`_, and keep the `reStructuredText Primer`_ as well as the
`reStructuredText User Documentation`_ in your bookmarks.

Dependencies for Building the Documentation locally
---------------------------------------------------

ownCloud documentation uses Sphinx_, a Python-based documentation framework. You
will need:

* Python 2.6 or newer
* Sphinx_ for Python 2.x (usually part of any Linux distribution or in Mac-Ports)
* sphinxcontrib-phpdomain_ (install via ``pip install sphinxcontrib-phpdomain``)
* texlive-latex (for building PDFs via LaTeX). Debian users need to install texlive-latex-full.

.. _Sphinx: http://sphinx-doc.org
.. _sphinxcontrib-phpdomain: http://pypi.python.org/pypi/sphinxcontrib-phpdomain

Target Audiences
----------------

**Admin Manual**
  This does not only include professional admins, but simply everyone who wishes
  to setup an ownCloud instance. In case of doubt, make sure to let the reader
  know about your terminology, at least in the basic chapters. If you are going
  into the nitty-gritty of fail-over, load-balancing and the like, a bit more
  tech-literacy can be assumed, but try to provide helpful links nonetheless.

**User Manual**
  This manual describes the Web UI as well as other exposed functionality,
  such as WebDAV, calendar, etc. It does *not* include the ownCloud Desktop
  Client, which has its `own manual`_ embedded in its repository.

**Developers Manual**
  Be aware that, depending on the chapter, this can address people who develop
  the ownCloud core, or those who develop apps using the ownCloud framework.
  Either way, try to not assume too much knowledge, to ease the learning
  curve.

Writing Style
-------------

Documentation should be concise and to the point, maintaining a consistent
style. Here is some advise on what to watch out for when contributing.

**Know what you are writing about**
  While this sounds obvious, this poses a challenge to both novice and
  professional writers alike, because writing good documentation requires a
  solid understanding of the problem at hand. However, documentation writers
  usually only know aspects, i.e. they may be able to use the software,
  but they are not *domain experts*. It is an essential part of their job
  to get in touch with the domain experts to get the big picture, and
  then write the documentation.

  Making sure you have acquired all necessary knowledge is thus essential.
  Whenever you find yourself writing sentences like "you should know how this
  works", you are clearly skipping relevant information. This is when you
  should either try to get more information to describe the information
  properly, or at least link to a generic problem solution on an external site.
  A halfhearted documentation is not only unhelpful, it's usually frustrating.

**Be honest about what we do not cover yet**
  The only other box markup allowed in the ownCloud
  documentation is ``todo::``. If you discover imprecise our out-of-date
  documentation, add a todo marker describing what is missing, so it can be
  fixed by doc writing volunteers. Often, these make great Junior Jobs.
  However, make sure it does not become an ever-growing wish list.

**Do not try to sell the product**
  People reading the documentation are *already* showing interest and the best
  way to have them using ownCloud is to help them with their issue on a purely
  technical level. They will be put off by noisy claims that do not help them.
  You are not a copy-writer [1]_, maintain a neutral style.

**Avoid redundancy**
  Consider this part that actually used to be part of the documentation [2]_:

    Next, choose ``Basic Server Configuration``. As you obviously have guessed by
    now, this will install the basic configuration of the server.

  Not only does this force the reader to parse the anecdotal clause (which does
  not explain anything): He will either know what this option does, and thus be
  annoyed by the redundant information, or he will *not* have guessed it. This
  reader will not only take offense, but the text also does not teach him what
  a basic server configuration is, leaving him non the wiser.

**Do not write prose**
  Prefer bullet points over long textual lists for enumeration, do not try
  to write complicated grammatical constructs. It's better to provide an
  example and explain its details than describing the problem in an overly
  abstract way. You are not a poet [1]_!

**Avoid smileys/emoticons**
  They usually exhibit an actual or perceived lack of your knowledge on the
  topic:

    You should know how to configure Apache ;-)

  They can also be an attempt to inappropriately bond with the user (remember,
  they seek information, not entertainment. You are not a novelist either
  [1]_!)

    We are all too familiar with problems like these ;-)

  If you are guiding the user through a scenario, the use of "we" is
  acceptable.  ("Next, we have to pick an appropriate caching strategy"), but
  should not be overused.

**Do not use "don't"**
  For native speakers this should go without saying: Given the books formal
  nature, informal wording should not be used. This also includes other
  abbreviations such as "haven't", "shouldn't", "it's", "that's", etc.
  Instead, use "do not", "have not", "should not", "it is " "that is" etc.
  Similarly, avoid street style language, i.e. do not write "u" but "you".

**Try to address the reader directly, but do not try to bond too strongly**
  Indirection, while sometimes elegant, makes a text harder to read:

    The ``upload_max_size`` directive can be used to define an upper bound
    for the upload.

  Compare this to:

    If you want to restrict the upload, use the ``upload_max_size`` directive...

  which is a lot easier to read. Avoid the first person narration, as it easily
  creates an author vs reader scenario, like so [2]_:

    I have not installed the ``php5-intl`` extension. You might want to install it.

  This creates a subjective perspective, and - more importantly - disguises
  exactly *why* the reader might want to install it even though you did not.

**Know your reader**
  Provide documentation with a user story in mind. Try to picture situations
  in which people might most frequently consult your documentation. This has
  immediate consequences on the way you are describing things. Picture most
  Installation scenarios: in a data center, on a home NAS or in an ISP-rented
  virtual server, advising the user to check the installation by typing
  ``http://localhost/owncloud`` makes no sense. They will most likely not
  be sitting in front of the server, but test remotely, even though your
  test installation might in fact be installed locally.

**Provide examples**
  After providing a bit of theory, complex topics should always be accompanied
  by a meaningful but concise examples. An example is the ideal starting point
  for further explanation.

**Provide schematics**
  "One Picture is Worth Ten Thousand Words". The more complex the topic, the
  more people will appreciate being presented with the literal "big picture".
  Inkscape_ is a great tool for drawing and exporting schematics. It is a good
  idea to export both PDF and PNG, since PDF will go better with inside PDF.
  Let Sphinx decide which format to use by writing ``Image:: MyImage.*``

**Provide screenshots**
  Especially for end user documentation, screenshots are a vital way for
  readers to match the description with what they see on the screen.

**Use figures rather than image tags**
  Figures (``figure::``) are special environments that contain images
  and schematics, rather than ``image::``. Backends like LaTeX will be
  able to position figures in meaningful places in the PDF version.
  Use the ``:ref:`` instruction to reference them in the text. Figures
  allow for captions, use them to provide context!

**Avoid the Wall of Text**
   Make use of paragraphs. Paragraphs should be no longer than four
   sentences. More than five paragraphs in a row indicate a lack
   of examples, schematics or pictures.

**Do not overuse boxes**
  reStructuredText offers a lot of boxes: Warnings, Notes,
  etc. You can even define your own! However, this usually leads to an
  avalanche of boxes, which significantly disturbs the reading flow. Thus, only
  use the ``note::`` markup when you really want to point out odd behavior.
  Avoid ``warning::`` and other markups. the note markup should be indicative
  of something special. Otherwise, try to keep the reader in his text flow,
  e.g.:

    ... for the Apache web server, you should use a ``.htaccess`` file.
    .. note:: ``.htaccess`` files are specific to Apache and usually will not
    work on other web servers.

  this is better written as:

    ... for the Apache web server, you should use a ``.htaccess`` file.
    In case you are not using Apache, the section :ref: `Web Server Notes`
    will explain how to implement alternatives to this Apache-proprietary
    way of securing your data directory.

**Do not overuse headings**
  If you find yourself requiring fourth or fifth-level headings, you are
  probably doing something wrong. Headings are a great way to structure
  a chapter or section before you start to fill them with content, but you
  should reconsider their necessity if you find yourself nesting too much
  or if lots of headings guard a single paragraph.

**Wrap your text at 80 characters**
  This makes markup like reStructuredText a lot easier to read. Most editors have
  support for this. Given the sheer amount of preferred text editors, the most
  effective way to figure out how to set this up is an online search, which will
  reveal tips such as the answers to `this stackoverflow question`_.

**Be consistent about numbers**
  Single digits (0-9) should be written out ("In a Scenario involving two
  servers..."). For the rest, use numerals ("This solution will scale
  up to 1000 concurrent users"). However, stay consistent when you need
  use single and multi-digit numbers to refer to the same subject in a
  sentence: "This clustering solution scales up from 2 to 20 servers".
  In case of doubt, refer to the full grammar rule set on `writing
  numbers`_.

**Use title case sentences for headings**
  This means that headings should obey
  to the following rules [3]_:

1. Capitalize the first word of the title/heading and of any
   subtitle/subheading.
2. Capitalize all "major" words (nouns, verbs,
   adjectives, adverbs, and pronouns) in the title/heading, including the
   second part of hyphenated major words (e.g., Self-Report not Self-report).
3. Capitalize all words of four letters or more.

  Consider the following heading:

    *Hardening ownCloud for secure deployment*

  This should be written as:

    *Hardening ownCloud for Secure Deployment*

**Check your spelling**
  Always. No exceptions, no excuses. Everything has a built-in spell checker
  these days.

  **Check for stray and trailing spaces**
  A ``git diff`` will reveal them, as will most editors, if set up correctly. This
  page describes how to `set up vim to spot unwanted spaces`_.

**Find a human reviewer**
  This can be any person within the community, or a person familiar with the topic.
  Let them try to comprehend what you just wrote. If they don not get it, an average
  user most likely will not either. A reviewer will also spot grammar errors,
  which the spell checker can not usually catch.

  Ideally, we would even have editors. Note that an editor does a lot more than
  reviewing. He will do rewrites, style sanitation, consistency checks, etc.
  Unfortunately, we so far (at the time of writing) do not have any
  volunteering professional writers who could serve as editors, so we all need
  to make sure that at least the style is consistent. This is especially
  important when you are adding content to existing documentation.

That is it. If you are looking for further inspiration on good writing style,
check the FAQ in the next section. Thank you for improving the ownCloud
documentation.

Frequently Asked Questions
--------------------------

**What should I look at as a reference for good documentation style?**
  The `Sphinx documentation`_ itself is
  very good.  Every page has a "Show source" section that shows how it was typeset.
  Another great example is the `Subversion Book`_.

**I need to create a new chapter, should I create chapter.rst or chapter/index.rst?**
  Do not create a directory. We can still re-factor into a directory later on.
  If you are sitting on a huge pile of documentation on a single topic,
  we will be glad to assist. Please send a mail to the `ownCloud mailinglist`_

**Why not use cherry-picking from master to the stable branch?**
  Cherry-picking only works if we have someone who makes sure the cherries
  actually get picked. This also involves adjusting the documentation to
  stable45, which requires domain specific knowledge of both versions. If you
  still would like to volunteer, speak up.

**LaTeX fails to render my fancy table. What can I do to fix this?**
  Avoid overly complex tables. Complex tables should usually broken down into
  simple tables + text anyway. Remember, people might read this on their eBook
  reader! Everything with multiline columns is something that the LaTeX generator
  frowns upon. In general though, the LaTeX generator is just a lot more picky
  over a broken ASCII table art misplacement than the HTML equivalent is.
  Double-check your markup. If you really need complex tables, consider CSV
  tables.

**I have pushed changes to the documentation repo, what now?**
  `Mr Jenkins`_ will try to build HTML and PDF versions and put them online at
  the `ownCloud doc server`_. If he fails to build your version, you will
  receive a mail, please fix it or ask for help on IRC (irc.freenode.net,
  #owncloud-dev) or the `ownCloud mailinglist`_.

.. [1] For the purpose of editing this documentation anyway.
.. [2] Actual real-life example. Slightly modified to protect the innocent.
.. [3] As described on the `APA style blog`_.

.. _this stackoverflow question: http://stackoverflow.com/questions/3033423/vim-command-to-restructure-force-text-to-80-columns
.. _directly on github: https://github.com/owncloud/documentation
.. _Mr Jenkins: http://ci.owncloud.org
.. _ownCloud doc server: http://doc.owncloud.com
.. _RST Cheat Sheet: http://github.com/ralsina/rst-cheatsheet/raw/master/rst-cheatsheet.pdf
.. _reStructuredText Primer: http://sphinx-doc.org/rest.html
.. _reStructuredText User Documentation: http://docutils.sourceforge.net/rst.html
.. _own manual: https://github.com/owncloud/mirall/tree/master/doc
.. _Inkscape: http://www.inkscape.org
.. _set up vim to spot unwanted spaces: http://vim.wikia.com/wiki/Highlight_unwanted_spaces
.. _ownCloud mailinglist: mailto:owncloud@kde.org
.. _writing numbers: http://www.grammarbook.com/numbers/numbers.asp
.. _Sphinx documentation: http://sphinx-doc.org/contents.html
.. _Subversion Book: http://svnbook.red-bean.com/
.. _APA style blog: http://blog.apastyle.org/apastyle/2012/03/title-case-and-sentence-case-capitalization-in-apa-style.html
