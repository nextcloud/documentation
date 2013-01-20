.. _translation:

Translation
===========

Make text translatable
----------------------

In HTML or PHP wrap it like this <?php echo $l->t('This is some text');?>
For the right date format use <?php echo $l->l('date', time());?>.  Change the way dates are shown by editing /core/l10n/l10n-[lang].php
To translate text in javascript use:  t('appname','text to translate');

You shall never split sentences!
--------------------------------

Reason:
~~~~~~~

Translators lose the context and they have no chance to possible re-arrange words.

Example:
~~~~~~~~

.. code-block:: php

  <?php echo $l->t('Select file from') . ' '; ?><a href='#' id="browselink"><?php echo $l->t('local filesystem');?></a><?php echo $l->t(' or '); ?><a href='#' id="cloudlink"><?php echo $l->t('cloud');?></a>

Translators will translate:
~~~~~~~~~~~~~~~~~~~~~~~~~~~

* Select file from
* local filesystem
* ' or "
* cloud

By translating these individual strings for sure the case will be lost of local filesystem and cloud. The two white spaces with the or will get lost while translating as well.

Html on translation string:
~~~~~~~~~~~~~~~~~~~~~~~~~~~

Html tags in translation strings is ugly but usually translators can handle this.

What about variable in the strings?
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

In case you need to add variables to the translation strings do it like that:

.. code-block:: php

  $l->t('%s is available. Get <a href="%s">more information</a>',array($data['versionstring'], $data['web']));

Automated synchronization of translations
-----------------------------------------

Multiple nightly jobs have been setup in order to synchronize translations - it's a multi-step process:
``perl l10n.pl read`` will rescan all php and javascript files and generate the templates.
The templates are pushed to `Transifex`_ (tx push -s).
All translations are pulled from `Transifex`_ (tx pull -a).
``perl l10n.pl write`` will write the php files containing the translations.
Finally the changes are pushed to git.

Please follow the steps below to add translation support to your app:
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Create a folder ``l10n``.
Create the file ``ignorelist`` which can contain files which shall not be scanned during step 4.
Edit ``l10n/.tx/config`` and copy/past a config section and adopt it by changing the app/folder name.
Run ``perl l10n.pl read`` with l10n
Add the newly created translation template (l10n/Templates/<appname>.pot) to git and commit the changes above.
After the next nightly sync job a new resource will appear on Transifex and from now on every night the latest translations will arrive.

Translation sync jobs:
~~~~~~~~~~~~~~~~~~~~~~

http://ci.tmit.eu/job/ownCloud-core-tx/
http://ci.tmit.eu/job/ownCloud-apps-tx/
http://ci.tmit.eu/job/ownCloud-Mirall-tx/
 
**Caution: information below is in general not needed!**

Manual quick translation update:
--------------------------------

.. code-block:: bash

  cd l10n/ && perl l10n.pl read && tx push -s && tx pull -a && perl l10n.pl write && cd ..

The translation script requires Locale::PO, installable via ``apt-get install liblocale-po-perl``

Configure transifex
-------------------

.. code-block:: bash

  tx init
  
  for resource in calendar contacts core files media gallery settings
  do
  tx set --auto-local -r owncloud.$resource "<lang>/$resource.po" --source-language=en \
   --source-file "templates/$resource.pot" --execute
  done

.. _Transifex: https://www.transifex.net/projects/p/owncloud/
