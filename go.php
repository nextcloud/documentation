<?php

############## Add new references here  ##################
############## Adjust when editing docs ##################

$mapping = array(
    'admin-background-jobs'   => '/server/9/admin_manual/configuration_server/background_jobs_configuration.html',
    'admin-dir_permissions'   => '/server/9/admin_manual/installation/installation_wizard.html#setting-strong-directory-permissions',
    'admin-encryption'        => '/server/9/admin_manual/configuration_files/encryption_configuration.html',
    'admin-external-storage'  => '/server/9/admin_manual/configuration_files/external_storage_configuration_gui.html',
    'admin-install'           => '/server/9/admin_manual/installation/index.html',
    'admin-ldap'              => '/server/9/admin_manual/configuration_user/user_auth_ldap.html',
    'admin-provisioning-api'  => '/server/9/admin_manual/configuration_user/user_provisioning_api.html',
    'admin-sharing'           => '/server/9/admin_manual/configuration_files/file_sharing_configuration.html',
    'admin-sharing-federated' => '/server/9/admin_manual/configuration_files/federated_cloud_sharing_configuration.html',
    'admin-source_install'    => '/server/9/admin_manual/installation/source_installation.html',
    'admin-backup'            => '/server/9/admin_manual/maintenance/backup.html',
    'admin-monitoring'        => '/server/9/admin_manual/operations/considerations_on_monitoring.html',
    
    'admin-performance'       => '/server/9/admin_manual/configuration_server/oc_server_tuning.html',
    'admin-config'            => '/server/9/admin_manual/configuration_server/config_sample_php_parameters.html',
    'admin-db-conversion'     => '/server/9/admin_manual/configuration_database/db_conversion.html',
    'admin-security'          => '/server/9/admin_manual/configuration_server/harden_server.html',
    'admin-email'             => '/server/9/admin_manual/configuration_server/email_configuration.html',
    'admin-reverse-proxy'     => '/server/9/admin_manual/configuration_server/reverse_proxy_configuration.html',
    'admin-php-fpm'           => '/server/9/admin_manual/installation/source_installation.html#configuration-notes-to-php-fpm',
    'admin-transactional-locking' => '/server/9/admin_manual/configuration_files/files_locking_transactional.html',
    'admin-code-integrity' => '/server/9/admin_manual/issues/code_signing.html',
    'admin-setup-well-known-URL' => '/server/9/admin_manual/issues/general_troubleshooting.html#service-discovery',
    
    'admin-enterprise-license' => '/server/9/admin_manual/enterprise_installation/license_keys_installation.html',

    'developer-theming'       => '/server/9/developer_manual/core/theming.html',
    'developer-code-integrity'=> '/server/9/developer_manual/app/code_signing.html',

    'user-encryption'         => '/server/9/user_manual/files/encrypting_files.html',
    'user-files'              => '/server/9/user_manual/files/index.html',
    'user-manual'             => '/server/9/user_manual',
    'user-sharing-federated'  => '/server/9/user_manual/files/federated_cloud_sharing.html',
    'user-sync-calendars'     => '/server/9/user_manual/pim/calendar.html#synchronizing-calendars-using-caldav',
    'user-sync-contacts'      => '/server/9/user_manual/pim/contacts.html#synchronizing-address-books',
    'user-trashbin'           => '/server/9/user_manual/files/deleted_file_management.html',
    'user-versions'           => '/server/9/user_manual/files/version_control.html',
    'user-webdav'             => '/server/9/user_manual/files/access_webdav.html',
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
        header('Location: ' . $location . '/server/9/admin_manual');
    } else if (strpos($from, 'developer-') === 0) {
        header('Location: ' . $location . '/server/9/developer_manual');
    } else {
        header('Location: ' . $location . '/server/9/user_manual');
    }
}
