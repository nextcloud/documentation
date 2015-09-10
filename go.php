<?php

############## Add new references here  ##################
############## Adjust when editing docs ##################

$mapping = array(
    'admin-background-jobs'   => '/admin_manual/configuration_server/background_jobs_configuration.html',
    'admin-dir_permissions'   => '/admin_manual/installation/installation_wizard.html#setting-strong-directory-permissions',
    'admin-encryption'        => '/admin_manual/configuration_files/encryption_configuration.html',
    'admin-external-storage'  => '/admin_manual/configuration_files/external_storage_configuration_gui.html',
    'admin-install'           => '/admin_manual/installation/index.html',
    'admin-ldap'              => '/admin_manual/configuration_user/user_auth_ldap.html',
    'admin-provisioning-api'  => '/admin_manual/configuration_user/user_provisioning_api.html',
    'admin-sharing'           => '/admin_manual/configuration_files/file_sharing_configuration.html',
    'admin-sharing-federated' => '/admin_manual/configuration_files/federated_cloud_sharing_configuration.html',
    'admin-source_install'    => '/admin_manual/installation/source_installation.html',
    'admin-backup'            => '/admin_manual/maintenance/backup.html',
    'admin-monitoring'        => '/admin_manual/operations/considerations_on_monitoring.html',
    'admin-performance'       => '/admin_manual/configuration_server/performance_tuning.html',
    'admin-config'            => '/admin_manual/configuration_server/config_sample_php_parameters.html',
    'admin-db-conversion'     => '/admin_manual/configuration_database/db_conversion.html',
    'admin-security'          => '/admin_manual/configuration_server/harden_server.html',
    'admin-email'             => '/admin_manual/configuration_server/email_configuration.html',
    'admin-reverse-proxy'     => '/admin_manual/configuration_server/reverse_proxy_configuration.html',
    'admin-php-fpm'           => '/admin_manual/installation/source_installation.html#configuration-notes-to-php-fpm',
    'admin-transactional-locking' => '/admin_manual/configuration_files/files_locking_transactional.html',

    'developer-theming'       => '/developer_manual/core/theming.html',

    'user-encryption'         => '/user_manual/files/encrypting_files.html',
    'user-files'              => '/user_manual/files/index.html',
    'user-manual'             => '/user_manual',
    'user-sharing-federated'  => '/user_manual/files/federated_cloud_sharing.html',
    'user-sync-calendars'     => '/user_manual/pim/calendar.html#synchronizing-calendars-using-caldav',
    'user-sync-contacts'      => '/user_manual/pim/contacts.html#synchronizing-address-books',
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

