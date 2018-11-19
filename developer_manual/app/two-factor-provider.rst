====================
Two-factor providers
====================

.. sectionauthor:: Christoph Wurst <christoph@owncloud.com>

Two-factor auth providers apps are used to plug custom second factors into the Nextcloud core.

Implementing a simple two-factor auth provider
----------------------------------------------

Two-factor auth providers must implement the ``OCP\Authentication\TwoFactorAuth\IProvider <https://github.com/nextcloud/server/blob/master/lib/public/Authentication/TwoFactorAuth/IProvider.php>``_ interface. The
example below shows a minimalistic example of such a provider.

.. code-block:: php

	<?php

	namespace OCA\TwoFactor_Test\Provider;

	use OCP\Authentication\TwoFactorAuth\IProvider;
	use OCP\IUser;
	use OCP\Template;

	class TwoFactorTestProvider implements IProvider {

		/**
		 * Get unique identifier of this 2FA provider
		 *
		 * @return string
		 */
		public function getId() {
			return 'test';
		}

		/**
		 * Get the display name for selecting the 2FA provider
		 *
		 * @return string
		 */
		public function getDisplayName() {
			return 'Test';
		}

		/**
		 * Get the description for selecting the 2FA provider
		 *
		 * @return string
		 */
		public function getDescription() {
			return 'Use a test provider';
		}

		/**
		 * Get the template for rending the 2FA provider view
		 *
		 * @param IUser $user
		 * @return Template
		 */
		public function getTemplate(IUser $user) {
			// If necessary, this is also the place where you might want
			// to send out a code via e-mail or SMS.

			// 'challenge' is the name of the template
			return new Template('twofactor_test', 'challenge');
		}

		/**
		 * Verify the given challenge
		 *
		 * @param IUser $user
		 * @param string $challenge
		 */
		public function verifyChallenge(IUser $user, $challenge) {
			if ($challenge === 'passme') {
				return true;
			}
			return false;
		}

		/**
		 * Decides whether 2FA is enabled for the given user
		 *
		 * @param IUser $user
		 * @return boolean
		 */
		public function isTwoFactorAuthEnabledForUser(IUser $user) {
			// 2FA is enforced for all users
			return true;
		}

	}

Register the provider state
---------------------------

To always know if a provider is enabled for a user, the server persists the enabled/disabled state
of each provider-user tuple. Hence a provider app has to propagate these state changes. This is
handled by the `provider registry <https://github.com/nextcloud/server/blob/master/lib/public/Authentication/TwoFactorAuth/IRegistry.php>`_.

You can have the registry injected via constructor dependency injection. Whenever the provider state
is changed (user enables/disables the provider), the ``enableProviderFor`` or ``disableProviderFor``
method must be called.


.. note:: This provider registry was added in Nextcloud 14. For backwards compatibility, the server
  still occasionally uses the ``IProvider::isTwoFactorAuthEnabledForUser`` method if the provider state
  has not been set yet. This method will be removed in future releases.


Registering a two-factor auth provider
--------------------------------------

You need to inform the Nextcloud core that the app provides two-factor auth functionality. Two-factor
providers are registered via ``info.xml``.

.. code-block:: XML

	<two-factor-providers>
		<provider>OCA\TwoFactor_Test\Provider\TwoFactorTestProvider</provider>
	</two-factor-providers>

Providing an icon (optional)
----------------------------

To enhance how a provider is shown in the list of selectable providers on the login page, an icon
can be specified. For that the provider class must implement the ``IProvidesIcons <https://github.com/nextcloud/server/blob/master/lib/public/Authentication/TwoFactorAuth/IProvidesIcons.php>``_
interface. The light icon will be used on the login page, whereas the dark one will be placed next
to the heading of the optional personal settings (see below).


Provide personal settings (optional)
------------------------------------

Like other Nextcloud apps, two-factor providers often require user configuration to work. In Nextcloud
15 a new, consolidated two-factor settings section was added. To add personal provider settings there,
a provider must implement the ``IProvidesPersonalSettings <https://github.com/nextcloud/server/blob/master/lib/public/Authentication/TwoFactorAuth/IProvidesPersonalSettings.php>``_
interface.


Make a provider activatable by the admin (optional)
---------------------------------------------------

In order to make it possible for an admin to enable the provider for a given user via the occ
command line tool, it's necessary to implement the ``OCP\Authentication\TwoFactorAuth\IActivatableByAdmin <https://github.com/nextcloud/server/blob/master/lib/public/Authentication/TwoFactorAuth/IActivatableByAdmin.php>``_
interface. As described in the linked interface documentation, this should only be implemented
for providers that need no user interaction when activated.


Make a provider deactivatable by the admin (optional)
-----------------------------------------------------

In order to make it possible for an admin to disable the provider for a given user via the occ
command line tool, it's necessary to implement the ``OCP\Authentication\TwoFactorAuth\IDeactivatableByAdmin <https://github.com/nextcloud/server/blob/master/lib/public/Authentication/TwoFactorAuth/IDeactivatableByAdmin.php>``_
interface. As described in the linked interface documentation, this should only be implemented
for providers that need no user interaction when deactivated.