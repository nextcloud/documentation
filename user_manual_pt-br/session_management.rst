================================================
Gerenciar navegadores e dispositivos conectados
================================================

A página de configurações pessoais permite que você tenha uma visão geral dos 
navegadores e dispositivos conectados.

Gerenciando navegadores conectados
----------------------------------

Na lista de navegadores conectados, você vê quais navegadores conectados à sua 
conta recentemente

.. figure:: images/settings_sessions.png
     :alt: Lista de sessões do navegador.

Você pode usar o ícone da lixeira para desconectar qualquer um dos navegadores 
da lista.

Gerenciando dispositivos
------------------------

Na lista de dispositivos conectados, você vê todos os dispositivos e clientes 
para os quais você gerou uma senha de dispositivo e sua última atividade:

.. figure:: images/settings_devices.png
     :alt: Lista de dispositivos conectados.

Você pode usar o ícone da lixeira para desconectar qualquer um dos dispositivos 
da lista.

Na parte inferior da lista, você encontra um botão para criar uma nova senha
específica do dispositivo. Você pode escolher um nome para identificar o token 
mais tarde. A senha gerada é usada para configurar o novo cliente. Idealmente, 
gere tokens individuais para cada dispositivo conectado à sua conta, para que 
você possa desconectá-los individualmente, se necessário.

.. figure:: images/settings_devices_add.png
     :alt: Adicionando um novo dispositivo.

.. note:: Você só tem acesso à senha do aparelho ao criá-lo, o Nextcloud não,
   rá salvar a senha simples, por isso é recomendado inserir a senha no novo
   cliente imediatamente.


.. note:: Se você está :doc:`user_2fa` para sua conta, as senhas específicas,
   do dispositivo são a única maneira de configurar clientes. O cliente
   negará conexões de clientes usando sua senha de login.

Senhas específicas do dispositivo e alterações de senha
-------------------------------------------------------

O comportamento das senhas específicas do dispositivo durante as alterações
da senha principal foi alterado em diferentes versões do Nextcloud.

Até Nextcloud 13
    As senhas específicas do dispositivo são removidas na alteração de senha
    e também são removidas quando não são mais válidas se um back-end de
    usuário externo for usado.

Nextcloud 14
    Para o usuário local backend, as senhas específicas do dispositivo são
    atualizadas corretamente e continuam funcionando. Para back-ends de usuários
    externos (como LDAP / AD), as senhas específicas do dispositivo ainda são 
    removidas.

Começando com o Nextcloud 15
    Para alterações de senha em backends de usuário externo, as senhas 
    específicas do dispositivo são marcadas como inválidas e, depois que um 
    login da conta do usuário com a senha principal ocorrer, todas as senhas 
    específicas do dispositivo serão atualizadas e funcionarão novamente.
