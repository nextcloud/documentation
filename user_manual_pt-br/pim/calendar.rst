==================================
Usando o aplicativo de calendário
==================================

.. note:: O aplicativo de calendário não está habilitado por padrão e precisa ser instalado
          separadamente da nossa App Store. Por favor, pergunte ao seu administrador por isso.

O aplicativo Agenda do Nextcloud pode sincronizar seus calendários e eventos com Nextcloud.

Quando você acessar pela primeira vez o aplicativo Agenda, um primeiro calendário padrão será
pré-gerado para você.

.. figure:: images/calendar_application.png

Gerenciando seus calendários
----------------------------

Importar um calendário
~~~~~~~~~~~~~~~~~~~~~~

Se você deseja transferir seu calendário e seus respectivos eventos para o seu Nextcloud
Por exemplo, a importação é a melhor maneira de fazer isso.

.. figure:: images/calendar_settings.png
            :scale: 50%

1. Clique no ícone de configurações rotulado com ``Configurações & Importar`` no canto inferior esquerdo.

2. Depois de clicar em ``+ Importar Calendário`` você pode selecionar um ou mais arquivos de calendário
   do seu dispositivo local para fazer o upload.

3. O upload pode levar algum tempo e depende do tamanho da agenda que você importa.

.. note:: O aplicativo Calendário do Nextcloud suporta apenas arquivos ``.ics`` compatíveis
          com o iCalendar, definidos no RFC 5545.

Criar um novo calendário
~~~~~~~~~~~~~~~~~~~~~~~~

Se você planeja configurar um novo calendário sem transferir dados antigos do seu
calendário anterior, criar um novo calendário é o caminho que você deve ir.

.. only:: html

  .. figure:: images/calendar_create.gif

1. Clique em `+ Novo Calendário`` na barra lateral esquerda.

2. Digite um nome para seu novo calendário, por exemplo, "Trabalho", "Casa" ou "Estudos".

3. Depois de clicar na marca de seleção, seu novo calendário é criado e pode ser
   sincronizado nos seus dispositivos, preenchido com novos eventos e compartilhado com seus amigos
   e colegas.

Editar, baixar ou excluir um calendário
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Às vezes, você pode querer alterar a cor ou o nome inteiro de um calendário anterior importado
ou criado. Você pode querer exportá-lo para o seu disco rígido local ou excluí-lo para sempre.

.. note:: Por favor tenha em mente que apagar um calendário é uma ação irreversível.
          Após a exclusão, não há como restaurar o calendário, a menos que você
          tenha um backup local.

.. figure:: images/calendar_dropdown.png
            :scale: 50%

1. Clique no menu de três pontos do respectivo calendário.

.. figure:: images/calendar_editing.png
            :scale: 50%

2. Clique em ``Editar``, ``Download`` or ``Delete``.

Inscrever-se em um calendário
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Você pode se inscrever nos calendários do iCal diretamente dentro
do seu Nextcloud. Ao suportar este padrão interoperável (RFC 5545),
tornamos o calendário do Nextcloud compatível com o Google Calendar,
o Apple iCloud e muitos outros servidores de calendário com os
quais você pode trocar seus calendários.

1. Clique em `+Nova Subscricao`` na barra lateral esquerda.
2. Digite o link da agenda compartilhada na qual você deseja se inscrever.

Tudo pronto! Suas inscrições de calendário serão atualizadas regularmente.

Gerenciando Eventos
--------------------

Crie um novo evento
~~~~~~~~~~~~~~~~~~~~

Eventos podem ser criados clicando na área quando o evento é agendado.
Na visão diária e semanal do calendário, basta clicar, puxar e deixar
o cursor sobre a área quando o evento estiver ocorrendo.

.. only:: html

  .. figure:: images/calendar_new-event_week.gif

A visualização mensal requer apenas um clique na área do dia específico.

.. only:: html

  .. figure:: images/calendar_new-event_month.gif

Depois disso, você pode digitar o nome do evento (por exemplo, **Reunião com Luke**), escolha
o calendário em que você deseja escolher o evento (por exemplo, **Pessoal**, **Trabalho**)
verificar e concretizar o intervalo de tempo ou definir o evento como o evento durante todo o dia.

Se você quiser editar detalhes avançados, pesquise como **Local**, **Descrição**,
**Participantes**, **Lembretes** ou para definir o evento como um evento repetitivo, clique em
o botão ``Mais ...`` para abrir o editor da barra lateral avançada.

.. note:: Se você quiser editar ou excluir um evento específico, basta clicar nele.
          Depois que você estiver pronto para redefinir todos os detalhes e abrir
          o editor da barra lateral, clique em ``Mais ...``.

Clicar no botão azul ``Criar`` finalmente criará o evento.

Editar ou excluir um evento
~~~~~~~~~~~~~~~~~~~~~~~~~~~

Se você quiser editar ou excluir um evento específico, basta clicar nele.
Depois que você estiver pronto para redefinir todos os detalhes e abrir o
editor da barra lateral, clique em ``Mais ...``.

Clicar no botão ``Atualizar`` azul atualizará o evento. Clicando no
O botão ``Cancelar`` não salva suas edições.

Se você clicar no botão ``Delete`` vermelho, o evento será removido do seu
calendário.

Calendário de aniversário
-------------------------

O calendário de aniversários é um calendário gerado automaticamente que automaticamente
busque os aniversários de seus contatos. A única maneira de editar este calendário é
arquivando seus contatos com datas de aniversário. Você não pode editar diretamente
este calendário a partir do aplicativo de calendário.

.. note:: Se você não ver o calendário de aniversários, seu administrador poderá
           ter desativado isso para o seu servidor.