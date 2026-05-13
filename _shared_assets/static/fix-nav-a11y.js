/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 *
 * Fix sphinx-rtd-theme navigation accessibility (BITV 9.4.1.2 / WCAG 4.1.2):
 *
 * Problem 1 — sphinx-rtd-theme prepends a <button class="toctree-expand">
 *   inside each <a> nav link. Buttons inside links are invalid HTML and break
 *   assistive technology.
 *
 * Problem 2 — the theme sets aria-expanded on <li>, <ul>, and <a> elements.
 *   The attribute belongs only on the interactive element that controls the
 *   expand/collapse action — i.e. the expand button itself.
 *
 * Fix: after the theme's own DOM-ready callback has inserted the buttons,
 * move each button to be a sibling of its <a> parent (inserted immediately
 * after it), and redirect all aria-expanded mutations from <a>/<li>/<ul> to
 * the button via MutationObserver.
 */
(function () {
  'use strict';

  /** Return the toctree-expand button that is a direct child of `li`. */
  function getExpandButton(li) {
    return li.querySelector(':scope > button.toctree-expand');
  }

  /**
   * Transfer aria-expanded from `sourceEl` to the expand button of the
   * nearest ancestor (or self) <li>.  Remove the attribute from `sourceEl`
   * so it no longer appears on an invalid element.
   */
  function transferAriaExpanded(sourceEl) {
    var val = sourceEl.getAttribute('aria-expanded');
    if (val === null) {
      return;
    }
    sourceEl.removeAttribute('aria-expanded');

    var li = sourceEl.closest('li');
    if (!li) {
      return; // top-level container element — just remove, no button to update
    }
    var btn = getExpandButton(li);
    if (btn) {
      btn.setAttribute('aria-expanded', val);
    }
  }

  /** Watch an element and call transferAriaExpanded whenever aria-expanded changes. */
  function watchAriaExpanded(el) {
    new MutationObserver(function (mutations) {
      for (var i = 0; i < mutations.length; i++) {
        if (mutations[i].attributeName === 'aria-expanded') {
          transferAriaExpanded(el);
          return;
        }
      }
    }).observe(el, { attributes: true, attributeFilter: ['aria-expanded'] });
  }

  function fixNavTree() {
    var nav = document.querySelector('.wy-menu-vertical');
    if (!nav) {
      return;
    }

    // Step 1: move each toctree-expand <button> out of its <a> parent.
    // The RTD theme does `anchor.prepend(button)` which produces invalid HTML.
    // We re-insert the button immediately after the <a> so it is a sibling,
    // not a descendant, of the link.
    nav.querySelectorAll('a > button.toctree-expand').forEach(function (btn) {
      var anchor = btn.parentElement; // <a>
      var li = anchor.parentElement;  // <li>

      anchor.removeChild(btn);
      // insertBefore(btn, anchor.nextSibling) == insertAfter(anchor)
      li.insertBefore(btn, anchor.nextSibling);

      // Set initial aria-expanded based on whether this item is active.
      btn.setAttribute('aria-expanded',
        li.classList.contains('current') ? 'true' : 'false');
    });

    // Step 2: flush any aria-expanded already placed on <a>/<li>/<ul> by the
    // theme's reset() call (which fires immediately in the theme's init).
    nav.querySelectorAll('[aria-expanded]').forEach(transferAriaExpanded);

    // Step 3: observe future mutations so that toggleCurrent() and reset()
    // changes are transparently redirected to the button.
    nav.querySelectorAll('li, ul, a').forEach(watchAriaExpanded);
  }

  // The RTD theme registers its jQuery-ready callback before this file is
  // evaluated (it is loaded earlier in the HTML).  jQuery fires ready
  // callbacks in registration order, so our callback runs after the theme
  // has already inserted the expand buttons into the DOM.
  if (typeof jQuery !== 'undefined') {
    jQuery(fixNavTree);
  } else {
    document.addEventListener('DOMContentLoaded', fixNavTree);
  }
}());
