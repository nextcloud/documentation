========================
Sincronizando com o iOS
========================

Calendário
----------

#. Abra o aplicativo de configurações.
#. Selecione Correio, Contatos, Calendários.
#. Selecione Adicionar conta.
#. Selecione Outro como tipo de conta.
#. Selecione Adicionar conta CalDAV.
#. Para o servidor, digite ``example.com/remote.php/dav/principals/users/USERNAME/``
#. Digite seu nome de usuário e senha.
#. Selecione Próximo.
#. Se o seu servidor não suportar SSL, um aviso será exibido.
   Selecione Continuar.
#. Se o iPhone não puder verificar as informações da conta, execute as seguintes etapas:


   - Selecione OK.
   - Selecione configurações avançadas.
   - Se o seu servidor não suportar SSL, certifique-se de que Usar SSL esteja definido como DESLIGADO.
   - Altere a porta para 80.
   - Volte para as informações da conta e clique em Salvar.

Seu calendário agora ficará visível no aplicativo Calendário


Contatos
--------

#. Abra o aplicativo de configurações.
#. Selecione Correio, Contatos, Calendários.
#. Selecione Adicionar conta.
#. Selecione Outro como tipo de conta.
#. Selecione Adicionar conta CardDAV.
#. Para o servidor, digite ``example.com/remote.php/dav/principals/users/USERNAME/``
#. Digite seu nome de usuário e senha.
#. Selecione Próximo.
#. Se o seu servidor não suportar SSL, um aviso será exibido.
   Selecione Continuar.
#. Se o iPhone não puder verificar as informações da conta, execute o
   Segue:

   - Selecione OK.
   - Selecione configurações avançadas.
   - Se o seu servidor não suportar SSL, certifique-se de que Usar SSL esteja definido como DESLIGADO.
   - Altere a porta para 80.
   - Volte para as informações da conta e clique em Salvar.

Agora você deve encontrar seus contatos no catálogo de endereços do seu iPhone.
Se ainda não estiver funcionando, dê uma olhada no `Troubleshooting Contacts & Calendar`_
guia.

.. _Solução de problemas de contatos e agenda: https://docs.nextcloud.org/server/latest/admin_manual/issues/index.html#troubleshooting-contacts-calendar
.. TODO ON RELEASE: Atualize o número da versão acima no lançamento