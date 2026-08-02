Pull request reviewer triage
=============================

Pull request reviewer triage helps prospective reviewers decide whether (or when)
to review a pull request, how much attention it may require, and whether specialist
knowledge is needed.

The triage approach should provide useful signals without creating excessive
label or documentation overhead. Labels are guidance for reviewers, not
guarantees about review duration or correctness.

Triage dimensions
-----------------

Use separate dimensions for concepts that answer different questions:

.. list-table::
   :header-rows: 1
   :widths: 20 45 35

   * - Dimension
     - Measures
     - Reviewer question
   * - Risk
     - Potential impact if the change is incorrect
     - What could happen if this change is wrong?
   * - Review effort
     - Expected active reviewer attention
     - How much time and focus might this require?
   * - Review expertise
     - Knowledge needed to review the change effectively
     - Am I the right reviewer?
   * - Size
     - Amount of code changed
     - How much code is involved?
   * - Complexity
     - Difficulty of understanding and validating the change
     - How difficult is the change to reason about?
   * - Priority
     - How soon review is wanted
     - How urgently should this be reviewed?

These dimensions are intentionally independent. For example:

* A tiny authentication change can have high risk.
* A large dependency update can have low complexity.
* A complex refactoring can have low runtime risk.
* A low-risk change can still have high priority.

Suggested minimal scheme
------------------------

.. code-block:: text

   risk: low                  green
   risk: medium               amber
   risk: high                 orange
   risk: critical             red

   review-effort: quick       blue
   review-effort: focused     dark blue
   review-effort: thorough    purple
   review-effort: deep        dark purple

Recommended core labels
-----------------------

Only the following labels should normally be required or prominently
displayed for reviewer triage:

.. code-block:: text

   ⚠️ risk: low|medium|high|critical
   ⏱️ review-effort: quick|focused|thorough|deep

Add an expertise label only when it affects reviewer selection (existing feature labels are
often sufficient as well):

.. code-block:: text

   needs-review: security
   needs-review: database
   needs-review: architecture

Size, complexity, and priority can be added when they provide useful
filtering or reporting information. They should not be required for every
pull request.

Label naming
------------

Use a consistent key/value format:

.. code-block:: text

   risk: low
   review-effort: quick
   review-expertise: specialist

This format is preferred because it:

* clearly separates the dimension from its value;
* reads naturally in the GitHub user interface;
* is easy to filter and process automatically;
* avoids implying that GitHub labels provide a real hierarchy.

Avoid mixing formats such as ``Risk/Low``, ``Risk: Low``, and
``Priority-Importance/Medium``. Label names and values should use lowercase
text, with hyphens separating words in multiword names.

Recommended values
------------------

Risk
~~~~

.. list-table::
   :header-rows: 1
   :widths: 25 75

   * - Label
     - Description
   * - ``risk: low``
     - Unlikely to cause meaningful regressions; limited runtime or
       compatibility impact.
   * - ``risk: medium``
     - Could affect user-visible behavior or a bounded subsystem; targeted
       validation is recommended.
   * - ``risk: high``
     - Significant regression, compatibility, security, data, or operational
       impact is possible.
   * - ``risk: critical``
     - Could cause severe security, data-loss, outage, or widespread
       compatibility consequences.

Risk measures the potential impact if a change is wrong. It does not measure
the size of the diff or the effort required to review it.

Review effort
~~~~~~~~~~~~~

.. list-table::
   :header-rows: 1
   :widths: 30 70

   * - Label
     - Description
   * - ``review-effort: quick``
     - Can usually be reviewed from the diff and nearby context; targeted
       validation may be sufficient.
   * - ``review-effort: focused``
     - Requires tracing relevant code paths and checking tests or behavior in
       one subsystem.
   * - ``review-effort: thorough``
     - Requires cross-file or cross-component analysis and broader test or
       compatibility review.
   * - ``review-effort: deep``
     - Requires substantial architectural, security, migration, performance,
       or operational analysis.

Review effort describes active reviewer work. It does not predict queue time,
CI duration, or the total calendar time before a pull request is reviewed.

Review expertise
~~~~~~~~~~~~~~~~

Use ``review-expertise: specialist`` or a more specific ``needs-review:``
label only when specialist knowledge materially improves the review.

.. list-table::
   :header-rows: 1
   :widths: 35 65

   * - Label
     - Description
   * - ``review-expertise: general``
     - A reviewer familiar with the project and language should be able to
       review the change.
   * - ``review-expertise: specialist``
     - Review benefits from focused knowledge of the affected subsystem or
       technology.
   * - ``needs-review: security``
     - Include a reviewer with relevant security expertise.
   * - ``needs-review: database``
     - Include a reviewer familiar with schema, query, or migration behavior.
   * - ``needs-review: architecture``
     - Include a reviewer familiar with project-wide design and compatibility
       constraints.

``review-expertise: general`` is normally the default and does not need to be
shown unless expertise is an explicit part of the review assignment.

Optional dimensions
-------------------

Size
~~~~

.. list-table::
   :header-rows: 1
   :widths: 25 75

   * - Label
     - Description
   * - ``size: tiny``
     - Minimal, localized change; typically a few lines or one small file.
   * - ``size: small``
     - Limited change affecting a small number of files or one focused area.
   * - ``size: medium``
     - Moderate change requiring review across several files or a subsystem.
   * - ``size: large``
     - Broad change affecting many files, workflows, or components.
   * - ``size: xl``
     - Very large change that should usually be split or reviewed in stages.

Size may be calculated automatically from changed files and lines. It is often
redundant in the PR body because GitHub already displays the diff size.

Complexity
~~~~~~~~~~

.. list-table::
   :header-rows: 1
   :widths: 30 70

   * - Label
     - Description
   * - ``complexity: trivial``
     - Intent and correctness are apparent with minimal contextual analysis.
   * - ``complexity: simple``
     - Straightforward logic with limited interactions or edge cases.
   * - ``complexity: moderate``
     - Requires understanding multiple interactions, states, or non-obvious
       edge cases.
   * - ``complexity: complex``
     - Requires substantial reasoning about architecture, concurrency,
       compatibility, or failure modes.

Complexity is most useful when it differs from the apparent size of the
change. Do not add ``complexity: trivial`` to every tiny pull request merely
for completeness.

Priority
~~~~~~~~

.. list-table::
   :header-rows: 1
   :widths: 25 75

   * - Label
     - Description
   * - ``priority: low``
     - Valuable, but can wait behind more time-sensitive work.
   * - ``priority: normal``
     - Should receive normal review attention within the usual workflow.
   * - ``priority: high``
     - Review is important in the near term because of user, release, or
       project impact.
   * - ``priority: urgent``
     - Review should be expedited because delay has immediate or significant
       consequences.

Priority measures how soon review is wanted. It does not measure risk. A
low-risk change can be urgent, and a high-risk change can have low priority if
it is not time-sensitive.

``priority: normal`` is the default and does not need added as a label.

Avoid precise review-time labels
--------------------------------

Avoid labels such as:

.. code-block:: text

   estimated-to-review: 1m

Precise estimates imply more certainty than is justified. Actual review time
varies with:

* reviewer experience;
* familiarity with the repository and affected subsystem;
* context switching and interruptions;
* the depth of validation expected;
* CI and local test duration;
* the quality of the PR description and test evidence.

Use broad effort categories for reviewer-facing labels. If numeric estimates
are needed for internal reporting, use broad ranges instead:

.. code-block:: text

   review-effort: <=15m
   review-effort: 15-60m
   review-effort: 1-3h
   review-effort: 3h+

The ranges should be treated as approximate active effort, not commitments.

Color coding
------------

Use colors to reinforce the most actionable dimensions, especially risk. Do
not assign a bright, unrelated color to every label.

Risk should use conventional severity colors:

.. list-table::
   :header-rows: 1
   :widths: 30 30 40

   * - Label
     - Suggested color
     - Meaning
   * - ``risk: low``
     - Green (``#2DA44E``)
     - Low potential impact
   * - ``risk: medium``
     - Amber (``#D29922``)
     - Bounded but meaningful impact
   * - ``risk: high``
     - Orange (``#BC4C00``)
     - Significant potential impact
   * - ``risk: critical``
     - Red (``#CF222E``)
     - Severe potential impact

Review effort should use a separate cool-color family:

.. list-table::
   :header-rows: 1
   :widths: 35 30 35

   * - Label
     - Suggested color
     - Meaning
   * - ``review-effort: quick``
     - Blue (``#0969DA``)
     - Short, localized review
   * - ``review-effort: focused``
     - Dark blue (``#0550AE``)
     - Review of one subsystem
   * - ``review-effort: thorough``
     - Purple (``#8250DF``)
     - Cross-file or cross-component review
   * - ``review-effort: deep``
     - Dark purple (``#6639BA``)
     - Substantial specialist or architectural review

Do not use red or orange for review effort. A lengthy review is not
necessarily risky.

Keep size and other secondary dimensions neutral or subdued. Color is a
supplement to the label text and must not be the only way to distinguish
values. The scheme should remain understandable to users with color-vision
deficiencies and in interfaces where colors are not displayed.

Emoji and reviewer-facing summaries
------------------------------------

Emoji can improve scanability in a generated PR summary. Use one emoji per
category rather than repeating the pull-request symbol for every label.

Suggested category emoji:

.. list-table::
   :header-rows: 1
   :widths: 30 20 50

   * - Category
     - Emoji
     - Meaning
   * - Risk
     - ``⚠️``
     - Potential impact
   * - Review effort
     - ``⏱️``
     - Reviewer attention
   * - Expertise
     - ``🧠``
     - Knowledge required
   * - Size
     - ``📏``
     - Amount of change
   * - Complexity
     - ``🧩``
     - Difficulty of understanding
   * - Priority
     - ``🚦``
     - Urgency

The ``🔀`` emoji can represent a pull request or merge flow, but it is best
used once as a heading:

.. code-block:: markdown

   **🔀 Review triage:** ⚠️ Risk: Low · ⏱️ Effort: Quick

Do not repeat ``🔀`` in every label. The actual GitHub labels should remain
machine-friendly:

.. code-block:: text

   risk: low
   review-effort: quick

Avoiding label fatigue
----------------------

Label fatigue occurs when contributors and reviewers must interpret too many
labels, or when multiple labels communicate nearly the same information.

Use the following principles:

* Keep the prominent reviewer-facing set to two or three labels.
* Prefer labels that change the decision to review or assign a reviewer.
* Do not require labels that duplicate information already visible in GitHub.
* Add specialist labels only when specialist knowledge is actually needed.
* Automate objective labels such as size and affected area where practical.
* Use a controlled vocabulary and document its meaning.
* Avoid creating a full matrix of size, risk, complexity, priority, and effort
  for every pull request.
* Use progressive disclosure: show the most useful information first and keep
  secondary metadata available for filtering or reporting.

For most pull requests, the following is sufficient (with specific risk and effort levels adjusted as deemed appropriate by the PR creator or PR triager):

.. code-block:: text

   ⚠️ risk: low
   ⏱️ review-effort: quick

PR description structure
------------------------

The PR description should answer four questions:

#. What changed?
#. Why did it change?
#. Is there anything specific reviewers should consider?
#. How was it tested?

The amount of prose should be proportional to the change. A tiny, localized
test change does not need a detailed review plan. Larger or riskier changes
benefit from additional scope, review-focus, and validation sections.

A concise example is:

.. code-block:: markdown

   **🔀 Review triage:** ⚠️ Risk: Low · ⏱️ Effort: Quick

   ## Summary

   Ensure `testFindWebRootCli()` restores `\OC::$CLI` even when an unexpected
   exception occurs, and correct the PHPUnit assertion argument order.

   No production code changes.

   ## Testing

   Existing `testFindWebRootCli()` data-provider coverage is unchanged.

For a larger change, add sections such as:

.. code-block:: markdown

   ## Scope

   - Affected components
   - Production and test files changed
   - Compatibility or migration impact

   ## Review focus

   - Important behavior or failure modes to check
   - Areas requiring specialist attention

   ## Testing

   - Targeted tests
   - Integration or acceptance tests
   - Known limitations

Avoid adding a detailed ``Review focus`` section to a trivial change when the
diff and summary already make the intended review clear.

Required repository process
---------------------------

Project-required boilerplate should remain separate from reviewer triage. This
may include:

* security disclosure instructions;
* contributor license or sign-off requirements;
* formatting and linting checks;
* test checklists;
* documentation requirements;
* backport requests;
* labels and milestones;
* AI disclosure.

Such content may be required even when it does not help reviewers decide
whether to review the change. Where possible, templates or automation should
hide, prefill, or mark irrelevant items as not applicable.

Example classification
----------------------

Real-world example: https://github.com/nextcloud/server/pull/62772

A test-only pull request that changes one file and adds exception-safe
restoration of global state could use:

.. code-block:: text

   ⚠️ risk: low
   ⏱️ review-effort: quick

Its PR description might summarize the change as:

.. code-block:: text

   Restores global state in a ``finally`` block and corrects PHPUnit assertion argument order.

   No production code changes.

   Related production code: [`Setup::findWebRoot()`](https://github.com/nextcloud/server/blob/2878e339366db50c06574ec8e6e76c58a9459405/lib/private/Setup.php#L519-L540)

                                                     
This communicates the key reviewer decision without claiming that every
reviewer will spend exactly the same amount of time.
