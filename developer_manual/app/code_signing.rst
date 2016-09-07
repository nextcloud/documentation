============
Code Signing
============

.. sectionauthor:: Lukas Reschke <lukas@nextcloud.com>

Nextcloud supports code signing for the core releases, and for Nextcloud
applications. Code signing gives our users an additional layer of security by
ensuring that nobody other than authorized persons can push updates.

It also ensures that all upgrades have been executed properly, so that no files
are left behind, and all old files are properly replaced. In the past, invalid
updates were a significant source of errors when updating Nextcloud.

FAQ
---

Why Did Nextcloud Add Code Signing?
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

By supporting Code Signing we add another layer of security by ensuring that
nobody other than authorized persons can push updates for applications, and
ensuring proper upgrades.

Do We Lock Down Nextcloud?
^^^^^^^^^^^^^^^^^^^^^^^^^^

The Nextcloud project is open source and always will be. We do not want to make
it more difficult for our users to run Nextcloud. Any code signing errors on
upgrades will not prevent Nextcloud from running, but will display a warning on
the Admin page. For applications that are not tagged "Official" the code signing
process is optional.

Not Open Source Anymore?
^^^^^^^^^^^^^^^^^^^^^^^^

The Nextcloud project is open source and always will be. The code signing
process is optional, though highly recommended. The code check for the
core parts of Nextcloud is enabled when the Nextcloud release version branch has
been set to stable.

For custom distributions of Nextcloud it is recommended to change the release
version branch in version.php to something else than "stable".

Is Code Signing Mandatory For Apps?
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Code signing is optional for all third-party applications. Applications
with a tag of "Official" on apps.owncloud.com require code signing.

Technical details
-----------------

Nextcloud uses a X.509 based approach to handle authentication of code. Each
Nextcloud release contains the certificate of a shipped Nextcloud Code Signing
Root Authority. The private key of this certificate is only accessible to the
project leader, who may grant trusted project members with a copy of this
private key.

This Root Authority is only used for signing certificate signing requests (CSRs)
for additional certificates. Certificates issued by the Root Authority must
always to be limited to a specific scope, usually the application identifier.
This enforcement is done using the ``CN`` attribute of the certificate.

Code signing is then done by creating a  ``signature.json`` file with the
following content:

.. code-block:: json

  {
      "hashes": {
          "/filename.php":
          "2401fed2eea6f2c1027c482a633e8e25cd46701f811e2d2c10dc213fd95fa60e350b
          ccbbebdccc73a042b1a2799f673fbabadc783284cc288e4f1a1eacb74e3d",
          "/lib/base.php":
          "55548cc16b457cd74241990cc9d3b72b6335f2e5f45eee95171da024087d114fcbc2
          effc3d5818a6d5d55f2ae960ab39fd0414d0c542b72a3b9e08eb21206dd9"
      },
      "certificate": "-----BEGIN CERTIFICATE-----
      MIIBvTCCASagAwIBAgIUPvawyqJwCwYazcv7iz16TWxfeUMwDQYJKoZIhvcNAQEF\
      nBQAwIzEhMB8GA1UECgwYb3duQ2xvdWQgQ29kZSBTaWduaW5nIENBMB4XDTE1MTAx\
      nNDEzMTcxMFoXDTE2MTAxNDEzMTcxMFowEzERMA8GA1UEAwwIY29udGFjdHMwgZ8w\
      nDQYJKoZIhvcNAQEBBQADgY0AMIGJAoGBANoQesGdCW0L2L+a2xITYipixkScrIpB\
      nkX5Snu3fs45MscDb61xByjBSlFgR4QI6McoCipPw4SUr28EaExVvgPSvqUjYLGps\
      nfiv0Cvgquzbx/X3mUcdk9LcFo1uWGtrTfkuXSKX41PnJGTr6RQWGIBd1V52q1qbC\
      nJKkfzyeMeuQfAgMBAAEwDQYJKoZIhvcNAQEFBQADgYEAvF/KIhRMQ3tYTmgHWsiM\
      nwDMgIDb7iaHF0fS+/Nvo4PzoTO/trev6tMyjLbJ7hgdCpz/1sNzE11Cibf6V6dsz\
      njCE9invP368Xv0bTRObRqeSNsGogGl5ceAvR0c9BG+NRIKHcly3At3gLkS2791bC\
      niG+UxI/MNcWV0uJg9S63LF8=\n
      -----END CERTIFICATE-----",
      "signature": "U29tZVNpZ25lZERhdGFFeGFtcGxl"
  }

``hashes`` is an array of all files in the folder with their corresponding
SHA-512 hashes. ``certificate`` is the certificate used for signing. It has to
be issued by the Nextcloud Root Authority, and its CN needs to be permitted to
perform the required action. The ``signature`` is then a signature of the hashes
which can be verified using the certificate.

Having the certificate bundled within the ``signature.json`` file has the
advantage that even if a developer loses their certificate, future updates can
still be ensured by having a new certificate issued.

How Code Signing Affects Apps in the App Store
----------------------------------------------

- Apps which have an ``official`` tag **MUST** be code signed.
  Unsigned ``official`` apps won't be installable anymore.
- Apps which have been signed in a previous release **MUST** be code-signed in
  all future releases as well, otherwise the update will be refused.

How to Get Your App Signed
--------------------------

The following commands require that you have OpenSSL installed on your machine.
Ensure that you keep all generated files to sign your application. The following
examples will assume that you are trying to sign an application named
"contacts".

1. Generate a private key and CSR: ``openssl req -nodes -newkey rsa:2048 -keyout contacts.key -out contacts.csr -subj "/CN=contacts"``. Replace "contacts" with your application identifier.
2. Post the CSR at https://github.com/nextcloud/app-certificate-requests, and configure
   your GitHub account to show your mail address in your profile. Nextcloud
   might ask you for further information to verify that you're the legitimate
   owner of the application. Make sure to keep the private key file (``contacts.key``)
   secret and not disclose it to any third-parties.
3. Nextcloud will provide you with the signed certificate.
4. Run ``./occ integrity:sign-app`` to sign your application, and specify
   your private and the public key as well as the path to the application.
   A valid example looks like: ``./occ integrity:sign-app --privateKey=/Users/lukasreschke/contacts.key
   --certificate=/Users/lukasreschke/CA/contacts.crt --path=/Users/lukasreschke/Programming/contacts``

The occ tool will store a ``signature.json`` file within the ``appinfo`` folder
of your application. Then compress the application folder and upload it to
apps.owncloud.com. Be aware that doing any changes to the application after it
has been signed requires another signing. So if you do not want to have some
files shipped remove them before running the signing command.

In case you lose your certificate please submit a new CSR as described above and
mention that you have lost the previous one. Nextcloud will revoke the old
certificate.

If you maintain an app together with multiple people it is recommended to
designate a release manager responsible for the signing process as well
as the uploading to apps.owncloud.com. If there are cases where this is not
feasible and multiple certificates are required Nextcloud can create them on a
case by case basis. We do not recommend developers to share their private key.

Errors
------

The following errors can be encountered when trying to verify a code signature.
For information about how to get access to those results please refer to the
Issues section of the Nextcloud Server Administration
manual.

- ``INVALID_HASH``

  - The file has a different hash than specified within ``signature.json``. This
    usually happens when the file has been modified after writing the signature
    data.

- ``MISSING_FILE``

  - The file cannot be found but has been specified within ``signature.json``.
    Either a required file has been left out, or ``signature.json`` needs to be
    edited.

- ``EXTRA_FILE``

  - The file does not exist in ``signature.json``. This usually happens when a
    file has been removed and ``signature.json`` has not been updated.

- ``EXCEPTION``

  - Another exception has prevented the code verification. There are currently
    these following exceptions:

    - ``Signature data not found.```

      - The app has mandatory code signing enforced but no ``signature.json``
        file has been found in its ``appinfo`` folder.

    - ``Certificate is not valid.``

      - The certificate has not been issued by the official Nextcloud Code
        Signing Root Authority.

    - ``Certificate is not valid for required scope. (Requested: %s, current:
      %s)``

      - The certificate is not valid for the defined application. Certificates
        are only valid for the defined app identifier and cannot be used for
        others.

    - ``Signature could not get verified.``

      - There was a problem with verifying the signature of ``signature.json``.
