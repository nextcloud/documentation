===========================
Uploads de arquivos grandes
===========================

Ao carregar arquivos através do web client, o Nextcloud é limitado por configurações
PHP e Apache. Por padrão, o PHP é configurado para uploads de apenas 2 megabytes.
Como esse limite de upload padrão não é totalmente útil, recomendamos que o
administrador do Nextcloud aumente as variáveis Nextcloud para tamanhos apropriados
aos usuários.

Modificar certas variáveis do Nextcloud requer acesso administrativo. Se você
precisar de limites de upload maiores do que os fornecidos pelo padrão
(ou já definidos pelo seu administrador):

* Entre em contato com seu administrador para solicitar um aumento nessas variáveis

* Consulte a seção na `Documentação do Administrador <https://docs.nextcloud.org/server/14/
  admin_manual/configuration_files/big_file_upload_configuration.html>`_ que descreve como
  gerenciar arquivos limites de tamanho de upload.

.. TODO ON RELEASE: Update version number above on release
