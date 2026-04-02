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
