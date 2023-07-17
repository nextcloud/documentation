============
Public Pages
============

A lot of apps in Nextcloud want to expose public pages in some form. This can
be to share files, a calendar or anything else. To ensure all those pages
benefit from the security enhancements we add simplified controllers were created
for app developers to use.

Concept
-------

A public page is there to display a resource that a user wants to expose via a
public link in an app.

A public page is identified by some ``token`` and can be protected by a ``password``.

If a public page is password protected by default we will show the normal authentication
page to enter the password.

A public page can also call other endpoints. These endpoints operate very similarly
with the difference that if the user is not properly authenticated it will throw a 404.

It is required that you have a parameter (probably in your url) with the ``token``. As an example
your ``routes.php`` could look like:

.. code-block:: php

	<?php
	return [
		'routes' => [
			[ 'name' => 'PublicAPI#get', 'url' => '/api/{token}', 'verb' => 'GET' ],
			[ 'name' => 'PublicDisplay#get', 'url' => '/display/{token}', 'verb' => 'GET' ],
		]
	];

Implementing an API called from a public share page
---------------------------------------------------

As said the PublicShareController is a very basic controller. You need to implement 3 functions.
``isPasswordProtected``, ``isValidToken`` and ``getPasswordHash``.

.. code-block:: php

	<?php

	namespace OCA\Share_Test\Controller;

	use OCP\AppFramework\Http\Attribute\PublicPage;
	use OCP\AppFramework\PublicShareController;

	class PublicAPIController extends PublicShareController {
		/**
		 * Return the hash of the password for this share.
		 * This function is of course only called when isPasswordProtected is true
		 */
		protected function getPasswordHash(): string {
			return md5('secretpassword');
		}

		/**
		* Validate the token of this share. If the token is invalid this controller
		* will return a 404.
		*/
		public function isValidToken(): bool {
			return $this->getToken() === 'secretToken';
		}

		/**
		 * Allows you to specify if this share is password protected
		 */
		protected function isPasswordProtected(): bool {
			return true;
		}

		/**
		 * Your normal controller function. The following annotation will allow guests
		 * to open the page as well
		 */
		#[PublicPage]
		public function get() {
			// Work your magic
		}
	}


You can also chose to overwrite the ``shareNotFound`` function. That is called when the
token is not valid. You can do additional logging here for example.


Implementing an authenticated public page
-----------------------------------------

On some pages password authentication might be required (just like the when you
share a file via public link with a password). In this case you need
to extend a different provider.

The AuthPublicShareController requires in addition to the PublicShareController that
you also implement the ``verifyPassword`` and ``showShare`` functions.

.. code-block: php

	<?php

	namespace OCA\Share_Test\Controller;

	use OCP\AppFramework\AuthPublicShareController;
	use OCP\AppFramework\Http\Attribute\PublicPage;

	class PublicDisplayController extends AuthPublicShareController {
		/**
		 * Return the hash of the password for this share.
		 * This function is of course only called when isPasswordProtected is true
		 */
		protected function getPasswordHash(): string {
			return md5('secretpassword');
		}

		/**
		* Validate the token of this share. If the token is invalid this controller
		* will return a 404.
		*/
		public function isValidToken(): bool {
			return $this->getToken() === 'secretToken';
		}

		/**
		 * Allows you to specify if this share is password protected
		 */
		protected function isPasswordProtected(): bool {
			return true;
		}

		/**
		 * Verify the entered password by the user
		 */
		protected function verifyPassword(string $password): bool {
			return $password === 'secretpassword';
		}

		public function showShare(): TemplateResponse {
			return new TemplateResponse('yourapp', 'yourtemplate');
		}

		/**
		 * Your normal controller function. The following annotation will allow guests
		 * to open the page as well
		 */
		#[PublicPage]
		public function get() {
			// Work your magic
		}
	}


Additionally you can overwrite the ``showAuthenticate`` and ``showAuthFailed`` functions
if you do not want to use the default authentication pages.

The ``authFailed`` and ``authSucceeded`` functions can be overwritten as well and are
called depending on the if authentication passed or not. You can handle additional logging
there for example.

