<?php

############## Add new references here  ##################
############## Adjust when editing docs ##################

$mapping = array(
    'admin-antivirus-configuration'     => '/admin_manual/configuration_server/antivirus_configuration.html',
    'admin-background-jobs'   => '/admin_manual/configuration_server/background_jobs_configuration.html',
    'admin-backup'            => '/admin_manual/maintenance/backup.html',
    'admin-bigint-conversion' => '/admin_manual/configuration_database/bigint_identifiers.html',
    'admin-code-integrity'    => '/admin_manual/issues/code_signing.html',
    'admin-config'            => '/admin_manual/configuration_server/config_sample_php_parameters.html',
    'admin-db-conversion'     => '/admin_manual/configuration_database/db_conversion.html',
    'admin-dir_permissions'   => '/admin_manual/installation/installation_wizard.html#setting-strong-directory-permissions',
    'admin-email'             => '/admin_manual/configuration_server/email_configuration.html',
    'admin-encryption'        => '/admin_manual/configuration_files/encryption_configuration.html',
    'admin-external-storage'  => '/admin_manual/configuration_files/external_storage_configuration_gui.html',
    'admin-files-access-control' => '/admin_manual/file_workflows/access_control.html',
    'admin-files-automated-tagging' => '/admin_manual/file_workflows/automated_tagging.html',
    'admin-files-retention'   => '/admin_manual/file_workflows/retention.html',
    'admin-install'           => '/admin_manual/installation/index.html',
    'admin-ldap'              => '/admin_manual/configuration_user/user_auth_ldap.html',
    'admin-mysql-utf8mb4'     => '/admin_manual/configuration_database/mysql_4byte_support.html',
    'admin-performance'       => '/admin_manual/configuration_server/server_tuning.html',
    'admin-php-fpm'           => '/admin_manual/installation/source_installation.html#php-fpm-tips-label',
    'admin-php-opcache'       => '/admin_manual/configuration_server/server_tuning.html#enable-php-opcache',
    'admin-provisioning-api'  => '/admin_manual/configuration_user/user_provisioning_api.html',
    'admin-reverse-proxy'     => '/admin_manual/configuration_server/reverse_proxy_configuration.html',
    'admin-security'          => '/admin_manual/configuration_server/harden_server.html',
    'admin-setup-well-known-URL' => '/admin_manual/issues/general_troubleshooting.html#service-discovery',
    'admin-sharing'           => '/admin_manual/configuration_files/file_sharing_configuration.html',
    'admin-sharing-federated' => '/admin_manual/configuration_files/federated_cloud_sharing_configuration.html',
    'admin-source_install'    => '/admin_manual/installation/source_installation.html',
    'admin-sso'               => '/admin_manual/configuration_server/sso_configuration.html',
    'admin-theming-icons'     => '/admin_manual/configuration_server/theming.html#theming-of-icons',
    'admin-transactional-locking' => '/admin_manual/configuration_files/files_locking_transactional.html',
    'admin-trusted-domains'   => '/admin_manual/installation/installation_wizard.html#trusted-domains',
    'admin-update'            => '/admin_manual/maintenance/update.html',
    
    'developer-code-integrity'=> '/developer_manual/app/code_signing.html',
    'developer-manual'        => '/developer_manual',
    'developer-theming'       => '/developer_manual/core/theming.html',

    'user-encryption'         => '/user_manual/files/encrypting_files.html',
    'user-files'              => '/user_manual/files/index.html',
    'user-manual'             => '/user_manual',
    'user-sharing-federated'  => '/user_manual/files/federated_cloud_sharing.html',
    'user-sync-calendars'     => '/user_manual/pim/calendar.html',
    'user-sync-contacts'      => '/user_manual/pim/contacts.html',
    'user-trashbin'           => '/user_manual/files/deleted_file_management.html',
    'user-versions'           => '/user_manual/files/version_control.html',
    'user-webdav'             => '/user_manual/files/access_webdav.html',
);

############# Do not edit below this line #################

$from = $_GET['to'];
$proto = isset($_SERVER['HTTPS']) ? 'https' : 'http';
$port = $_SERVER['SERVER_PORT'];
$port = ($port !== '80' && $port !== '443') ? ":$port" : '';
$name = $_SERVER['SERVER_NAME'];
$path = dirname($_SERVER['REQUEST_URI']);
$location = "$proto://$name$port$path";

header('HTTP/1.1 302 Moved Temporarily');
if (array_key_exists($from, $mapping)) {
    header('Location: ' . $location . $mapping[$from]);
} else {
    if (strpos($from, 'admin-') === 0) {
        header('Location: ' . $location . '/admin_manual');
    } else if (strpos($from, 'developer-') === 0) {
        header('Location: ' . $location . '/developer_manual');
    } else {
        header('Location: ' . $location . '/user_manual');
    }
}
