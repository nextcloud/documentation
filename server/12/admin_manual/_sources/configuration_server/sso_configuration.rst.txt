==========================
Configuring Single-Sign-On
==========================

Using the SSO & SAML app of your Nextcloud you can make it easily possible to integrate your existing Single-Sign-On
solution with Nextcloud. In addition, you can use the Nextcloud LDAP user provider to keep the convenience for users. (e.g.
when sharing)

The following providers are supported and tested at the moment:

- SAML 2.0
    - OneLogin
    - Shibboleth
    - Active Directory Federation Services (ADFS)
- Authentication via Environment Variable
    - Kerberos (mod_auth_kerb)
    - Any other provider that authenticates using the environment variable

While theoretically any other authentication provider implementing either one of those standards is compatible, we like
to note that they are not part of any internal test matrix.

Enabling the SSO & SAML app
---------------------------

.. warning:: Make sure to configure an administrative user that can access the instance via SSO. Logging-in with your
             regular Nextcloud account won't be possible anymore.


The "SSO & SAML" App is shipped and disabled by default. To enable the app enabled simply go to your Nextcloud Apps page
to enable it. It can then be found in the "SSO & SAML authentication" section of your Nextcloud.

Configuring SAML 2.0
--------------------

To configure using SAML choose the "SAML authentication" in the setup wizard of the application. Then configure the application
as required by your Service Provider.

  .. figure:: ./images/saml_app_overview.png


Configuring environment based authentication
--------------------------------------------
It is possible to authenticate against Nextcloud using an environment variable. This is for example relevant in case you
use an service provider incompatible with SAML such as Kerberos or don't want to configure SAML in the software yourself.

To enable that choose the "Environment variable" authentication provider in the application and then specify the environment
variable. (e.g. `REMOTE_USER` for Kerberos)

Once done you also need to protect the login route properly. On an Apache server with mod_auth_kerb the following configuration
would protect the login route:

.. code-block:: apache

    <Location "/index.php/login">
    	AuthType Kerberos
    	AuthName "Kerberos Login"
    	KrbServiceName HTTP
    	KrbMethodNegotiate On
    	KrbMethodK5Passwd Off
    	KrbSaveCredentials Off
    	KrbVerifyKDC On
    	KrbAuthRealms NEXTCLOUD-AD.LOCAL
    	Krb5KeyTab /etc/apache2/webpage.HTTP.keytab
    	Require valid-user
    </Location>


.. warning:: If this authentication approach is used clients do require an application specific password for authentication.
             A better integration into our desktop and mobile clients is considered for the future though.