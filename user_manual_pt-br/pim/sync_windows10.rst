===============================
Sincronizando com o Windows 10
===============================

Calendário
----------

1. No seu navegador, navegue até o aplicativo Nextcloud Calendar. Em "Configurações e importação", copie o "Endereço do CalDAV do iOS / macOS" para a área de transferência.

2. Inicie o aplicativo Calendário do Windows 10. Em seguida, clique no ícone de configurações (ícone de roda dentada) e selecione "Gerenciar contas".

3. Clique em "Adicionar conta" e escolha "iCloud".

4. Digite um email, nome de usuário e senha. Nenhuma dessas informações deve ser válida - tudo será alterado nas próximas etapas.

5. Clique em "Concluído". Uma mensagem deve aparecer indicando que as configurações foram salvas com sucesso.

6. No menu "Gerenciar contas", clique na conta do iCloud criada nas etapas anteriores e selecione "Alterar configurações". Em seguida, clique em "Alterar configurações de sincronização da caixa de correio".

7. Role até o final da caixa de diálogo e selecione "Configurações avançadas da caixa postal". Cole o seu URL CalDAV no campo "Calendário servidor (CalDAV)".

8. Clique em "Concluído". Digite seu nome de usuário e senha do Nextcloud nos campos apropriados e altere o nome da conta para o que você preferir (por exemplo, "Calendário Nextcloud"). Clique em "Salvar".



Depois de seguir todas essas etapas, seu calendário do Nextcloud deve ser sincronizado. Se não, verifique seu nome de usuário e senha. Caso contrário, repita estes passos.

**NOTA: Você não poderá sincronizar seu calendário se tiver a autenticação de dois fatores ativada. Siga as etapas abaixo para obter uma senha de aplicativo que possa ser usada com o aplicativo cliente do Google Agenda:**

1. Faça o login no Nextcloud. Clique no ícone do usuário e clique em "configurações".

2. Clique em "Segurança" e localize um botão chamado "Gerar senha do aplicativo". Ao lado deste botão, insira "Windows 10 Calendar app". Em seguida, clique no botão e copie e cole a senha. Use essa senha em vez da sua senha do Nextcloud para a Etapa 8.

Agradecimentos especiais a este usuário do Reddit pelo seu post:
https://www.reddit.com/r/Nextcloud/comments/5rcypb/using_the_windows_10_calendar_application_with/
