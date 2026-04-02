.. _ubuntu_installation_label:

========================================
Example installation on Ubuntu 22.04 LTS
========================================

You can use .deb packages to install the required and recommended modules for a
typical Nextcloud installation, using Apache and MariaDB, by issuing the
following commands in a terminal::

    sudo apt update && sudo apt upgrade
    sudo apt install apache2 mariadb-server libapache2-mod-php php-gd php-mysql \
    php-curl php-mbstring php-intl php-gmp php-bcmath php-xml php-imagick php-zip

* This installs the packages for the Nextcloud core system. 
  If you are planning on running additional apps, keep in mind that they might
  require additional packages.  See `Prerequisites for manual installation <https://docs.nextcloud.com/server/latest/admin_manual/installation/source_installation.html#prerequisites-for-manual-installation>`_ for details.

.. TODO ON RELEASE: Update version number above on release

Now you need to create a database user and the database itself by using the
MySQL command line interface. The database tables will be created by Nextcloud
when you login for the first time.

To start the MySQL command line mode use the following command::

  sudo mysql

Then a **MariaDB [root]>** prompt will appear. Now enter the following lines,
replacing ``username`` and ``password`` with appropriate values, and confirm
them with the Enter key:

::

  CREATE USER 'username'@'localhost' IDENTIFIED BY 'password';
  CREATE DATABASE IF NOT EXISTS nextcloud CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
  GRANT ALL PRIVILEGES ON nextcloud.* TO 'username'@'localhost';
  FLUSH PRIVILEGES;

You can quit the prompt by entering::

  quit;

Now download the archive of the latest Nextcloud version:

* Go to the `Nextcloud Download Page <https://nextcloud.com/install>`_.
* Go to **Download Nextcloud Server > Download > Archive file for
  server owners** and download either the tar.bz2 or .zip archive.
* This downloads a file named nextcloud-x.y.z.tar.bz2 or nextcloud-x.y.z.zip
  (where x.y.z is the version number).
* Download its corresponding checksum file, e.g. nextcloud-x.y.z.tar.bz2.md5,
  or nextcloud-x.y.z.tar.bz2.sha256.
* Verify the MD5 or SHA256 sum::

    md5sum -c nextcloud-x.y.z.tar.bz2.md5 < nextcloud-x.y.z.tar.bz2
    sha256sum -c nextcloud-x.y.z.tar.bz2.sha256 < nextcloud-x.y.z.tar.bz2
    md5sum  -c nextcloud-x.y.z.zip.md5 < nextcloud-x.y.z.zip
    sha256sum  -c nextcloud-x.y.z.zip.sha256 < nextcloud-x.y.z.zip

* You may also verify the PGP signature::

    wget https://download.nextcloud.com/server/releases/nextcloud-x.y.z.tar.bz2.asc
    wget https://nextcloud.com/nextcloud.asc
    gpg --import nextcloud.asc
    gpg --verify nextcloud-x.y.z.tar.bz2.asc nextcloud-x.y.z.tar.bz2

* Now you can extract the archive contents. Run the appropriate unpacking
  command for your archive type::

    tar -xjvf nextcloud-x.y.z.tar.bz2
    unzip nextcloud-x.y.z.zip

* This unpacks to a single ``nextcloud`` directory. Copy the Nextcloud directory
  to its final destination. When you are running the Apache HTTP server you may
  safely install Nextcloud in your Apache document root::

    sudo cp -r nextcloud /var/www

* Finally, change the ownership of your Nextcloud directories to your HTTP
  user::

    sudo chown -R www-data:www-data /var/www/nextcloud

On other HTTP servers it is recommended to install Nextcloud outside of the
document root.

Next steps
----------

After installing the prerequisites and extracting the nextcloud directory, you
should follow the instructions for Apache configuration at
:ref:`apache_configuration_label`. Once Apache is installed, you can optionally
follow the :doc:`source_installation` guide from :ref:`pretty_urls_label` until
:ref:`other_HTTP_servers_label`
