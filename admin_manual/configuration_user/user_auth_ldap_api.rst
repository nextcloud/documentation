==========================
The LDAP configuration API
==========================

All methods require that the "OCS-APIREQUEST" header be set to "true".  Methods take an optional "format" parameter, which may be "xml" (the default) or "json".


Creating a configuration
------------------------

Creates a new and empty LDAP configuration. It returns its ID. Authentication is done by sending a
basic HTTP authentication header.

**Syntax: ocs/v2.php/apps/user_ldap/api/v1/config**

* HTTP method: POST

Example
^^^^^^^

:: 

  $ curl -X POST https://admin:secret@example.com/ocs/v2.php/apps/user_ldap/api/v1/config -H "OCS-APIREQUEST: true"

* Creates a new, empty configuration

XML output
^^^^^^^^^^

.. code-block:: xml

  <?xml version="1.0"?>
  <ocs>
   <meta>
    <status>ok</status>
    <statuscode>200</statuscode>
    <message>OK</message>
   </meta>
   <data>
    <configID>s01</configID>
   </data>
  </ocs>


Deleting a configuration
------------------------

Deletes a given LDAP configuration. Authentication is done by sending a basic HTTP authentication header.

**Syntax: ocs/v2.php/apps/user_ldap/api/v1/config/{configID}**

* HTTP method: DELETE

Example
^^^^^^^

:: 

  $ curl -X DELETE ``https://admin:secret@example.com/ocs/v2.php/apps/user_ldap/api/v1/config/s02 -H "OCS-APIREQUEST: true"

* deletes the LDAP configuration

XML output
^^^^^^^^^^

.. code-block:: xml

  <?xml version="1.0"?>
  <ocs>
   <meta>
    <status>ok</status>
    <statuscode>200</statuscode>
    <message>OK</message>
   </meta>
   <data/>
  </ocs>


Reading a configuration
-----------------------

Returns all keys and values of the specified LDAP configuration. Authentication is done by sending a basic HTTP authentication header.

**Syntax: ocs/v2.php/apps/user_ldap/api/v1/config/{configID}**

* HTTP method: GET
* url argument: showPassword - int, optional, default 0, whether to return the password in clear text

Example
^^^^^^^

:: 

  $ curl -X GET https://admin:secret@example.com/ocs/v2.php/apps/user_ldap/api/v1/config/s02?showPassword=1 -H "OCS-APIREQUEST: true"

* fetches the LDAP configuration

XML output
^^^^^^^^^^

.. code-block:: xml

  <?xml version="1.0"?>
  <ocs>
   <meta>
    <status>ok</status>
    <statuscode>200</statuscode>
    <message>OK</message>
   </meta>
   <data>
    <ldapHost>ldap://ldap.server.tld</ldapHost>
    <ldapPort>389</ldapPort>
    <ldapBackupHost></ldapBackupHost>
    <ldapBackupPort></ldapBackupPort>
    <ldapBase>ou=Department XLII,dc=example,dc=com</ldapBase>
    <ldapBaseUsers>ou=users,ou=Department XLII,dc=example,dc=com</ldapBaseUsers>
    <ldapBaseGroups>ou=Department XLII,dc=example,dc=com</ldapBaseGroups>
    <ldapAgentName>cn=root,dc=example,dc=com</ldapAgentName>
    <ldapAgentPassword>Secret</ldapAgentPassword>
    <ldapTLS>1</ldapTLS>
    <turnOffCertCheck>0</turnOffCertCheck>
    <ldapIgnoreNamingRules/>
    <ldapUserDisplayName>displayname</ldapUserDisplayName>
    <ldapUserDisplayName2>uid</ldapUserDisplayName2>
    <ldapGidNumber>gidNumber</ldapGidNumber>
    <ldapUserFilterObjectclass>inetOrgPerson</ldapUserFilterObjectclass>
    <ldapUserFilterGroups></ldapUserFilterGroups>
    <ldapUserFilter>(&amp;(objectclass=nextcloudUser)(nextcloudEnabled=TRUE))</ldapUserFilter>
    <ldapUserFilterMode>1</ldapUserFilterMode>
    <ldapGroupFilter>(&amp;(|(objectclass=nextcloudGroup)))</ldapGroupFilter>
    <ldapGroupFilterMode>0</ldapGroupFilterMode>
    <ldapGroupFilterObjectclass>nextcloudGroup</ldapGroupFilterObjectclass>
    <ldapGroupFilterGroups></ldapGroupFilterGroups>
    <ldapGroupMemberAssocAttr>memberUid</ldapGroupMemberAssocAttr>
    <ldapGroupDisplayName>cn</ldapGroupDisplayName>
    <ldapLoginFilter>(&amp;(|(objectclass=inetOrgPerson))(uid=%uid))</ldapLoginFilter>
    <ldapLoginFilterMode>0</ldapLoginFilterMode>
    <ldapLoginFilterEmail>0</ldapLoginFilterEmail>
    <ldapLoginFilterUsername>1</ldapLoginFilterUsername>
    <ldapLoginFilterAttributes></ldapLoginFilterAttributes>
    <ldapQuotaAttribute></ldapQuotaAttribute>
    <ldapQuotaDefault>20 MB</ldapQuotaDefault>
    <ldapEmailAttribute>mail</ldapEmailAttribute>
    <ldapCacheTTL>600</ldapCacheTTL>
    <ldapUuidUserAttribute>auto</ldapUuidUserAttribute>
    <ldapUuidGroupAttribute>auto</ldapUuidGroupAttribute>
    <ldapOverrideMainServer></ldapOverrideMainServer>
    <ldapConfigurationActive>1</ldapConfigurationActive>
    <ldapAttributesForUserSearch>uid;sn;givenname</ldapAttributesForUserSearch>
    <ldapAttributesForGroupSearch></ldapAttributesForGroupSearch>
    <ldapExperiencedAdmin>0</ldapExperiencedAdmin>
    <homeFolderNamingRule>attr:mail</homeFolderNamingRule>
    <hasPagedResultSupport></hasPagedResultSupport>
    <hasMemberOfFilterSupport>1</hasMemberOfFilterSupport>
    <useMemberOfToDetectMembership>1</useMemberOfToDetectMembership>
    <ldapExpertUsernameAttr></ldapExpertUsernameAttr>
    <ldapExpertUUIDUserAttr></ldapExpertUUIDUserAttr>
    <ldapExpertUUIDGroupAttr></ldapExpertUUIDGroupAttr>
    <lastJpegPhotoLookup>0</lastJpegPhotoLookup>
    <ldapNestedGroups>0</ldapNestedGroups>
    <ldapPagingSize>500</ldapPagingSize>
    <turnOnPasswordChange>1</turnOnPasswordChange>
    <ldapDynamicGroupMemberURL></ldapDynamicGroupMemberURL>
    <ldapDefaultPPolicyDN></ldapDefaultPPolicyDN>
   </data>
  </ocs>

Modifying a configuration
-------------------------

Updates a configuration with the provided values. Authentication is done by sending a basic HTTP authentication header.

**Syntax: ocs/v2.php/apps/user_ldap/api/v1/config/{configID}**

* HTTP method: PUT
* url argument: configData - array, see table below for the fields. All fields are optional. The values must be url-encoded.

Example
^^^^^^^

:: 

  $ curl -X PUT https://admin:secret@example.com/ocs/v2.php/apps/user_ldap/api/v1/config/s01 -H "OCS-APIREQUEST: true" -d "configData[ldapHost]=ldap%3A%2F%2Fldap.server.tld &configData[ldapPort]=389"

* updates the LDAP configuration

XML output
^^^^^^^^^^

.. code-block:: xml

  <?xml version="1.0"?>
  <ocs>
   <meta>
    <status>ok</status>
    <statuscode>200</statuscode>
    <message>OK</message>
   </meta>
   <data/>
  </ocs>

Configuration keys
------------------

+-------------------------------+------+----------+-----------------------------------------------------------------------------------------------------------------------+
| Key                           | Mode | Required | Description                                                                                                           |
+===============================+======+==========+=======================================================================================================================+
| ldapHost                      | rw   | yes      | LDAP server host, supports protocol                                                                                   |
+-------------------------------+------+----------+-----------------------------------------------------------------------------------------------------------------------+
| ldapPort                      | rw   | yes      | LDAP server port                                                                                                      |
+-------------------------------+------+----------+-----------------------------------------------------------------------------------------------------------------------+
| ldapBackupHost                | rw   | no       | LDAP replica host                                                                                                     |
+-------------------------------+------+----------+-----------------------------------------------------------------------------------------------------------------------+
| ldapBackupPort                | rw   | no       | LDAP replica port                                                                                                     |
+-------------------------------+------+----------+-----------------------------------------------------------------------------------------------------------------------+
| ldapOverrideMainServer        | rw   | no       | Whether replica should be used instead                                                                                |
+-------------------------------+------+----------+-----------------------------------------------------------------------------------------------------------------------+
| ldapBase                      | rw   | yes      | Base                                                                                                                  |
+-------------------------------+------+----------+-----------------------------------------------------------------------------------------------------------------------+
| ldapBaseUsers                 | rw   | no       | Base for users, defaults to general base if not specified                                                             |
+-------------------------------+------+----------+-----------------------------------------------------------------------------------------------------------------------+
| ldapBaseGroups                | rw   | no       | Base for groups, defaults to general base if not specified                                                            |
+-------------------------------+------+----------+-----------------------------------------------------------------------------------------------------------------------+
| ldapAgentName                 | rw   | no       | DN for the (service) user to connect to LDAP                                                                          |
+-------------------------------+------+----------+-----------------------------------------------------------------------------------------------------------------------+
| ldapAgentPassword             | rw   | no       | Password for the service user                                                                                         |
+-------------------------------+------+----------+-----------------------------------------------------------------------------------------------------------------------+
| ldapTLS                       | rw   | no       | Whether to use StartTLS                                                                                               |
+-------------------------------+------+----------+-----------------------------------------------------------------------------------------------------------------------+
| turnOffCertCheck              | rw   | no       | Turns off certificate validation for TLS connections                                                                  |
+-------------------------------+------+----------+-----------------------------------------------------------------------------------------------------------------------+
| ldapIgnoreNamingRules         | rw   | no       | Backwards compatibility, do not set it.                                                                               |
+-------------------------------+------+----------+-----------------------------------------------------------------------------------------------------------------------+
| ldapUserDisplayName           | rw   | yes      | Attribute used as display name for users                                                                              |
+-------------------------------+------+----------+-----------------------------------------------------------------------------------------------------------------------+
| ldapUserDisplayName2          | rw   | no       | Additional attribute, if set show on brackets next to the main attribute                                              |
+-------------------------------+------+----------+-----------------------------------------------------------------------------------------------------------------------+
| ldapUserAvatarRule            | rw   | no       | Specify the avatar integration behavior, possible values: "default", "none", "data:$ATTRIBUTENAME"                    |
+-------------------------------+------+----------+-----------------------------------------------------------------------------------------------------------------------+
| ldapGidNumber                 | rw   | no       | group ID attribute, needed for primary groups on OpenLDAP (and compatible)                                            |
+-------------------------------+------+----------+-----------------------------------------------------------------------------------------------------------------------+
| ldapUserFilterObjectclass     | rw   | no       | set by the Settings Wizard (web UI)                                                                                   |
+-------------------------------+------+----------+-----------------------------------------------------------------------------------------------------------------------+
| ldapUserFilterGroups          | rw   | no       | set by the Settings Wizard (web UI)                                                                                   |
+-------------------------------+------+----------+-----------------------------------------------------------------------------------------------------------------------+
| ldapUserFilter                | rw   | yes      | LDAP Filter used to retrieve user                                                                                     |
+-------------------------------+------+----------+-----------------------------------------------------------------------------------------------------------------------+
| ldapUserFilterMode            | rw   | no       | used by the Settings Wizard, set to 1 for manual editing                                                              |
+-------------------------------+------+----------+-----------------------------------------------------------------------------------------------------------------------+
| ldapAttributesForUserSearch   | rw   | no       | attributes to be matched when searching for users. separate by ;                                                      |
+-------------------------------+------+----------+-----------------------------------------------------------------------------------------------------------------------+
| ldapGroupFilter               | rw   | no       | LDAP Filter used to retrieve groups                                                                                   |
+-------------------------------+------+----------+-----------------------------------------------------------------------------------------------------------------------+
| ldapGroupFilterMode           | rw   | no       | used by the Settings Wizard, set to 1 for manual editing                                                              |
+-------------------------------+------+----------+-----------------------------------------------------------------------------------------------------------------------+
| ldapGroupFilterObjectclass    | rw   | no       | set by the Settings Wizard (web UI)                                                                                   |
+-------------------------------+------+----------+-----------------------------------------------------------------------------------------------------------------------+
| ldapGroupFilterGroups         | rw   | no       | set by the Settings Wizard (web UI)                                                                                   |
+-------------------------------+------+----------+-----------------------------------------------------------------------------------------------------------------------+
| ldapGroupMemberAssocAttr      | rw   | no       | attribute that indicates group members, one of: member, memberUid, uniqueMember, gidNumber                            |
+-------------------------------+------+----------+-----------------------------------------------------------------------------------------------------------------------+
| ldapGroupDisplayName          | rw   | no       | Attribute used as display name for groups, required if groups are used                                                |
+-------------------------------+------+----------+-----------------------------------------------------------------------------------------------------------------------+
| ldapAttributesForGroupSearch  | rw   | no       | attributes to be matched when searching for groups. separate by ;                                                     |
+-------------------------------+------+----------+-----------------------------------------------------------------------------------------------------------------------+
| ldapLoginFilter               | rw   | yes      | LDAP Filter used to authenticate users                                                                                |
+-------------------------------+------+----------+-----------------------------------------------------------------------------------------------------------------------+
| ldapLoginFilterMode           | rw   | no       | used by the Settings Wizard, set to 1 for manual editing                                                              |
+-------------------------------+------+----------+-----------------------------------------------------------------------------------------------------------------------+
| ldapLoginFilterEmail          | rw   | no       | set by the Settings Wizard (web UI)                                                                                   |
+-------------------------------+------+----------+-----------------------------------------------------------------------------------------------------------------------+
| ldapLoginFilterUsername       | rw   | no       | set by the Settings Wizard (web UI)                                                                                   |
+-------------------------------+------+----------+-----------------------------------------------------------------------------------------------------------------------+
| ldapLoginFilterAttributes     | rw   | no       | set by the Settings Wizard (web UI)                                                                                   |
+-------------------------------+------+----------+-----------------------------------------------------------------------------------------------------------------------+
| ldapQuotaAttribute            | rw   | no       | LDAP attribute containing the quote value (per user)                                                                  |
+-------------------------------+------+----------+-----------------------------------------------------------------------------------------------------------------------+
| ldapQuotaDefault              | rw   | no       | Default Quota, if specified quota attribute is empty                                                                  |
+-------------------------------+------+----------+-----------------------------------------------------------------------------------------------------------------------+
| ldapEmailAttribute            | rw   | no       | LDAP attribute containing the email address (takes first if multiple are stored)                                      |
+-------------------------------+------+----------+-----------------------------------------------------------------------------------------------------------------------+
| ldapCacheTTL                  | rw   | no       | How long results from LDAP are cached, defaults to 10min                                                              |
+-------------------------------+------+----------+-----------------------------------------------------------------------------------------------------------------------+
| ldapUuidUserAttribute         | r    | no       | set in runtime                                                                                                        |
+-------------------------------+------+----------+-----------------------------------------------------------------------------------------------------------------------+
| ldapUuidGroupAttribute        | r    | no       | set in runtime                                                                                                        |
+-------------------------------+------+----------+-----------------------------------------------------------------------------------------------------------------------+
| ldapConfigurationActive       | rw   | no       | whether this configuration is active. 1 is on, 0 is off.                                                              |
+-------------------------------+------+----------+-----------------------------------------------------------------------------------------------------------------------+
| ldapExperiencedAdmin          | rw   | no       | used by the Settings Wizard, set to 1 for manual editing                                                              |
+-------------------------------+------+----------+-----------------------------------------------------------------------------------------------------------------------+
| homeFolderNamingRule          | rw   | no       | LDAP attribute to use a user folder name                                                                              |
+-------------------------------+------+----------+-----------------------------------------------------------------------------------------------------------------------+
| hasPagedResultSupport         | r    | no       | set in runtime                                                                                                        |
+-------------------------------+------+----------+-----------------------------------------------------------------------------------------------------------------------+
| hasMemberOfFilterSupport      | r    | no       | set in runtime                                                                                                        |
+-------------------------------+------+----------+-----------------------------------------------------------------------------------------------------------------------+
| useMemberOfToDetectMembership | rw   | no       | Whether to use memberOf to detect group memberships                                                                   |
+-------------------------------+------+----------+-----------------------------------------------------------------------------------------------------------------------+
| ldapExpertUsernameAttr        | rw   | no       | LDAP attribute to use as internal username. Might be modified (e.g. to avoid name collisions, character restrictions) |
+-------------------------------+------+----------+-----------------------------------------------------------------------------------------------------------------------+
| ldapExpertUUIDUserAttr        | rw   | no       | override the LDAP servers UUID attribute to identify LDAP user records                                                |
+-------------------------------+------+----------+-----------------------------------------------------------------------------------------------------------------------+
| ldapExpertUUIDGroupAttr       | rw   | no       | override the LDAP servers UUID attribute to identify LDAP group records                                               |
+-------------------------------+------+----------+-----------------------------------------------------------------------------------------------------------------------+
| lastJpegPhotoLookup           | r    | no       | set in runtime                                                                                                        |
+-------------------------------+------+----------+-----------------------------------------------------------------------------------------------------------------------+
| ldapNestedGroups              | rw   | no       | Whether LDAP supports nested groups                                                                                   |
+-------------------------------+------+----------+-----------------------------------------------------------------------------------------------------------------------+
| ldapPagingSize                | rw   | no       | Number of results to return per page                                                                                  |
+-------------------------------+------+----------+-----------------------------------------------------------------------------------------------------------------------+
| turnOnPasswordChange          | rw   | no       | Whether users are allowed to change passwords (hashing must happen on LDAP!)                                          |
+-------------------------------+------+----------+-----------------------------------------------------------------------------------------------------------------------+
| ldapDynamicGroupMemberURL     | rw   | no       | URL for dynamic groups                                                                                                |
+-------------------------------+------+----------+-----------------------------------------------------------------------------------------------------------------------+
| ldapDefaultPPolicyDN          | rw   | no       | PPolicy DN for password rules                                                                                         |
+-------------------------------+------+----------+-----------------------------------------------------------------------------------------------------------------------+

