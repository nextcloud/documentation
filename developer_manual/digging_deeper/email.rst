.. _email:

=====
Email
=====

Nextcloud has a mailer component to send email from an admin-defined account.

Basic usage
-----------

The mailer is hidden behind the ``\OCP\Mail\IMailer`` interface that can be :ref:`injected<dependency-injection>`:

.. code-block:: php
    :caption: lib/Service/MailService.php

    <?php

    use OCP\Mail\IMailer;

    class MailService {
        private IMailer $mailer;

        public function __construct(IMailer $mailer) {
            $this->mailer = $mailer;
        }

        public function notify(string $email): void {
            $message = $this->mailer->createMessage();
            $message->setSubject("Hello from Nextcloud");
            $message->setPlainBody("This is some text");
            $message->setHtmlBody(
                "<!doctype html><html><body>This is some <b>text</b></body></html>"
            );
            $message->setTo([$email]);
            $this->mailer->send($message);
        }
    }

Validate recipients and rate-limit sends
----------------------------------------

Sending mail through the instance can turn Nextcloud into a spam relay if
recipients or request volume are not controlled. Before calling ``send()``,
validate every address with ``IMailer::validateMailAddress()``:

.. code-block:: php

    if (!$this->mailer->validateMailAddress($email)) {
        throw new \InvalidArgumentException('Invalid email address');
    }

Rate-limit any controller endpoint that triggers a send. Prefer the attributes
``#[UserRateLimit]`` and ``#[AnonRateLimit]`` on the action, or register
requests with ``\OCP\Security\RateLimiting\ILimiter`` outside controllers
(see :ref:`programmatic-rate-limiting`).

.. warning::

   Anonymous or public users must not be able to make the instance send mail
   to an address they typed in — or only under a strict rate limit.

Inline attachments
------------------

Inline attachments can be appended to a message with ``IMessage::attachInline``:

.. code-block:: php

    /** @var IMessage $message */
    $message->attachInline(
        "this is a test", // Body
        "test.txt",       // Name
        "text/plain"      // Content type
    );
    $this->mailer->send($message);
