..  _navigation:

============
Introduction
============

Nextcloud design and brand standards are used to maintain the identity of Nextcloud apps.
If you're a developer who wants to create or contribute to a Nextcloud app, following this guide will make sure your app looks like it belongs to the Nextcloud family.

Each Nextcloud app is unique and different, but there are a couple of standards that are used in everything.
All Nextcloud apps are built keeping some basic principles in mind.


* Software should be quick and easy to use. Show only the most important elements. Secondary elements can be showed on hover or via an "Advanced" function.
* Nextcloud apps are built for everybody. Use a friendly tone with simple sentences. Make sure your app is responsive and runs on all browsers and devices.
* Accessibility: Make sure to regularly test accessibility, for example with `Lighthouse <https://developers.google.com/web/tools/lighthouse>`_\ , `WAVE <https://wave.webaim.org/>`_\ , and `Google Accessibility Scanner <https://play.google.com/store/apps/details?id=com.google.android.apps.accessibility.auditor>`_. Aim for WCAG Level AA. You can learn more about accessibility standards in the `W3 website <https://www.w3.org/WAI/standards-guidelines/wcag/glance/>`_
* Software should work.
  Only put features into main branch when they are complete. It is better to not have a feature instead of having one that works poorly.
* Software should get out of the way.
  Do things automatically instead of offering configuration options. When people ask for a setting, find out what the root of the problem is and fix that instead.
  Also read `Choosing our Preferences <http://ometer.com/preferences.html>`_.
* People’s data is sacred. Provide undo for most operations and optionally a confirmation for bigger more complex operations, but be careful about confirmations `as they might be dismissed <http://www.alistapart.com/articles/neveruseawarning/>`_.
* The state of the application should be clear. If something loads, provide feedback. Reactions should be quick, ideally under 100ms as per `response time limits <https://www.nngroup.com/articles/response-times-3-important-limits/>`_\.
* The state of the application should be clear. If something loads, provide feedback.
* Regularly reset your installation to see what the first-run experience is like, and improve it.
* Ideally do `usability testing <http://jancborchardt.net/usability-in-free-software>`_ to know how people use the software. Testing with 5 users is enough to identify most of your problems.

For further UX principles, read `Alex Faaborg from Mozilla <http://uxmag.com/articles/quantifying-usability>`_\ , and the `GNOME Human Interface Guidelines <https://developer.gnome.org/hig/stable/design-principles.html.en>`_
