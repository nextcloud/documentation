Introduction
============

**ExApps** (short for "External Apps") are Nextcloud apps that are developed in another programming language (outside of PHP) using the AppAPI OCS API.
`AppAPI <https://apps.nextcloud.com/apps/app_api>`_ is a project introduced by Nextcloud to revolutionize the process of application development within the Nextcloud ecosystem.

Overview
--------

The main tasks of the AppAPI ecosystem are:

	* Providing a reliable and fast method for authenticating applications
	* Supporting various application deployment options
	* Offering a clear and straightforward application administration interface
	* Ensuring a reliable implementation of all the necessary missing APIs for applications
	* Supplying clear, understandable documentation and support on how to implement libraries in other programming languages for writing next-gen applications for Nextcloud

The system should support the expansion and integration of new deployment methods, avoiding any tight coupling with a specific deployment type.
Applications should be capable of indicating the deployment methods they can accommodate.

Given the evolving landscape of new technologies and the potential emergence of more intricate or simplified deployment options,
the system is architected to seamlessly embrace the integration of novel deployment modes.

If you have any questions or corrections regarding the documentation,
we would be glad to address them in discussions, incorporate corrections through pull requests,
and handle complex problems through issues.

Glossary
--------

AppAPI brings out the following terms frequently used in the code:

* ``ExApp`` (External App) - the app on another (from PHP) programming language, which uses AppAPI OCS API
* ``DaemonConfig`` - configuration of orchestration daemon (e.g. Docker) where ExApps are deployed
* ``DeployConfig`` - additional DaemonConfig options for orchestrator (e.g. network) and ExApps (nextcloud_url, host, etc.)
* ``ExAppConfig`` - similar to Nextcloud `app_config`, but for ExApps configuration
* ``ExAppPreferences`` - similar to Nextcloud `app_preferences`, user-specific settings for ExApps
* ``AppAPIAuth`` - AppAPI authentication
* ``FileActionsMenu`` - entry in files actions menu (context menu)
