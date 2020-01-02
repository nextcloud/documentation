===================
Controle de versão
===================

Nextcloud suporta sistema de controle de versão simples para arquivos.
O controle de versão cria backups de arquivos que são acessíveis
através da guia Versões na barra lateral Detalhes. Essa guia contém
o histórico do arquivo em que você pode reverter um arquivo para
qualquer versão anterior. Alterações feitas em mais de dois minutos
são salvos em **data / [user] / versions**.

.. figure:: ../images/files_versioning.png

Para restaurar uma versão específica de um arquivo, clique na seta circular à esquerda.
Clique no timestamp para fazer o download.

O aplicativo de controle de versão garante automaticamente que o usuário não
fique sem espaço. Este padrão é usado para excluir versões antigas:

* Para o primeiro segundo, mantemos uma versão
* Nos primeiros 10 segundos, o Nextcloud mantém uma versão a cada 2 segundos
* Para o primeiro minuto, o Nextcloud mantém uma versão a cada 10 segundos
* Durante a primeira hora, o Nextcloud mantém uma versão a cada minuto
* Nas primeiras 24 horas, o Nextcloud mantém uma versão a cada hora
* Nos primeiros 30 dias, o Nextcloud mantém uma versão todos os dias
* Após os primeiros 30 dias, o Nextcloud mantém uma versão toda semana

As versões são ajustadas ao longo desse padrão toda vez que uma nova versão é criada.

O aplicativo de versão usa 50% do espaço livre atualmente disponível do usuário.
Se as versões armazenadas excederem esse limite, o Nextcloud excluirá a versão
mais antiga até atingir o limite de espaço em disco novamente.
