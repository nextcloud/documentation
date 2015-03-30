<?php

############## Add new references here  ##################
############## Adjust when editing docs ##################

$mapping = array(
    'admin-dir_permissions'   => '/admin_manual/installation/installation_wizard.html#setting-strong-directory-permissions',
    'admin-encryption'        => '/admin_manual/configuration_files/encryption_configuration.html',
    'admin-external-storage'  => '/admin_manual/configuration_files/external_storage_configuration_gui.html',
    'admin-install'           => '/admin_manual/installation/index.html',
    'admin-ldap'              => '/admin_manual/configuration_user/user_auth_ldap.html',
    'admin-provisioning-api'  => '/admin_manual/configuration_user/user_provisioning_api.html',
    'admin-source_install'    => '/admin_manual/installation/source_installation.html',
    'admin-backup'            => '/admin_manual/maintenance/backup.html',
    'admin-monitoring'        => '/admin_manual/operations/considerations_on_monitoring.html',
    'admin-performance'       => '/admin_manual/configuration_server/performance_tuning.html',
    'admin-config'            => '/admin_manual/configuration_server/config_sample_php_parameters.html',
    'admin-db-conversion'     => '/admin_manual/configuration_database/db_conversion.html',
    'admin-security'          => '/admin_manual/configuration_server/hardening.html',

    'developer-theming'       => '/developer_manual/core/theming.html',

    'user-encryption'         => '/user_manual/files/encrypting_files.html',
    'user-files'              => '/user_manual/files/index.html',
    'user-manual'             => '/user_manual',
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

