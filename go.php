<?php

############## Add new references here  ##################
############## Adjust when editing docs ##################

$mapping = array(
    'admin-dir_permissions'   => '/admin_manual/installation/installation_wizard.html#setting-strong-directory-permissions',
    'admin-encryption'        => '/admin_manual/configuration/encryption_configuration.html',
    'admin-external-storage'  => '/admin_manual/configuration/external_storage_configuration_gui.html',
    'admin-install'           => '/admin_manual/installation/index.html',
    'admin-ldap'              => '/admin_manual/configuration/user_auth_ldap.html',
    'admin-provisioning-api'  => '/admin_manual/configuration/user_provisioning_api.html',
    'admin-source_install'    => '/admin_manual/installation/source_installation.html',

    'user-encryption'         => '/user_manual/files/encryption.html',
    'user-files'              => '/user_manual/files/index.html',
    'user-manual'             => '/user_manual',
    'user-sync-calendars'     => '/user_manual/pim/calendar.html#synchronising-calendars-with-caldav',
    'user-sync-contacts'      => '/user_manual/pim/contacts.html#keeping-your-addressbook-in-sync',
    'user-trashbin'           => '/user_manual/files/deletedfiles.html',
    'user-versions'           => '/user_manual/files/versioncontrol.html',
    'user-webdav'             => '/user_manual/files/files.html',
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
    } else {
        header('Location: ' . $location . '/user_manual');
    }
}

