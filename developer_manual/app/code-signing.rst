============
Code Signing
============

.. sectionauthor:: Lukas Reschke <lukas@owncloud.com>

ownCloud supports code signing for the core releases as well as dedicated applications. Code signing gives our users an
additional layer of security by ensuring that nobody else than authorized persons can push updates for your applications.

It furthermore ensures that all upgrades have been executed properly. This means that no additional files are left as well
as all old files have been properly replaced. In the past invalid performed updates where a major source of errors when
updating ownCloud.

FAQ
===

Why did ownCloud add Code Signing?
----------------------------------
By supporting Code Signing we add another layer of security by ensuring that nobody else than authorized persons can push
updates for applications. As well we do ensure that people properly updated their ownCloud instances.

Do we lock down ownCloud?
-------------------------
The ownCloud project is open-source and will always be that. We do have no intentions to make it harder for people to
manually adjust their instances. In fact, any fail with the code integrity of ownCloud core while upgrading will not
prevent the usage of ownCloud. It will barely display a notification to the administrator. For applications that are not
tagged "Official" the code signing process is purely optional.

Not open-source anymore?
------------------------
ownCloud is an open-source project and will always be that. In fact, the code signing process is purely optional. The
code check for the core parts of ownCloud is furthermore only enabled when the ownCloud release version branch has been
set to stable.

For custom distributions of ownCloud it is recommended to change the release version branch in version.php to something
else than "stable".

Is code signing mandatory for my app?
-------------------------------------

Code signing is purely optional for all third-party applications. Applications with a tag of "Official" on apps.owncloud.com
do however require Code Signing.

Technical details
=================
ownCloud uses a X.509 based approach to handle authentication of code. Each ownCloud release contains the certificate of
a shipped ownCloud Code Signing Root Authority. The private key of this certificate is only accessible to the project leader
which may grant trusted key persons to a copy of this private key.

This Root Authority is only used for signing certificate signing requests (CSRs) for additional certificates. Certificates
issued by the Root Authority have always to be limited to a specific scope. Usually the application identifier. This
enforcement is done using the ``CN`` attribute of the certificate.

Code signing is then done by creating a  ``signature.json`` file with the following content:

.. code-block:: json

  {
      "hashes": {
          "/filename.php": "2401fed2eea6f2c1027c482a633e8e25cd46701f811e2d2c10dc213fd95fa60e350bccbbebdccc73a042b1a2799f673fbabadc783284cc288e4f1a1eacb74e3d",
          "/lib/base.php": "55548cc16b457cd74241990cc9d3b72b6335f2e5f45eee95171da024087d114fcbc2effc3d5818a6d5d55f2ae960ab39fd0414d0c542b72a3b9e08eb21206dd9"
      },
      "certificate": "-----BEGIN CERTIFICATE-----MIIBvTCCASagAwIBAgIUPvawyqJwCwYazcv7iz16TWxfeUMwDQYJKoZIhvcNAQEF\nBQAwIzEhMB8GA1UECgwYb3duQ2xvdWQgQ29kZSBTaWduaW5nIENBMB4XDTE1MTAx\nNDEzMTcxMFoXDTE2MTAxNDEzMTcxMFowEzERMA8GA1UEAwwIY29udGFjdHMwgZ8w\nDQYJKoZIhvcNAQEBBQADgY0AMIGJAoGBANoQesGdCW0L2L+a2xITYipixkScrIpB\nkX5Snu3fs45MscDb61xByjBSlFgR4QI6McoCipPw4SUr28EaExVvgPSvqUjYLGps\nfiv0Cvgquzbx/X3mUcdk9LcFo1uWGtrTfkuXSKX41PnJGTr6RQWGIBd1V52q1qbC\nJKkfzyeMeuQfAgMBAAEwDQYJKoZIhvcNAQEFBQADgYEAvF/KIhRMQ3tYTmgHWsiM\nwDMgIDb7iaHF0fS+/Nvo4PzoTO/trev6tMyjLbJ7hgdCpz/1sNzE11Cibf6V6dsz\njCE9invP368Xv0bTRObRqeSNsGogGl5ceAvR0c9BG+NRIKHcly3At3gLkS2791bC\niG+UxI/MNcWV0uJg9S63LF8=\n-----END CERTIFICATE-----",
      "signature": "U29tZVNpZ25lZERhdGFFeGFtcGxl"
  }

``hashes`` is an array of all files in the folder with their corresponding SHA-512 hashes. ``certificate`` is the certificate
used for signing. It has to be issued by the ownCloud Root Authority and it's CN needs to be permitted to perform the
required action. The ``signature`` is then a signature of the hashes which can be verified using the certificate.

Having the certificate bundled within the ``signature.json`` file has the advantage that even if a developer loses their
certificate future updates can still be ensured by having a new certificate issued.

How code-signing affects apps on the app store
==============================================
- Apps which have an ``official`` tag **MUST** be code-signed starting with ownCloud 9.0. Unsigned ``official`` apps won't be installable anymore.
- Apps which have been signed in a previous release **MUST** be code-signed in all future releases as well. Otherwise the update will be refused.

How to get your app signed
==========================

The following commands do require that you have OpenSSL installed on your machine. Ensure that you keep all generated
files as you require them later to sign your application. The following examples will assume that you are trying to sign
an application named "contacts".

1. Generate a private key and CSR: ``openssl req -new -newkey rsa:2048 -nodes -keyout contacts.key -out contacts.csr``
  - Country Name: [press enter]
  - State or Province name: [press enter]
  - Organization Name: [press enter]
  - Organizational Unit Name: [press enter]
  - Common Name: contacts
  - Email Address: [press enter]
  - A challenge password: [press enter]
  - An optional company name: [press enter]
2. Post the CSR at https://github.com/owncloud/appstore-issues as well configure your GitHub account to show your mail address in your profile. ownCloud might ask you for further information to verify that you're the legitimate owner of the application.
3. ownCloud will provide you with the signed certificate.
4. Run ``./occ integrity:sign-app`` to sign your application, ensure to specify the private and the public key. A valid example may look such as: ``./occ integrity:sign-app --privateKey=/Users/lukasreschke/contacts.key --certificate=/Users/lukasreschke/CA/contacts.crt --appId=contacts``

The occ tool will store a ``signature.json`` file within the ``appinfo`` folder of your application. Do then compress the
application folder and upload it to apps.owncloud.com. Be aware that doing any changes to the application after it has
been signed requires another signing. So if you do not want to have some files shipped remove them before running the
signing command.

In case you loose your certificate please submit a new CSR as described above and mention that you have lost the previous
one. Note that ownCloud will revoke the old certificate.

Errors
======

The following errors can be encountered when trying to verify a code signature. For information about how to get access
to those results please refer to the administrator manual.

- ``INVALID_HASH``

  - The file has a different hash than specified within ``signature.json``. This usually happens when the file has been modified again after writing the signature data.

- ``MISSING_FILE``

  - The file cannot be found but has been specified within ``signature.json``. This usually happens when a file has been forgotten to copy.

- ``EXTRA_FILE``

  - The file does not exist in ``signature.json``. This usually happens when a file has been forgotten to delete.

- ``EXCEPTION``

  - Another exception has prevented the code verification. There are currently the following exceptions:

    - ``Signature data not found.```

      - The app has mandatory code signing enforced but no ``signature.json`` file has been found in it's ``appinfo`` folder.

    - ``Certificate is not valid.``

      - The certificate has not been issued by the official ownCloud Code Signing Root Authority.

    - ``Certificate is not valid for required scope. (Requested: %s, current: %s)``

      - The certificate is not valid for the defined application. Certificates are only valid for the defined app identifier and cannot be used for others.

    - ``Signature could not get verified.``

      - There was a problem with verifying the signature of ``signature.json``.

