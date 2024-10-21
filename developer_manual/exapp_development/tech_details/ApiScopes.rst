.. _api_scopes:

Api Scopes
==========

.. warning::

	ApiScopes are deprecated and removed since AppAPI 3.2.0.

AppAPI design's focus on simplicity and necessity highlights the benefits of defining API scopes.
which simplify the development and integration of applications into the Nextcloud ecosystem.

With the elimination of optional API scopes, the configuration process during installation becomes more streamlined.
Now, the Nextcloud administrator only needs to focus on the essential API groups,
making the application's setup and permissions handling more efficient and less prone to errors.

The **info.xml** file continues to play a crucial role, listing all the `required` API groups an
application needs to function correctly.
This not only simplifies version updates, allowing for the seamless introduction of
new API groups or the discontinuation of obsolete ones, but also enhances the overall security and reliability
of the application by ensuring it only has access to necessary functionalities.

Supported API Groups include:

* ``2``     SYSTEM
* ``10``    FILES
* ``11``    FILES_SHARING
* ``30``    USER_INFO
* ``31``    USER_STATUS
* ``32``    NOTIFICATIONS
* ``33``    WEATHER_STATUS
* ``50``    TALK
* ``60``    TALK_BOT
* ``61``    AI_PROVIDERS
* ``62``    EVENTS_LISTENER
* ``63``    OCC_COMMAND
* ``110``   ACTIVITIES
* ``120``   NOTES
* ``200``   TEXT_PROCESSING
* ``210``   MACHINE_TRANSLATION
* ``9999``  ALL

These groups, represented by intuitive names, ensure that applications have
tailored access to the functionalities they need, enhancing performance and user experience.
As Nextcloud evolves, this list of API groups will continue to grow, offering developers a wide array of tools
to create innovative and efficient applications.

The streamlined approach to API scopes not only simplifies the application development process
but also aligns with best practices in software design, emphasizing clarity, security, and efficiency.
This refinement in the handling of API scopes reflects Nextcloud's commitment to providing a robust and developer-friendly platform.
