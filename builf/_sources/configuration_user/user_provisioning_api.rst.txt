=====================
User provisioning API
=====================

The Provisioning API application enables a set of APIs that external systems can use to create, 
edit, delete and query user attributes, query, set and remove groups, set quota 
and query total storage used in Nextcloud. Group admin users can also query 
Nextcloud and perform the same functions as an admin for groups they manage. The 
API also enables an admin to query for active Nextcloud applications, application 
info, and to enable or disable an app remotely. HTTP 
requests can be used via a Basic Auth header to perform any of the functions 
listed above. The Provisioning API app is enabled by default.

The base URL for all calls to the share API is ``https://cloud.example.com/ocs/v1.php/cloud``.

All calls to OCS endpoints require the ``OCS-APIRequest`` header to be set to ``true``.

All POST requests require the ``Content-Type: application/x-www-form-urlencoded`` header. (Note: Some libraries like cURL set this header automatically, others require setting the header explicitly.)

.. toctree::
    :maxdepth: 1

    instruction_set_for_users
    instruction_set_for_groups
    instruction_set_for_apps
