Initial setup
=============

User management
---------------------------
:doc:`Create and manage user accounts <../configuration_user/user_configuration>`:  
Use the **Admin Panel** or the ``occ`` command tool to create user accounts, manage groups, and assign administrative roles.

:doc:`Two-factor authentication <../configuration_user/two_factor-auth>`:  
Configure and manage multi-factor authentication (2FA) settings, including enabling, enforcing, and configuring 2FA providers through the **Admin Settings** or command-line interface.

:doc:`LDAP integration <../configuration_user/user_auth_ldap>`:  
Set up Nextcloud to integrate with an LDAP server for centralized user authentication management.

:doc:`Provisioning API <../configuration_user/user_provisioning_api>`:  
Automate user provisioning with the Provisioning API for bulk account creation and management.

Data and storage management
-------------------------------------------
:doc:`File Sharing configuration <../configuration_files/file_sharing_configuration>`:  
Configure file-sharing policies through the **Admin interface** or adjust defaults by modifying the ``config.php`` file.

:doc:`Object storage as primary storage <../configuration_files/primary_storage>`:  
Configure supported object storage backends by modifying the ``objectstore`` section in the ``config.php`` file.

:doc:`External storage management <../configuration_files/external_storage_configuration_gui>`: Manage external storage connections, including configuration, setup, and maintenance.

:doc:`Encryption configuration <../configuration_files/encryption_configuration>`:  
Manage server-side encryption settings to secure your data through the **Admin interface** or using ``occ`` commands.

:doc:`Backup & restore automation <../maintenance/backup>`:  
Use ``cron`` jobs and third-party backup tools to automate regular backups of the Nextcloud instance, ensuring backup integrity and disaster recovery readiness through routine verification and testing.

Logging
--------------
:ref:`Accessing logs <log-files_label>`:  
View logs to monitor Nextcloud activity.

:ref:`Adjusting log levels <log-levels>`:  
Modify logging verbosity by changing log level.

:ref:`Troubleshooting <log-problems>`:  
Check log files for errors and issues.

Configuration and optimization
------------------------------------------

:doc:`Configuration parameters <../configuration_server/config_sample_php_parameters>`: Define and modify Nextcloud configuration parameters to customize and control the system's behavior and functionality.

:doc:`Database optimization <../configuration_database/linux_database_configuration>`:  
Optimize MySQL, PostgreSQL, or Oracle performance through custom server settings.

Upgrade and versioning
---------------------------------
:doc:`Upgrade Process <../maintenance/upgrade>`:  
Upgrade Nextcloud via the **Built-in Updater** (web or CLI) or manually using a downloaded archive file.

:doc:`Release notes <../release_notes/index>`: 
Prior to upgrading, review the release notes and changelogs available on the Nextcloud GitHub repository or official documentation.

Email setup and backup
----------------------------------
:doc:`Email configuration <../configuration_server/email_configuration>`:  
Configure email account settings and server integrations for Nextcloud.

Hardening and security
--------------------------------
:doc:`Hardening and security guidance <harden_server>`: Enhance the security and integrity of your Nextcloud instance by implementing measures like HTTPS via SSL/TLS, strong passwords, and regular updates.

Customization and extensibility
--------------------------------------------
:doc:`Theming and branding <../configuration_server/theming>`:  
Customize the look and feel of Nextcloud through theme modification, custom CSS, and custom theme development.

Troubleshooting
-----------------------
:doc:`Admin page warnings <../configuration_server/security_setup_warnings>`: Review and address system warnings in the **Admin Panel** related to server configuration issues.

:doc:`General troubleshooting <../issues/general_troubleshooting>`:  
Troubleshoot Nextcloud issues using forums, bug tracking, and official documentation.

