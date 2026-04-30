
.. _mail-providers:

========================================
Mail Provider Interface
========================================

Nextcloud apps can use, and register the mail provider interface, to provide or consume mail service functionality to and from other apps. 

Access to mail services from another app is provided by the Mail Manager class. Using this class your app can find available mail providers and services. Please see the appropriate section below for more details.

The reverse is also possible, one can register an app to supply mail services to other apps. This is accomplished by implementing a custom Mail Provider class and Mail Service class then registering your provider with the system. Please see the appropriate section below for more details.

.. _mail-provider-terminology:

Terminology
-----------

For clarification this is a reference of terminology used.

1. *Provider* - this is the app that provides mail services e.g. "BigHostingApp", this can be an app for a specific protocol
2. *Service* - this is a configured mail service account e.g. "Big Email Hosting Co". Each mail provider may have multiple mail services configured for a user.

.. _mail-provider-consume:

Consuming a Mail Service
------------------------

To use mail as a service provided by another app, your app needs to instantiate the mail manager class, then use the built in methods to list or find an appropriate provider and service.

.. code-block:: php

    <?php

    use OCP\Mail\Provider\IManager as IMailManager;
    use OCP\Mail\Provider\Address;
    use OCP\Mail\Provider\Attachment;

    class MyTestService {

        // Instance the mail manager using dependency injection 
        public function __construct(IMailManager $mailManager) {
            private IMailManager $mailManager;
        }

        public function acquireMailProvider(): void {
            
            // determine if any providers are available
            if (!$this->mailManager->has()) {
                return;
            }
            
            // retrieve types of providers available (array of id's and labels)
            $types = $this->mailManager->types();

            // retrieve all providers available (array of provider objects)
            $providers = $this->mailManager->providers();

            // retrieve a single provider (provider objects)
            $provider = $this->mailManager->findProviderById('provider1');

        }

        public function acquireMailService(): void {
            
            // determine if any providers are available
            if (!$this->mailManager->has()) {
                return;
            }
            
            // retrieve services available for a user (array of service objects)
            $services = $this->mailManager->services('user1');

            // retrieve a single service with a specific mail address (service objects)
            $service = $this->mailManager->findServiceByAddress('user@testing.com');

        }

        public function sendMessage(): void {
            
            // determine if any providers are available
            if (!$this->mailManager->has()) {
                return;
            }
            
            // retrieve a single service with a specific mail address (service objects)
            $service = $this->mailManager->findServiceByAddress('user@testing.com');

            // construct mail message and set required parameters
            $message = $service->initiateMessage();
            $message->setFrom(new Address('user1@testing.com', 'User One'));
            $message->setTo(new Address('user2@testing.com', 'User Two'));
            $message->setSubject('Our Great Plan');
            $message->setBodyPlain('See the attached itinerary for our great plan');
            $message->setBodyHtml('<html>See the attached itinerary for our great plan</html>');
            $message->setAttachments(new Attachment(
                'Our great plan itinerary',
                'theplan.txt',
                'text/plain'
            ));
            // send message
            $service->sendMessage($message);

        }
    }

For more detailed information of methods available, parameters and returns please see the mail providers directory in the server repository. (lib/public/Mail/Provider)

.. _mail-provider-provide:

Providing a Mail Service
------------------------

For your app to provide mail service to other apps, your app needs to implement two main interfaces plus interfaces for the supported functionality.

Step 1: Create a Mail Provider Class
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

The mail provider class is the main class that the mail manager uses to retrieve available services from your app. Each mail provider can have multiple mail services configured for a user.

This class needs to implement the `IProvider` interface and have all the required methods defined.

.. code-block:: php

    namespace OCA\BigHostingApp\Provider;

    use OCP\Mail\Provider\IProvider;
    use OCP\Mail\Provider\IService;

    class MailProvider implements IProvider {

        public function id(): string {
            return 'big-hosting-app';
        }

        public function label(): string {
            return 'Big Hosting App';
        }

        public function hasServices(string $userId): bool {
            // app specific code to check for available services
        }

        public function listServices(string $userId): array {
            // app specific code to list all available services
        }

        public function findServiceById(string $userId, string $serviceId): IService | null {
            // app specific code to find a specific services
        }

        public function findServiceByAddress(string $userId, string $address): IService | null {
            // app specific code to find a service with a specific email address
        }

    }

Step 2: Create a Mail Service Class
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

The mail service class is the main class that other apps use to access mail functionality in your app. This class is also returned by the mail provider class.

This class needs to implement the `IService` interface and have all the required methods defined. Because functionality varies between protocols this class also needs to be extended with the appropriate supported function interfaces like 'IMessageSend' which provides mail sending capabilities.  

.. code-block:: php
    
    namespace OCA\BigHostingApp\Provider;

    use OCP\Mail\Provider\Address;
    use OCP\Mail\Provider\IAddress;
    use OCP\Mail\Provider\IMessage;
    use OCP\Mail\Provider\IMessageSend;
    use OCP\Mail\Provider\IService;
    use OCP\Mail\Provider\Message;

    class MailService implements IService, IMessageSend {

        public function id(): string {
            return '1 or service1 or anything else';
        }

        public function capable(string $value): bool {
            // app specific code to check if a service is capable of perform a specific function e.g. Sending a Message
        }

        public function capabilities(): array {
            // app specific code to retrieve a list of capabilities
        }

        public function getLabel(): string {
            // app specific code to retrieve the label/description/name of the service
        }

        public function getPrimaryAddress(): IAddress {
            // app specific code to retrieve the primary email address of the service
        }

        public function getSecondaryAddresses(): array {
            // app specific code to retrieve the secondary email addresses (aliases) of the service
        }

        public function initiateMessage(): IMessage {
            // app specific code to create a fresh message e.g message object to send a message or save a message in drafts
        }

        // this function is the extended capabilities added to this class from IMessageSend
        public function sendMessage(IMessage $message, array $option = []): void {
            // app specific code to send a message
        }

    }


Step 3: Register the Mail Provider
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

The registration is performed at the initial stages of your app being loaded by the Nextcloud system, inside the 'AppInfo/Application.php' file

.. code-block:: php
    
    namespace OCA\BigHostingApp\AppInfo;

    use OCA\BigHostingApp\Provider\MailProvider;
    use OCP\AppFramework\App;
    use OCP\AppFramework\Bootstrap\IRegistrationContext;
    
    class Application extends App {

        public const APP_ID = 'BigHostingApp';

        public function __construct(array $urlParams = []) {
            parent::__construct(self::APP_ID, $urlParams);
        }

        public function register(IRegistrationContext $context): void {

            // Tip: If your app spans multiple version of Nextcloud, we recommend to make sure the method exists with 'method_exists()'
            $context->registerMailProvider(MailProvider::class);

        }

    }