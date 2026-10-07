=======================
Upgrade to Nextcloud 34
=======================

Critical changes
----------------

There are **no additional critical upgrade steps** specific to Nextcloud 34
beyond a normal major upgrade (backup, put the instance into maintenance mode,
run ``occ upgrade``, then disable maintenance mode).

Review the `official changelog <https://nextcloud.com/changelog/>`_ for feature
and app changes in the Hub 26 Spring / Nextcloud 34 line, and confirm your
stack still matches :doc:`../installation/system_requirements` before upgrading
further to Nextcloud 35.

System requirements
-------------------

Nextcloud 34 continues the PHP 8.3–8.5 support window used around this release
line. Prefer staying on a currently supported PHP, database, and OS combination
from the system requirements page when planning the upgrade.
