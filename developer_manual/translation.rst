Translation
===========

.. sectionauthor:: Bernhard Posselt <nukeawhale@gmail.com>

In PHP
------

.. code-block:: php

  <?php

  $l = \OC_L10N::get('appname');
  $text = $l->t('This is some text');  


For the right date format use:

.. code-block:: php
  
  <?php

  $text = $l->l('date', time());

  ?>

Change the way dates are shown by editing :file:`/core/l10n/l10n-[lang].php`


In templates
------------
Use:

.. code-block:: php

  <?php p($l->t('This is some text')); ?>


In JavaScript
-------------
.. note:: Try to avoid using it in JavaScript because the client will perform an AJAX request to get the translation once it's accessed and that will hang the UI. It's better to put your code into hidden HTML.

If you still want to use it though, use:

.. code-block:: javascript

  t('appname', 'text to translate');


Never split sentences!
----------------------

.. warning:: Translators loose the context and they have no chance to possible re-arrange words.

**DONT**:

.. code-block:: php

  <?php p($l->t('Select file from')) . ' '; ?>

  <a href='#' id="browselink"><?php p($l->t('local filesystem'));?></a>
  
  <?php p($l->t(' or ')); ?>
  
  <a href='#' id="cloudlink"><?php p($l->t('cloud'));?></a>


Will translate to::

  Select file from
  local filesystem
  ' or '
  cloud

.. warning:: Whitespaces before or after the line will likely get lost in translation

**DO**:

.. code-block:: php

  <?php 
  p($l->t('%s is available. Get <a href="%s">more information</a>',
        array($versionstring, $url)
    )
  );
  ?>

Automated synchronization of translations
-----------------------------------------

Multiple nightly jobs have been setup in order to synchronize translations – it's a multi-step process:

1. 'perl l10n.pl read' will rescan all php and javascript files and generate the templates.
2. The templates are pushed to Transifex (tx push -s).
3. All translations are pulled from Transifex (tx pull -a).
4. 'perl l10n.pl write' will write the php files containing the translations.
5. Finally the changes are pushed to git.

Please follow the steps below to add translation support to your app:

1. Create a folder 'l10n'.
2. Create the file 'ignorelist' which can contain files which shall not be scanned during step 4.
3. Edit :file:`l10n/.tx/config` and copy/past a config section and adopt it by changing the app/folder name.
4. Run 'perl l10n.pl read' with l10n
5. Add the newly created translation template (l10n/Templates/<appname>.pot) to git and commit the changes above.

After the next nightly sync job a new resource will appear on Transifex and from now on every night the latest translations will arrive.

Translation sync jobs
^^^^^^^^^^^^^^^^^^^^^
* http://ci.tmit.eu/job/ownCloud-core-tx/
* http://ci.tmit.eu/job/ownCloud-apps-tx/
* http://ci.tmit.eu/job/ownCloud-Mirall-tx/

Manual quick translation update
-------------------------------

.. warning:: The information below is in general not needed !

::

  cd l10n/ && perl l10n.pl read && tx push -s && tx pull -a && perl l10n.pl write && cd ..

The translation script requires Locale::PO, installable via::

  apt-get install liblocale-po-perl

Configure transifex
^^^^^^^^^^^^^^^^^^^

::

  tx init
  for resource in calendar contacts core files media gallery settings
  do
    tx set --auto-local -r owncloud.$resource "<lang>/$resource.po" --source-language=en --source-file "templates/$resource.pot" --execute
  done