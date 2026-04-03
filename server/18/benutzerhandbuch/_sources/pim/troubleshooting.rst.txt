==============
Fehlerbehebung
==============

BlackBerry OS 10.2
------------------

BlackBerry OS bis Version 10.2.2102 kommt mit ``https://`` in URLs nicht zurecht.
Der Login wird unter Verwendung einer solchen URL immer fehlschlagen.

Verwenden Sie statt (mit ``https://``)::

    https://example.com/remote.php/dav/principals/users/USERNAME/

die URL ohne ``https://``::

    example.com/remote.php/dav/principals/users/USERNAME/
