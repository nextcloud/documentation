.. _app-maintainer:

===========
Maintainers
===========

.. sectionauthor:: Christoph Wurst <christoph@winzerhof-wurst.at>

The role of a Nextcloud app maintainer is to oversee all processes around an app. The responsibilities are:

* Triage bug reports

  + Make sure reported bugs are reproducible, ask for more info if necessary
  + Check for duplicates
  + Close resolved tickets

* Manage pull requests

  + Ensure pull request receive a review in reasonable time
  + Merge pull requests that pass the peer review and all continuous integration checks
  + Trigger backports if applicable

* Manage releases

  + Ensure pre-releases are ready for deployment in pre-production of Nextcloud server
  + Ensure compatible releases are ready for deployments of Nextcloud server releases

* Manage vulnerabilities

  + Monitor vulnerable dependencies, e.g. through Github security alerts, and release updates timely
  + Coordinate disclosed vulnerabilities with the Nextcloud security team

To avoid the so called `bus factor <https://en.wikipedia.org/wiki/Bus_factor>`_, it is highly recommended to have more than one maintainer for each app. Apps can have one primary maintainer and one or more backup maintainers. For transparency, it can make sense to declare the maintainers of an app in the app's repository README file, so that others know whom to contact.