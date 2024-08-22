==================
Release Automation
==================

.. sectionauthor:: Benjamin Brahmer <info@b-brahmer.de>

Automation is a great thing, it prevents mistakes and makes your life easier, which gives you more time to work on all those features you wanted to implement.

GitHub Actions
--------------
If your application's repository lives on GitHub, as many Nextcloud applications do, GitHub Actions is a great way to automate the release of your app from the git repository into the Nextcloud App Store.

One easy way to get you started is to use https://github.com/R0Wi/nextcloud-appstore-push-action in your repository together with a few other actions. You can automatically build your app and publish it to the App Store. It supports pre-releases and code signing.
To get started you create a new yaml file in the ``.github/workflows`` directory.

.. code-block:: yaml

  name: Build and publish app release

  on:
    release:
        types: [published]

  env:
    APP_NAME: news

  jobs:
    build_and_publish:
      environment: release
      runs-on: ubuntu-latest
      name: "Release: build, sign and upload the app"
      strategy:
        matrix:
          php-versions: ['7.4']
          nextcloud: ['stable21']
          database: ['sqlite']
      steps:
        - name: Checkout
          uses: actions/checkout@5a4ac9002d0be2fb38bd78e4b4dbde5606d7042f

        - name: Setup PHP
          uses: shivammathur/setup-php@afefcaf556d98dc7896cca380e181decb609ca44
          with:
            php-version: ${{ matrix.php-versions }}
            extensions: pdo_sqlite,pdo_mysql,pdo_pgsql,gd,zip
            coverage: none

        - name: Set up server non MySQL
          uses: SMillerDev/nextcloud-actions/setup-nextcloud@fae87e29aa7cdf1ea0b8033c67f60e75b10be2cd
          with:
            cron: false
            version: ${{ matrix.nextcloud }}
            database-type: ${{ matrix.database }}

        - name: Prime app build
          run: make

        - name: Configure server with app
          uses: SMillerDev/nextcloud-actions/setup-nextcloud-app@fae87e29aa7cdf1ea0b8033c67f60e75b10be2cd
          with:
            app: ${{ env.APP_NAME }}
            check-code: false

        - name: Create signed release archive
          run: |
            cd ../server/apps/${{ env.APP_NAME }} && make appstore
          env:
            app_private_key: ${{ secrets.APP_PRIVATE_KEY }}
            app_public_crt: ${{ secrets.APP_PUBLIC_CRT }}

        - name: Upload app tarball to release
          uses: svenstaro/upload-release-action@483c1e56f95e88835747b1c7c60581215016cbf2
          id: attach_to_release
          with:
            repo_token: ${{ secrets.GITHUB_TOKEN }}
            file: ../server/apps/${{ env.APP_NAME }}/build/artifacts/appstore/${{ env.APP_NAME }}.tar.gz
            asset_name: ${{ env.APP_NAME }}.tar.gz
            tag: ${{ github.ref }}
            overwrite: true

        - name: Upload app to Nextcloud appstore
          uses: R0Wi/nextcloud-appstore-push-action@a011fe619bcf6e77ddebc96f9908e1af4071b9c1
          with:
            app_name: ${{ env.APP_NAME }}
            appstore_token: ${{ secrets.APPSTORE_TOKEN }}
            download_url: ${{ steps.attach_to_release.outputs.browser_download_url }}
            app_private_key: ${{ secrets.APP_PRIVATE_KEY }}
            nightly: ${{ github.event.release.prerelease }}

        - name: Delete crt and key from local storage
          run: rm -f ~/.nextcloud/certificates/*

Make sure to check the used actions for useful updates, as they are pinned to a specific sha1 to prevent unnoticed harmful changes.

For this workflow to work we need to provide a few variables.

* ``APP_NAME`` set the name of your app, directly in the yaml

Then we have a few secrets make sure to handle them with care.
If your repository lives within the nextcloud organization you need to use an environment.

.. code-block:: yaml

      jobs:
        build_and_publish:
          environment: release
          runs-on: ubuntu-latest

In this example we use the "release" environment, open the settings of your repository and open the "Environments" tab, add a new environment with the name "release", make sure to activate "Required reviewers" only add the people you trust, they will be able to approve a release.
Save your rules and at the bottom add the following environment secrets.

* ``APP_PRIVATE_KEY`` your apps private key
* ``APP_PUBLIC_CRT`` your apps certificate, this one could be public but for easy usage we add it as a secret
* ``APPSTORE_TOKEN`` you get this from the App Store as a registered developer https://apps.nextcloud.com/account/token

If your app does not live in the Nextcloud organization you may also add the secrets above to the "Secrets" section but be careful everyone with write access to your repository will be able to create releases. Make also sure to delete the environment statement.

If you don't use code signing for your app you can delete the following section in your yaml.

.. code-block:: yaml

    env:
    app_private_key: ${{ secrets.APP_PRIVATE_KEY }}
    app_public_cert: ${{ secrets.APP_PUBLIC_CERT }}

Also make sure to remove ``environment: release`` .

Makefile changes for code signing
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
As your certificate and your private key now are stored in environment variables you need somehow convert them to a file.
One example you may use is provided by the news app.

.. code-block:: php

    #!/usr/bin/env php
    <?php
    /**
    * Nextcloud - News
    *
    * This file is licensed under the Affero General Public License version 3 or
    * later. See the COPYING file.
    *
    * @author Benjamin Brahmer <info@b-brahmer.de>
    * @copyright Benjamin Brahmer 2020
    */

    if ($argc < 2) {
        echo "This script expects two parameters:\n";
        echo "./file_from_env.php ENV_VAR PATH_TO_FILE\n";
        exit(1);
    }

    # Read environment variable
    $content = getenv($argv[1]);

    if (!$content){
        echo "Variable was empty\n";
        exit(1);
    }

    file_put_contents($argv[2], $content);

    echo "Done...\n";

It's a very simple php script that takes an environment variable and a filepath and dumps whatever it finds in the variable into the file.
After storing that script somewhere in your repository, you can use it in your Makefile.

.. code-block:: bash

    cert_dir=$(HOME)/.nextcloud/certificates
    [...]
    appstore:
    [...]
    # export the key and cert to a file
    mkdir -p $(cert_dir)
    php ./bin/tools/file_from_env.php "app_private_key" "$(cert_dir)/$(app_name).key"
    php ./bin/tools/file_from_env.php "app_public_crt" "$(cert_dir)/$(app_name).crt"
    [...]

Also make sure that these files are used when signing your app, in the Makefile.

.. code-block:: bash

    @if [ -f $(cert_dir)/$(app_name).key ]; then \
      echo "Signing app files…"; \
      php ../../occ integrity:sign-app \
        --privateKey=$(cert_dir)/$(app_name).key\
        --certificate=$(cert_dir)/$(app_name).crt\
        --path=$(appstore_sign_dir)/$(app_name); \
      echo "Signing app files ... done"; \
    fi


And that's basically everything you need to do, you can use the key and cert while you sign the app.

The process
~~~~~~~~~~~

1. Create a new release via GitHub, put whatever information you usually put.
2. Decide if this should be a normal or a pre-release, pre-releases will be uploaded as nightly version to the App Store.
3. When you are done, publish the release and wait a few minutes, you will see a request to approve the release, in Actions or your notifications.
4. If everything worked you find a ``appname.tar.gz`` as an attachment of the release.
5. Check the App Store for your newly released version, congratulations on your first automatically released app.