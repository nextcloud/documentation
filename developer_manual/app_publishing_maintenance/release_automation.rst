==================
Release Automation
==================

.. sectionauthor:: Benjamin Brahmer <info@b-brahmer.de>

Automation is a great thing, it prevents mistakes and makes your life easier, which gives you more time to work on
all those features you wanted to implement.

GitHub Actions
--------------

If your application's repository lives on GitHub, GitHub Actions can build your app, sign it, attach the tarball to
the GitHub release, and publish it to the Nextcloud App Store when you publish a release.

The `app template <https://github.com/nextcloud/app_template>`_ ships a ready-to-use workflow at
``.github/workflows/appstore-build-publish.yml``. Apps created from that template (or the
`App Store app generator <https://apps.nextcloud.com/developer/apps/generate>`_) already include it.
For existing repositories, copy that file from the template into your repo.

The workflow builds frontend and PHP dependencies, packages with Krankerl when ``krankerl.toml`` is present
(otherwise ``make appstore``), signs the archive, attaches it to the GitHub release, and uploads it to the
App Store.

Setup
~~~~~

1. Ensure your app has an approved signing certificate. See :ref:`app-code-signing`. The workflow downloads the
   public certificate from
   `nextcloud/app-certificate-requests <https://github.com/nextcloud/app-certificate-requests>`_ for you. You only
   need to store the private key as a secret.

2. In ``.github/workflows/appstore-build-publish.yml``, set ``APP_NAME`` to your app id. It must match
   ``<id>`` in ``appinfo/info.xml`` and the certificate folder name in ``app-certificate-requests``

      env:
        APP_NAME: your_app_id

3. Create a GitHub Actions environment named ``release`` (repository **Settings** → **Environments**).
   Enable **Required reviewers** and add only people you trust to approve releases. Add these environment
   secrets:

   * ``APP_PRIVATE_KEY`` — your app's private key (from the code signing setup)
   * ``APPSTORE_TOKEN`` — from your App Store developer account at
     https://apps.nextcloud.com/account/token

   The workflow job uses ``environment: release``, so every publish waits for an approval from a required
   reviewer before secrets are available.

   If your repository is outside the Nextcloud organization you may store the same secrets under repository
   **Secrets** instead. Anyone with write access can then trigger a release.

4. Keep packaging related files from the template in sync with your app: ``krankerl.toml`` (build commands),
   ``.nextcloudignore`` (files excluded from the tarball), and ensure ``/build/`` is in ``.gitignore``.

Do not commit the private key. The public certificate does not need to be a secret; the workflow fetches it
from ``app-certificate-requests``.

The process
~~~~~~~~~~~

1. Bump ``<version>`` in ``appinfo/info.xml`` and merge the change to the default branch.
2. Create a GitHub release whose tag is ``v`` plus that version (for example version ``1.0.0`` → tag
   ``v1.0.0``). The workflow fails if the tag and ``info.xml`` version do not match.
3. Publish the release. Approve the pending ``release`` environment deployment when and if prompted (Actions or
   notifications).
4. When the workflow finishes, the signed ``your_app_id-v1.0.0.tar.gz`` is attached to the GitHub release and
   the version appears on the App Store.
