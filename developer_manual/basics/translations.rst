.. _Translations:

============
Translations
============

.. sectionauthor:: Bernhard Posselt <dev@bernhard-posselt.com>, Kristof Hamann

Nextcloud provides mechanisms for internationalization (make an application translatable) and localization (add translations for specific languages). This section provides detailed instructions for both aspects.
In order to make your app translatable (internationalization), you should use Nextcloud's methods for translating strings. They are available for both the server-side (PHP, Templates) as well as for the client-side (JavaScript).

PHP Backend
-----------

If localized strings are used in the backend code, simply inject the ``\OCP\IL10N`` class into your service via type hinting it in the constructor. You will automatically get the language object containing the translations of your app:


.. code-block:: php

    <?php
    class AuthorService {
        public function __construct(
            private \OCP\IL10N $l,
        ) {
        }

        …
    }

Strings can then be translated in the following way:

.. code-block:: php

    <?php
    class AuthorService {

        …

        public function getLanguageCode() {
            // Get the language code of the current language
            return $this->l->getLanguageCode();
        }

        public sayHello() {
            // Simple string
            return $this->l->t('Hello');
        }

        public function getAuthorName($name) {
            // String using a parameter
            return $this->l->t('Getting author %1$s', [$name]);
        }

        public function getAuthors($count, $city) {
            // Translation with plural
            return $this->l->n(
                '%n author is currently in the city %1$s', // singular string
                '%n authors are currently in the city %1$s', // plural string
                $count, // number to decide which plural to use
                [$city] // further parameters are possible
            );
        }
    }

Language of other users
^^^^^^^^^^^^^^^^^^^^^^^

If you need to get the language of another user, e.g. to send them an email or inside a background job, there are also
the ``force_language`` and ``default_language`` configuration options to consider. To make this easier, the
``OCP\L10N\IFactory`` class comes with a ``getUserLanguage`` method:

.. code-block:: php

    <?php
    class SendEmail {
        public function __construct(
            private \OCP\L10N\IFactory $l10nFactory,
         ) {
        }

        public function send(IUser $user): void {
            $lang = $this->l10nFactory->getUserLanguage($user);
            $l = $this->l10nFactory->get('myapp', $lang);

            // …
        }


PHP Templates
-------------

In every template the global variable ``$l`` can be used to translate the strings using its methods ``t()`` and ``n()``:

.. code-block:: php

    // Simple text string
    <button><?php p($l->t('Hide')); ?></button>

    // Text with a placeholder
    <div><?php p($l->t('Show files of %1$s', [$user])); ?></div>

    // Date string
    <em><?php p($l->l('date', time())); ?></em>

JavaScript / TypeScript / Vue
-----------------------------

There are global functions ``t()`` and ``n()`` available for translating strings in javascript code.
If your app is build, you can import the translation functions from the `@nextcloud/l10n package <https://github.com/nextcloud-libraries/nextcloud-l10n>`_.
They differ a bit in terms of usage compared to php:

* First argument is the appId e.g. ``'myapp'``
* Placeholders (apart from the count in plurals) use single-mustache brackets with meaning-full descriptors.
* The parameter list is an object with the descriptors as key.

.. code-block:: js

    t('myapp', 'Hello World!');
    t('myapp', '{name} is available. Get {linkstart}more information{linkend}', {name: 'Nextcloud 16', linkstart: '<a href="...">', linkend: '</a>'});
    n('myapp', 'Import %n calendar into {collection}', 'Import %n calendars into {collection}', selectionLength, {collection: 'Nextcloud'});


ExApps (Python)
---------------

For ExApps, Python is currently only supported for automated Transifex translations.

Alongside the usual ``l10n/*.json`` and ``l10n/*.js`` files, translation source files located in ``translationfiles/<lang>/*.po`` are also included in the Transifex sync.
These ``.po`` files can be compiled into ``.mo`` files, which are typically used by the ExApp backend for runtime translations.

For more details, see :ref:`ex_app_translations_page`.


Guidelines
----------

Please also look through the following hints to improve your strings and make them better translatable by the community
and therefore improving the experience for non-english users.

Dos and Don'ts
^^^^^^^^^^^^^^

.. list-table::
   :header-rows: 1

   * - Bad
     - Good
     - Description
   * - ``´`` or ``’``
     - ``'``
     - Use ascii single quote
   * - ``Loading...``
     - ``Loading …``
     - | Use **Unicode triple-dot** character.
       | Add a **non-breaking space** before the triple-dot when trimming a sentence instead of a word.
   * - | ``Loading …``
       | (a general space ``U+0020``)
     - | ``Loading …``
       | (a non-breaking space ``U+00A0``)
     - | Only use a **non-breaking space** before the triple-dot (``U+00A0``).
   * - Don't
     - Do not
     - Using the spelled out version is easier to understand and makes translating easier.
   * - Won't
     - Will not
     - Using the spelled out version is easier to understand and makes translating easier.
   * - Can not
     - Cannot
     - Using the combined version is easier to understand and makes translating easier.
   * - id
     - ID
     - Full uppercase for shortcutting "identifier"
   * - Users
     - Accounts / People
     - Use **accounts** when you refer to a profile/entity. Use **people** when referring to humans.
   * - Admin / Administrator
     - Administration
     - | Refer to administration as a non-human organizational entity
       | instead of a single or multiple persons.
   * - Headline
     - Headline:
     - Include colons ``:`` in the translations as some languages add a space before the colon.
   * - | " Leading space"
       | "Trailing space "
     - | "No leading space"
       | "No trailing space"
     - | Leading or trailing spaces mostly indicate that strings are concatenated.
       | For translators it is often helpful to have all the content in a single translation,
       | as order and references between words and sentences might get lost otherwise.
   * - "Error:" $error
     - "Error: %s"
     - Instead of concatenating errors or part messages, make them a proper placeholder

Correct plurals
^^^^^^^^^^^^^^^

If you use a plural, you **must** also use the ``%n`` placeholder. The placeholder defines the plural and the word without the number preceding is wrong. If you don't know/have a number for your translation, e.g. because you don't know how many items are going to be selected, just use an undefined plural. They exist in every language and have one form. They do not follow the normal plural pattern.

PHP Example:

.. code-block:: php

    // BAD: Plural without count
    $title = $l->n('Import calendar', 'Import calendars', $selectionLength)
    // BETTER: Plural has count, but disrupting to read and unnecessary information
    $title = $l->n('Import %n calendar', 'Import %n calendars', $selectionLength)
    // BEST: Simple string with undefined plural not using any number in the string
    $title = $l->t('Import calendars')

Opposed to the normal placeholders in javascript, the plural number also uses the ``%n`` syntax:

JS Example:

.. code-block:: js

    /* BAD: Plural without count */
    n('myapp', 'Import calendar', 'Import calendars', selected.length)
    /* BETTER: Plural has count, but disrupting to read and unnecessary information */
    n('myapp', 'Import %n calendar', 'Import %n calendars', selected.length)
    /* BEST: Simple string with undefined plural not using any number in the string */
    t('myapp', 'Import calendars')

Improving your translations
^^^^^^^^^^^^^^^^^^^^^^^^^^^

Starting with the following example, improving it step by step:

.. code-block:: php

  <?php p($l->t('Select file from')) . ' '; ?><a href='#' id="browselink"><?php p($l->t('local filesystem'));?></a><?php p($l->t(' or ')); ?><a href='#' id="cloudlink"><?php p($l->t('cloud'));?></a>

Step 1: String split
""""""""""""""""""""

You shall **never split** sentences and **never concatenate** two translations (e.g. "Enable" and "dark mode" can not be combined to "Enable dark mode", because languages might have to use different cases)! Translators lose the context and they have no chance to possibly re-arrange words/parts as needed.

Translators will translate:

* ``Select file from``
* ``local filesystem``
* ``or`` (with leading and trailing whitespace)
* ``cloud``

Translating these individual strings results in  ``local filesystem`` and ``cloud`` losing case. The two white spaces surrounding ``or`` will get lost while translating as well. For languages that have a different grammatical order it prevents the translators from reordering the sentence components.

So the following code is a bit better, but suffers from another issue:

.. code-block:: php

  <?php p($l->t('Select file from <a href="#" id="browselink">local filesystem</a> or <a href="#" id="cloudlink">cloud</a>'));?>

Step 2: HTML Markup
"""""""""""""""""""

In this case the translators can re-arrange as they like, but have to deal with your markup and can mess it up easily. It is better to **keep the markup out** of your code, so the following translation is even better:

.. code-block:: php

  <?php p($l->t('Select file from %slocal filesystem%s or %scloud%s', ['<a href="#" id="browselink">', '</a>', '<a href="#" id="cloudlink">', '</a>']));?>

But there is one last problem with this.

Step 3: Placeholders
""""""""""""""""""""

In case the language has to turn things around, your code will still insert the parameters in the given order and they can not re-order them. To prevent this last hurdle simply **use positioned placeholders** like ``%1$s``:

.. code-block:: php

  <?php p($l->t('Select file from %1$slocal filesystem%2$s or %3$scloud%4$s', ['<a href="#" id="browselink">', '</a>', '<a href="#" id="cloudlink">', '</a>']));?>

This allows translators to have the cloudlink before the browselink in case the language is e.g. right-to-left.

.. _Hints:

Provide context hints for translators
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

In case some translation strings may be translated wrongly because they have multiple meanings.
Especially translations strings that only contain a single word often result in problems.
The most famous example in the Nextcloud code base is ``Share`` which can which can be the verb and action ``To share something`` or the noun ``A share``.
The added hints will be shown in the Transifex web-interface:

PHP
"""

.. code-block:: php

    <ul id="translations">
        <li id="add-new">
            <?php
                // TRANSLATORS Will be shown inside a popup and asks the user to add a new file
                p($l->t('Add new file'));
            ?>
        </li>
    </ul>

JavaScript / TypeScript
"""""""""""""""""""""""

.. code-block:: javascript

    // TRANSLATORS name that is appended to copied files with the same name, will be put in parenthesis and appended with a number if it is the second+ copy
    var copyNameLocalized = t('files', 'copy');

Vue
"""

This covers vue html templates in vue sfc components.
For vue js code, see the javascript section.

.. code-block:: html

    <NcActionCheckbox :checked="isRequired">
        <!-- TRANSLATORS Making this question necessary to be answered when submitting to a form -->
        {{ t('forms', 'Required') }}
    </NcActionCheckbox>

C++ (Qt) / Desktop client
"""""""""""""""""""""""""

.. code-block:: c++

    //: Example text: "Progress of sync process. Shows the currently synced filename"
    fileProgressString = tr("Syncing %1").arg(allFilenames);

Android
"""""""

.. code-block:: xml

    <!-- TRANSLATORS List of deck boards -->
    <string name="simple_boards">Boards</string>

iOS
"""

.. code-block:: swift

    /* The title on the navigation bar of the Scanning screen. */
    "wescan.scanning.title"             = "Scanning";

Adding translations
-------------------

The steps how to set up translations for an app have been moved to it's own page in the "App development" chapter: :ref:`Translation setup`

Testing translations
--------------------

You can use the query parameter ``forceLanguage`` to force a specific language for a web request (API or frontend). See :ref:`Forcing language for a given call<api-force-language>`.
