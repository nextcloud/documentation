.. _ubuntu_installation_label:

Example installation on Ubuntu 18.04 LTS
========================================

Or you can use .deb packages to install the required and recommended modules for a typical Nextcloud
installation, using Apache and MariaDB, by issuing the following commands in a
terminal::

    apt-get install apache2 mariadb-server libapache2-mod-php7.2
    apt-get install php7.2-gd php7.2-json php7.2-mysql php7.2-curl php7.2-mbstring
    apt-get install php7.2-intl php-imagick php7.2-xml php7.2-zip

* This installs the packages for the Nextcloud core system. 
  If you are planning on running additional apps, keep in mind that they might require additional
  packages.  See :ref:`prerequisites_label` for details.

* At the installation of the MySQL/MariaDB server, you will be prompted to
  create a root password. Be sure to remember your password as you will need it
  during Nextcloud database setup.

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

    tar -xjf nextcloud-x.y.z.tar.bz2
    unzip nextcloud-x.y.z.zip

* This unpacks to a single ``nextcloud`` directory. Copy the Nextcloud directory
  to its final destination. When you are running the Apache HTTP server you may
  safely install Nextcloud in your Apache document root::

    cp -r nextcloud /path/to/webserver/document-root

  where ``/path/to/webserver/document-root`` is replaced by the
  document root of your Web server::

    cp -r nextcloud /var/www

On other HTTP servers it is recommended to install Nextcloud outside of the
document root.
