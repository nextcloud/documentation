.. _ux-writing:

=============
Writing guide
=============

Consistent, concise wording makes Nextcloud easier to use and easier to translate.
Follow these rules when writing any user-facing string: notifications, dialog messages, button labels, error text, tooltips.

General rules
-------------

**Keep messages short.** One idea per sentence. Cut every word that does not add meaning.

**Use sentence case.** Capitalize only the first word and proper nouns.

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

Button and action labels
------------------------

Use **verb + noun** for buttons that trigger an action. The noun can be omitted when context makes it obvious.

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

For destructive actions use the specific verb so users know exactly what will happen: **Delete**, **Remove**, **Revoke** — not **Confirm** or **OK**.

Placeholders and variables
--------------------------

When a string contains a variable (file name, user name, count), keep the surrounding text short and natural.
Make sure the string still makes sense in all languages — word order differs across languages, so avoid splitting a sentence across two separate strings.

.. code-block:: php

   // Good — full sentence in one string, variable embedded
   $l->t('Shared with %s', [$userName]);

   // Avoid — concatenation breaks translation
   $l->t('Shared with ') . $userName;

Translatable strings
--------------------

For implementation details on marking strings as translatable in PHP, JavaScript, and Vue, see :doc:`../basics/translations`.
