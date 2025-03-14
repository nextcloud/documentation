=======================================
User authentication with OpenID Connect
=======================================

Nextcloud users can authenticate via an external identity provider.
Nextcloud can also be an identity provider itself.

Authentication in Nextcloud
---------------------------

The `OpenID Connect user backend app <https://apps.nextcloud.com/apps/user_oidc>`_ makes it possible for users to
authenticate using external Oidc identity providers.

This app can optionally be in charge of user provisioning (by creating users when they first connect) or rely on
other user backends and only take care of authentication.

`More details in the project's README <https://github.com/nextcloud/user_oidc#user_oidc>`_

Using Nextcloud as an identity provider
---------------------------------------

The `OIDC Identity Provider community app <https://apps.nextcloud.com/apps/oidc>`_
can be installed to make Nextcloud an identity provider for other services.

This app will allow any Nextcloud user (managed by any user backend) to authenticate during an Oidc login flow.
This is useful if you want your Nextcloud instance to be the authority regarding authentication and user profile data
among multiple services.

Bearer token validation
-----------------------

Nextcloud can accept Oidc ID tokens and access tokens as valid bearer token for API requests.
If using an external identity provider, only the ``user_oidc`` app is necessary.

If Nextcloud is the identity provider, you will naturally need the ``oidc`` app to make Nextcloud an Oidc provider,
and also the ``user_oidc`` app because it will take care of validating API requests authentication.
In user_oidc, the ``oidc_provider_bearer_validation`` config flag needs to be set to true so ``user_oidc`` knows
it needs to ask the ``oidc`` app to validate the received bearer tokens.

`More details on bearer token validation <https://github.com/nextcloud/user_oidc#bearer-token-validation>`_
