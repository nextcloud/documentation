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

Translator comments
-------------------

When a string is ambiguous or contains placeholders, add a ``TRANSLATORS`` comment on the line immediately before the translatable string.
The comment is extracted by the translation tooling and shown to translators in Transifex.

**When to add one:**

- The string is ambiguous out of context (e.g. a single word with multiple meanings).
- The string contains a placeholder — explain what the placeholder will be replaced with and give an example value where helpful.
- The string describes a UI element or workflow that is not obvious from the text alone.

**PHP** — place the comment on the line before the ``->t()`` call:

.. code-block:: php

   // TRANSLATORS The placeholder refers to the software product name, e.g. "Add to your Nextcloud"
   $l->t('Add to your %s', [$productName]);

**JavaScript / TypeScript** — same rule, line before the ``t()`` call:

.. code-block:: javascript

   // TRANSLATORS: This is the number of hidden files or folders
   const hiddenSummary = n('files', '%n hidden', '%n hidden', hidden)

   // TRANSLATORS: {relativeDueDate} will be replaced with a relative time, e.g. "2 hours ago" or "in 3 days"
   t('files_reminders', 'We will remind you of this file {relativeDueDate}', { relativeDueDate })

**Vue template** — use an HTML comment on the line above the element:

.. code-block:: html

   <!-- TRANSLATORS: Background using a single color -->
   <span>{{ t('theming', 'Plain background') }}</span>

In the ``<script>`` block of a Vue file, use the same ``//`` style as JavaScript.

**Multi-line** — use when the context needs more than one sentence or lists example output:

.. code-block:: php

   // TRANSLATORS
   // Indicates when a calendar event will happen, shown on invitation emails.
   // Output example: "In 1 hour on July 1, 2024 for the entire day"
   $l->t('In %1$s on %2$s for the entire day', [$relativeTime, $date]);

Keep comments factual and brief. State what the placeholder contains and where the string appears. Do not repeat the string itself.

Translatable strings
--------------------

For implementation details on marking strings as translatable in PHP, JavaScript, and Vue, see :doc:`../basics/translations`.
