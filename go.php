<?php

############## Add new references here  ##################
############## Adjust when editing docs ##################

$mapping = array(
               'admin-ldap'              => '/admin_manual/configuration/auth_ldap.html',
               'admin-dir_permissions'   => '/admin_manual/installation/installation_source.html#setting-secure-directory-permissions',
               'admin-source_install'    => '/admin_manual/installation/installation_source.html',
               'admin-install'           => '/admin_manual/installation/index.html',
               'admin-encryption'        => '/admin_manual/configuration/configuration_encryption.html',
               'admin-external-storage'  => '/admin_manual/configuration/custom_mount_config_gui.html',

               'user-webdav'             => '/user_manual/files/files.html',
               'user-manual'             => '/user_manual',
               'user-sync-calendars'     => '/user_manual/pim/calendar.html#synchronising-calendars-with-caldav',
               'user-sync-contacts'      => '/user_manual/pim/contacts.html#keeping-your-addressbook-in-sync',
               'user-encryption'         => '/user_manual/files/encryption.html',
               'user-trashbin'           => '/user_manual/files/deletedfiles.html',
               'user-files'              => '/user_manual/files/index.html',
               'user-versions'           => '/user_manual/files/versioncontrol.html'
           );

############# Do not edit below this line #################

$from = $_GET['to'];
$proto = isset($_SERVER['HTTPS']) ? 'https' : 'http';
$port = $_SERVER['SERVER_PORT'];
$port = ($port !== '80' && $port !== '443') ? ":$port" : '';
$name = $_SERVER['SERVER_NAME'];
$path = dirname($_SERVER['REQUEST_URI']);

if (array_key_exists($from, $mapping)) {
    $target = $mapping[$from];
} else {
    $target = '';
}

$location = "$proto://$name$port$path$target";

header('HTTP/1.1 302 Moved Temporarily');
header('Location: '.$location);

