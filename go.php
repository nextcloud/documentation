<?php

############## Add new references here  ##################
############## Adjust when editing docs ##################

$mapping = array(
    'admin'                   => '/admin_manual',
    'admin-2fa'               => '/admin_manual/configuration_user/two_factor-auth.html',
    'admin-antivirus-configuration'     => '/admin_manual/configuration_server/antivirus_configuration.html',
    'admin-background-jobs'   => '/admin_manual/configuration_server/background_jobs_configuration.html',
    'admin-backup'            => '/admin_manual/maintenance/backup.html',
    'admin-bigint-conversion' => '/admin_manual/configuration_database/bigint_identifiers.html',
    'admin-big-file-upload'   => '/admin_manual/configuration_files/big_file_upload_configuration.html',
    'admin-code-integrity'    => '/admin_manual/issues/code_signing.html',
    'admin-cache'             => '/admin_manual/configuration_server/caching_configuration.html',
    'admin-config'            => '/admin_manual/configuration_server/config_sample_php_parameters.html',
    'admin-db-conversion'     => '/admin_manual/configuration_database/db_conversion.html',
    'admin-db-transaction'    => '/admin_manual/configuration_database/linux_database_configuration.html#database-read-committed-transaction-isolation-level',
    'admin-delegation'        => '/admin_manual/configuration_server/admin_delegation_configuration.html',
    'admin-email'             => '/admin_manual/configuration_server/email_configuration.html',
    'admin-encryption'        => '/admin_manual/configuration_files/encryption_configuration.html',
    'admin-external-storage'  => '/admin_manual/configuration_files/external_storage_configuration_gui.html',
    'admin-files-access-control' => '/admin_manual/file_workflows/access_control.html',
    'admin-files-automated-tagging' => '/admin_manual/file_workflows/automated_tagging.html',
    'admin-files-retention'   => '/admin_manual/file_workflows/retention.html',
    'admin-install'           => '/admin_manual/installation/index.html',
    'admin-ldap'              => '/admin_manual/configuration_user/user_auth_ldap.html',
    'admin-long-running-migration-steps' => '/admin_manual/maintenance/upgrade.html#long-running-migration-steps',
    'admin-mysql-utf8mb4'     => '/admin_manual/configuration_database/mysql_4byte_support.html',
    'admin-nginx'             => '/admin_manual/installation/nginx.html',
    'admin-oauth2'            => '/admin_manual/configuration_server/oauth2.html',
    'admin-performance'       => '/admin_manual/installation/server_tuning.html',
    'admin-php-fpm'           => '/admin_manual/installation/source_installation.html#php-fpm-tips-label',
    'admin-php-opcache'       => '/admin_manual/installation/server_tuning.html#enable-php-opcache',
    'admin-php-modules'       => '/admin_manual/installation/php_configuration.html#php-modules',
    'admin-provisioning-api'  => '/admin_manual/configuration_user/user_provisioning_api.html',
    'admin-reverse-proxy'     => '/admin_manual/configuration_server/reverse_proxy_configuration.html',
    'admin-security'          => '/admin_manual/installation/harden_server.html',
    'admin-setup-well-known-URL' => '/admin_manual/issues/general_troubleshooting.html#service-discovery',
    'admin-sharing'           => '/admin_manual/configuration_files/file_sharing_configuration.html',
    'admin-sharing-federated' => '/admin_manual/configuration_files/federated_cloud_sharing_configuration.html',
    'admin-source_install'    => '/admin_manual/installation/source_installation.html',
    'admin-sse-legacy-format' => '/admin_manual/configuration_files/encryption_migration.html',
    'admin-sso'               => '/admin_manual/configuration_server/sso_configuration.html',
    'admin-system-requirements' => '/admin_manual/installation/system_requirements.html',
    'admin-theming'           => '/admin_manual/configuration_server/theming.html',
    'admin-theming-icons'     => '/admin_manual/configuration_server/theming.html#theming-of-icons',
    'admin-transactional-locking' => '/admin_manual/configuration_files/files_locking_transactional.html',
    'admin-trusted-domains'   => '/admin_manual/installation/installation_wizard.html#trusted-domains',
    'admin-update'            => '/admin_manual/maintenance/update.html',
    'admin-warnings'          => '/admin_manual/configuration_server/security_setup_warnings.html',
    'admin-workflowengine'    => '/admin_manual/file_workflows/index.html',

    'developer-manual'        => '/developer_manual',
    'developer-backports'     => '/developer_manual/getting_started/development_process.html#bugfixes',
    'developer-code-integrity'=> '/developer_manual/app_publishing_maintenance/code_signing.html',
    'developer-css'           => '/developer_manual/html_css_design/css.html',
    'developer-theming'       => '/developer_manual/basics/front-end/theming.html',

    'user'                    => '/user_manual',
    'user-2fa'                => '/user_manual/en/user_2fa.html',
    'user-encryption'         => '/user_manual/en/files/encrypting_files.html',
    'user-files'              => '/user_manual/en/files/index.html',
    'user-manual'             => '/user_manual/en',
    'user-sharing-federated'  => '/user_manual/en/files/federated_cloud_sharing.html',
    'user-sync-calendars'     => '/user_manual/en/groupware/calendar.html',
    'user-sync-contacts'      => '/user_manual/en/groupware/contacts.html',
    'user-trashbin'           => '/user_manual/en/files/deleted_file_management.html',
    'user-versions'           => '/user_manual/en/files/version_control.html',
    'user-webdav'             => '/user_manual/en/files/access_webdav.html',
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
    $subPath = $mapping[$from];
} elseif (str_starts_with($from, 'admin-')) {
    $subPath = '/admin_manual';
} elseif (str_starts_with($from, 'developer-')) {
    $subPath = '/developer_manual';
} else {
    $subPath = '/user_manual';
}

$subPathParts = explode('/', $subPath);
$manual = $subPathParts[1] ?? '';
if ($manual === 'user_manual') {
    // Sort accepted languages by their weight
    $acceptLanguages = array_reduce(
        explode(', ', $_SERVER['HTTP_ACCEPT_LANGUAGE']),
        static function ($out, $element) {
            [$language, $q] = array_merge(explode(';q=', $element), [1]);

            $out[$language] = (float)$q;

            return $out;
        },
        [],
    );
    arsort($acceptLanguages);

    foreach ($acceptLanguages as $language => $weight) {
        if (!preg_match('/^[a-z-]+$/im', $language)) {
            // Skip any invalid languages and prevent directory traversals
            continue;
        }

        $language = str_replace('-', '_', $language);

        // To test locally add '/_build/html/' to the path.
        if (file_exists(__DIR__ . '/user_manual/' . $language)) {
            // Insert the language /user_manual/<language>/...
            array_splice($subPathParts, 2, 0, [$language]);
            $subPath = implode('/', $subPathParts);
            break;
        }
    }
}

header('Location: ' . $location . $subPath);
