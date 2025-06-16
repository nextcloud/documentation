=============================
CSS and HTML coding standards
=============================

HTML
----

- HTML should be HTML5 compliant
- Avoid more than one tag per line
- Always indent blocks
- Try to avoid IDs instead prefer classes.

**DO**

.. code-block:: html

	<button>
		<span class="icon icon-close"></span>
		Close
	</button>

**DON'T**

.. code-block:: html

	<button><span class="icon icon-close"></span>Close</button>

CSS
---

- Do not bind your CSS too much to your HTML structure.
- Try to avoid using IDs and tags for query selectors, but use classes.
- Try to make your CSS reusable by grouping common attributes into classes.
- Take a look at the `Writing Tactical CSS & HTML <https://www.youtube.com/watch?v=hou2wJCh3XE&feature=plcp>`_ video on YouTube.

**DO**:

.. code-block:: css

  .list {
      list-style-type: none;
  }

  .list > .list__item {
      display: inline-block;
  }

  .important_list_item {
      color: red;
  }

**DON'T**:

.. code-block:: css

  #content .myHeader ul {
      list-style-type: none;
  }

  #content .myHeader ul li.list_item {
      color: red;
      display: inline-block;
  }

Naming convention
^^^^^^^^^^^^^^^^^

We recommend to use the BEM (Block-Element-Modifier) naming convention for CSS classes.
BEM helps with making CSS reusable and better maintainable, especially when using pre-processors like SASS.

**DO**:

.. code-block:: css

  .button {
      background-color: var(--color-main-background);
  }

  .button--primary {
      background-color: var(--color-primary);
  }

  .button__icon {
      width: 20px;
  }

**DON'T**:

.. code-block:: css

  button.btn {
      background-color: var(--color-main-background);
  }

  button.btn.primary {
      background-color: var(--color-primary);
  }
  button.btn span.myIcon {
      width: 20px;
  }
