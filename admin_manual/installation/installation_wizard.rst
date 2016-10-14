===================
Installation Wizard
===================

Quick Start
-----------

When Nextcloud prerequisites are fulfilled and all Nextcloud files are installed, 
the last step to completing the installation is running the Installation 
Wizard. 
This is just three steps:

#. Point your Web browser to ``http://localhost/nextcloud``
#. Enter your desired administrator's username and password.
#. Click **Finish Setup**.

.. figure:: images/install-wizard-a.png
   :scale: 75%
   :alt: screenshot of the installation wizard   
   
You're finished and can start using your new Nextcloud server.   

Of course, there is much more that you can do to set up your Nextcloud server for 
best performance and security. In the following sections we will cover important 
installation and post-installation steps. Note that you must follow the 
instructions in :ref:`Setting Strong Permissions <strong_perms_label>` in order 
to use the :doc:`occ Command <../configuration_server/occ_command>`.

* :ref:`Data Directory Location <data_directory_location_label>`
* :ref:`Database Choice <database_choice_label>`
* :ref:`Trusted Domains <trusted_domains_label>`
* :ref:`Setting Strong Permissions <strong_perms_label>`

.. _data_directory_location_label:

Data Directory Location
-----------------------

Click **Storage and Database** to expose additional installation configuration 
options for your Nextcloud data directory and database.

.. figure:: images/install-wizard-a1.png
   :scale: 75%
   :alt: installation wizard with all options exposed

You should locate your Nextcloud data directory outside of your Web root if you 
are using an HTTP server other than Apache, or you may wish to store your 
Nextcloud data in a different location for other reasons (e.g. on a storage 
server). It is best to configure your data directory location at installation, 
as it is difficult to move after installation. You may put it anywhere; in this 
example is it located in ``/var/oc_data``. This directory must already exist, 
and must be owned by your HTTP user (see 
:ref:`strong_perms_label`).

.. _database_choice_label:

Database Choice
---------------

SQLite is the default database for Nextcloud Server and it is good only for
testing and lightweight single-user setups without client synchronization.
Supported databases are MySQL, MariaDB, Oracle 11g, and PostgreSQL, and we
recommend :doc:`MySQL/MariaDB <system_requirements>`. Your database and PHP
connectors must be installed before you run the Installation Wizard. When
you install Nextcloud from packages all the necessary dependencies will be
satisfied (see :doc:`source_installation` for a detailed listing of required
and optional PHP modules). You will need the root database login, or any
administrator login that has permissions to create and modify databases, and
then enter any name you want for your Nextcloud database.

After you enter your root or administrator login for your database, the 
installer creates a special database user with privileges limited to the 
Nextcloud database. Then Nextcloud needs only the special Nextcloud database 
user, and drops the root dB login. This user is named for your Nextcloud admin 
user, with an ``oc_`` prefix, and then given a random password. The Nextcloud 
database user and password are written into ``config.php``::

  'dbuser' => 'oc_molly',
  'dbpassword' => 'pX65Ty5DrHQkYPE5HRsDvyFHlZZHcm',  

Click Finish Setup, and start using your new Nextcloud server. 

.. figure:: images/install-wizard-a2.png
   :scale: 75%
   :alt: Nextcloud welcome screen after a successful installation

Now we will look at some important post-installation steps.

.. _trusted_domains_label: 

Trusted Domains
---------------

All URLs used to access your Nextcloud server must be whitelisted in your 
``config.php`` file, under the ``trusted_domains`` setting. Users 
are allowed to log into Nextcloud only when they point their browsers to a 
URL that is listed in the ``trusted_domains`` setting. You may use IP addresses 
and domain names. A typical configuration looks like this::

 'trusted_domains' => 
   array (
    0 => 'localhost', 
    1 => 'server1.example.com', 
    2 => '192.168.1.50',
 ),

The loopback address, ``127.0.0.1``, is automatically whitelisted, so as long 
as you have access to the physical server you can always log in. In the event 
that a load balancer is in place there will be no issues as long as it sends 
the correct X-Forwarded-Host header. When a user tries a URL that 
is not whitelisted the following error appears:

.. figure:: images/install-wizard-a4.png
   :scale: 75%
   :alt: Error message when URL is not whitelisted
  
.. _strong_perms_label:
 
Setting Strong Directory Permissions
------------------------------------

For hardened security we recommend setting the permissions on your Nextcloud
directories as strictly as possible. This should be done immediately after the
initial installation and before running the setup. Your HTTP user must own the
``config/``, ``data/`` and ``apps/`` directories so that you can configure
Nextcloud, create, modify and delete your data files, and install apps via the
Nextcloud Web interface.

You can find your HTTP user in your HTTP server configuration files. Or you can 
use :ref:`label-phpinfo` (Look for the **User/Group** line).

* The HTTP user and group in Debian/Ubuntu is ``www-data``.
* The HTTP user and group in Fedora/CentOS is ``apache``.
* The HTTP user and group in Arch Linux is ``http``.
* The HTTP user in openSUSE is ``wwwrun``, and the HTTP group is ``www``.

.. note:: When using an NFS mount for the data directory, do not change its 
   ownership from the default. The simple act of mounting the drive will set 
   proper permissions for Nextcloud to write to the directory. Changing 
   ownership as above could result in some issues if the NFS mount is 
   lost.

The easy way to set the correct permissions is to copy and save this script to
a suitable path location, perhaps ``/usr/local/bin/`` - then run the script
from within your Nextcloud installation directory.  As per the comments in
the script, you may setup additional environment variables on the command line
if required.  The script can also be used to prepare for less strict
permissions as required to do an upgrade::

 #!/bin/bash

 # Script: set-nextcloud-perms.sh
 #
 # Usage:
 #      /path/to/script/set-nextcloud-perms.sh [upgrade]
 #
 #  (run script whilst in your Nextcloud installation directory)
 #
 #
 # Other Notes:
 #
 # If your "nc_data" path is special, then prefix the cmdline as
 # with environment variables as required:
 #   nc_data=/path/to/data
 #
 # If your distro or setup has non-standard htuser and/or htgroup,
 # you should similarly prefix the environment variables as required:
 #   htuser=special_user htgroup=special_group
 #
 # Example with a cmdline variable:
 #   nc_data=/path/to/data /path/to/script/set-nextcloud-perms.sh [upgrade]

 #
 # Functions
 #

 do_cmd () {
     echo -e "${@}\n\n$(${@})\n"
     err_status=$?
     [ ! ${err_status} -eq 0 ] && {
         error_exit "Command failed with error: ${error_status}"
     }
 }

 error_exit () {
     echo -e "${1-"Unknown error"} -- exiting\n"
     error_exit=${2:-1}
     exit ${error_exit}
 }


 #
 # Main
 #

 # Default DocumentRoot
 DefaultDocumentRoot=/var/www/owncloud

 declare -A config

 # Setup htuser / htgroup based on determining Linux distro type
 # - exit if distro cannot be determined
 [ ! -z ${htuser} ] && {
     [ -z ${htgroup} ] && {
         echo -e "\n\thtuser is set to: ${htuser}"
         error_exit "\tbut ... htgroup must also be set"
     }
     config=(
         [distro]="User provided" \
         [htuser]=${htuser} \
         [htgroup]=${htgroup} \
     )
 } || {
      id -u www-data &>/dev/null && \
         config=(
             [distro]="Debian / Ubuntu based" \
             [htuser]=www-data \
             [htgroup]=www-data \
         )
 } || {
     id -u apache   &>/dev/null && \
         config=(
             [distro]="Fedora / CentOS based" \
             [htuser]=apache \
             [htgroup]=apache \
         )
 } || {
     id -u http     &>/dev/null && \
         config=(
             [distro]="Archlinux based" \
             [htuser]=http \
             [htgroup]=http \
         )
 } || {
     id -u wwwrun   &>/dev/null && \
         config=(
             [distro]="OpenSUSE based" \
             [htuser]=wwwrun \
             [htgroup]=www \
         )
 } || { error_exit "unknown platform"; }

 echo -e "\nDistro: ${config[distro]}\n"

 id -u ${config[htuser]} &>/dev/null || \
     error_exit "htuser: ${config[htuser]} does not exist" 2

 id -g ${config[htgroup]} &>/dev/null || \
     error_exit "htgroup: ${config[htgroup]} does not exist" 3

 # Are we preparing for an upgrade?
 #  - upgrade permissions need to be wider open
 [ "${1}" = "upgrade" ] && { upgrade=1; } || { upgrade=0; }


 # Determine Nextcloud installation, unless already set
 [ -z "${nc_path}" ] && {
     [ -f $(pwd)/occ ] && {
         nc_path=$(pwd)
     } || {
         nc_path="${DefaultDocumentRoot}"
         echo "Default Nextcloud path set"
     }
 }
 [ -f "${nc_path}"/occ ] || error_exit "Missing Nextcloud occ file"

 # Determine Nextcloud data path, unless already set
 [ -z "${nc_data}" ] && {
     nc_data=''
     [ -d $(pwd)/data  ] && { nc_data=$(pwd)/data; }
     [ -d $(pwd)--data ] && { nc_data=$(pwd)--data; }
 }

 [ -z "${nc_data}" ] && {
     nc_data="${DefaultDocumentRoot}/data"
     echo "Default data path set"
 }

 echo


 # Report detils
 # - exit if required path(s) do not exist
 [ -d "${nc_path}" ] && {
     echo -e "    Nextcloud installation path:   \"${nc_path}\""
 } || {
     error_exit  "     Missing Nextcloud directory -- "${nc_path}"\n"
 }

 [ -d "${nc_data}" ] && {
     echo -e "            Nextcloud Data path:   \"${nc_data}\"\n"
 } || {
     error_exit "Missing Nextcloud data directory -- "${nc_data}"\n"
 }

 echo -e "                 htuser:htgroup   ${config[htuser]}:${config[htgroup]}\n"

 # Allow for confirmation of details, if not suitable,
 # then script can be interupted using <ctrl>-c
 echo -en 'Hit <enter> to continue... or <ctrl>-c to quit '
 read dummy

 # If preparing for upgrade works, then set permissions more open, then exit
 [ ${upgrade} -eq 1 ] && {
     do_cmd chown -R ${config[htuser]}:${config[htgroup]} \
         "${nc_path}" "${nc_data}"
     echo -e "Ready for upgrade\n"
     exit
 }

 echo "Creating possible missing Directories"
 do_cmd mkdir -p "${nc_path}"/{assets,updater} "${nc_data}"

 echo "chmod Files and Directories"
 do_cmd find "${nc_path}"/ "${nc_data}"/ -type f -exec chmod 0640 {} \;
 do_cmd find "${nc_path}"/ "${nc_data}"/ -type d -exec chmod 0750 {} \;

 echo "chown Directories"
 do_cmd chown -R 0:${config[htgroup]} "${nc_path}"/

 # check for other expected (required) directories
 for pathx in "${nc_path}"/{apps,config,themes}/
 do
     [ ! -d ${pathx} ] && {
         error_exit "Missing required directory: ${pathx}\n"
     }
 done

 do_cmd chown -R ${config[htuser]}:${config[htgroup]} \
     "${nc_path}"/{apps,assets,config,themes,updater}/ "${nc_data}"/

 do_cmd chmod +x "${nc_path}"/occ

 echo "chmod/chown .htaccess"
 # Protect every instance of .htaccess
 # - NB: there may be more than these default files:
 #    ${ncpaath}/.htaccess
 #    "${nc_data}"/.htaccess
 do_cmd find "${nc_path}"/ "${nc_data}"/ -name .htaccess \
     -exec chmod 0644 {} \; \
     -exec chown 0:${config[htgroup]} {} \; \
     -ls

If you have customized your Nextcloud installation and your filepaths are 
different than the standard installation, then use environment variables
in the command line as detailed.

This lists the recommended modes and ownership for your Nextcloud directories 
and files:

* All files should be read-write for the file owner, read-only for the 
  group owner, and zero for the world
* All directories should be executable (because directories always need the 
  executable bit set), read-write for the directory owner, and read-only for 
  the group owner
* The :file:`apps/` directory should be owned by ``[HTTP user]:[HTTP group]``
* The :file:`config/` directory should be owned by ``[HTTP user]:[HTTP group]``
* The :file:`themes/` directory should be owned by ``[HTTP user]:[HTTP group]``
* The :file:`assets/` directory should be owned by ``[HTTP user]:[HTTP group]``
* The :file:`data/` directory should be owned by ``[HTTP user]:[HTTP group]``
* The :file:`[ocpath]/.htaccess` file should be owned by ``root:[HTTP group]``
* The :file:`data/.htaccess` file should be owned by ``root:[HTTP group]``
* Both :file:`.htaccess` files are read-write file owner, read-only group and 
  world

These strong permissions prevent upgrading your Nextcloud server; 
see :ref:`set_updating_permissions_label` for a script to quickly change 
permissions to allow upgrading.
