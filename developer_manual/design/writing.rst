.. _ux-writing:

=============
Writing guide
=============

Consistent, concise wording makes Nextcloud easier to use and easier to translate.
Follow these rules when writing any user-facing string: notifications, dialog messages, button labels, error text, tooltips.

General rules
-------------

**Keep messages short.** One idea per sentence. Cut every word that does not add meaning.

**Write Nextcloud correctly.** Always spell it ``Nextcloud`` — capital N, lowercase c.
Do not write ``NextCloud``, ``nextcloud``, or abbreviate it as ``Nc``.

**Use sentence case.** Capitalize only the first word and proper nouns.
Never use all uppercase for headings, labels, or tags.

.. list-table::
   :header-rows: 1
   :widths: 50 50

   * - Avoid
     - Prefer
   * - Settings Saved Successfully
     - Settings saved
   * - An Error Has Occurred While Loading The File
     - Could not load the file
   * - Your changes have been successfully applied to the system
     - Changes saved
   * - SHARE
     - Share
   * - NextCloud
     - Nextcloud

**Drop "successfully".** If an action completed, the result speaks for itself.
State what happened, not that it happened without error.

.. list-table::
   :header-rows: 1
   :widths: 50 50

   * - Avoid
     - Prefer
   * - Settings saved successfully
     - Settings saved
   * - User created successfully
     - User created
   * - File uploaded successfully
     - File uploaded

**Be specific in error messages.** Tell users what went wrong and, where possible, what to do next.

.. list-table::
   :header-rows: 1
   :widths: 50 50

   * - Avoid
     - Prefer
   * - An error occurred
     - Could not save settings. Check your connection and try again.
   * - Invalid input
     - Password must be at least 8 characters

**Avoid technical jargon** unless the audience is explicitly technical (e.g. a developer-facing admin panel).
Use plain language for anything end users see.

Tone
----

- **Friendly, not chatty.** Write like a knowledgeable colleague, not a marketing brochure.
- **Direct, not bossy.** Prefer statements over commands in status messages.
- **Neutral, not emotional.** Avoid exclamation marks in status or error text.

.. list-table::
   :header-rows: 1
   :widths: 50 50

   * - Avoid
     - Prefer
   * - Great! Your profile has been updated!
     - Profile updated
   * - Oops! Something went wrong!
     - Could not complete the request

Names, pronouns, and gender
---------------------------

**Use full names** when addressing users. A full name is less ambiguous and more respectful than a first name alone.

**Avoid possessive pronouns** where possible. Replace ``my`` and ``your`` with a more descriptive word.
Where a pronoun cannot be avoided, prefer ``your`` over ``my``.

**Use gender-neutral language.** Refer to people with ``they``/``them`` rather than ``he``/``she``
when gender is unknown. For additional guidance and language-specific examples, see the
`International guide to gender-inclusive writing <https://uxcontent.com/the-international-guide-to-gender-inclusive-writing/>`_.

.. list-table::
   :header-rows: 1
   :widths: 50 50

   * - Avoid
     - Prefer
   * - Hello, Christine
     - Hello, Christine Schott
   * - My files
     - Personal files
   * - Alex raised his hand
     - Alex raised their hand

Button and action labels
------------------------

Use **verb + noun** for buttons that trigger an action. The noun can be omitted when context makes it obvious.
For destructive actions use the specific verb so users know exactly what will happen: **Delete**, **Remove**, **Revoke** — not **Confirm** or **OK**.

.. list-table::
   :header-rows: 1
   :widths: 50 50

   * - Avoid
     - Prefer
   * - OK
     - Save settings
   * - Submit
     - Create account
   * - Yes
     - Delete file
   * - Confirm
     - Delete file

Placeholders and variables
--------------------------

When a string contains a variable (file name, user name, count), keep the surrounding text short and natural.
Make sure the string still makes sense in all languages — word order differs across languages, so avoid splitting a sentence across two separate strings.
For implementation details and code examples, see :ref:`improving-translations` in the translations reference.

.. _translator-comments:

Translator comments
-------------------

When a string is ambiguous or contains placeholders, add a ``TRANSLATORS`` comment immediately before the translatable call.
The comment is extracted by the translation tooling and shown to translators in Transifex.

Add one when:

- The string is ambiguous out of context (e.g. a single word with multiple meanings).
- The string contains a placeholder — explain what it will be replaced with and give an example value.
- The string describes a UI element or workflow that is not obvious from the text alone.

Keep comments factual and brief. State what the placeholder contains and where the string appears.
Do not repeat the string itself.

For syntax examples in PHP, JavaScript, Vue, and other platforms, see :ref:`Hints`.

Translatable strings
--------------------

For implementation details on marking strings as translatable in PHP, JavaScript, and Vue, see :doc:`../basics/translations`.
