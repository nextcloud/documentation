Tutorial: Develop your first app with client integration
=========================================================

0 Learn about client integration
---------------------------------

Please find API documentation at https://docs.nextcloud.com/server/latest/developer_manual/client_apis/ClientIntegration/index.html

1 Create a skeleton app
------------------------

See `Develop your first Hello World app <https://cloud.nextcloud.com/s/iyNGp8ryWxc7Efa?dir=%2F%2F2%20Develop%20your%20first%20Hello%20World%20app>`_ for more help on that topic:

- Create ``Capabilities.php`` in ``/lib`` folder and add to array in ``getCapabilities()``:

  .. code-block:: php

     'client_integration' => [
                     'pingpong' => [
                         'version' => 0.1,
                         'context-menu' => [
                             [
                                 'name' => $this->l10n->t('Ping'),
                                 'url' => '/ocs/v2.php/apps/pingpong/ping/{fileId}',
                                 'method' => 'GET',
                             ],
                         ],
                     ],
                 ],

  - The schema is:

    - First ``app-id``
    - Then hook name, currently only ``context-menu``.
    - Then list of endpoints:

      - Text need to be translated by the app.
      - Current predefined params are fileId and filePath.
      - ``mimetype_filters`` is a comma-separated list of filters (matches anything that starts with the filter). If there is no filter, the action will be shown in every file/folder.
      - All urls are relative.
      - ``params`` is used for body params (currently only ``POST``).
      - Url placeholder are always replaced (currently ``{fileId}`` and ``{filePath}``).
      - Icons are always SVGs.

- Register the app in ``lib/AppInfo/Application.php``

  .. code-block:: php

     public function register(IRegistrationContext $context): void {
         $context->registerCapability(Capabilities::class);
     }

- Add consuming function in ``/lib/Controller/ApiController.php``:

  .. code-block:: php

     #[NoAdminRequired]
     #[ApiRoute(verb: 'GET', url: '/ping/{fileId}')]
     public function ping(int $fileId = 1): DataResponse {
         return new DataResponse(
             ['version' => 0.1,
                 'tooltip' => $this->l10n->t("Pong file %s", $fileId)]
         );
     }

- Response is ``DataResponse`` with a version (currently 0.1) and a translated tooltip.

For assistance you are always welcome to open an issue on `GitHub <https://github.com/nextcloud/files-clients>`_ with label "Client Integration".
