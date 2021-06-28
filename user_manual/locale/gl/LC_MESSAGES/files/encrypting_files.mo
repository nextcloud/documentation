��    $      <              \  7   ]     �  -   �     �     �       �   "  Z  �  g     �    �  6  &   	  0   2	  F   c	  ;   �	  �  �	  a   �         .  v   J  �   �  �  C     �       �  +     �  �   �  /   �     �  �  	       �     4  �  a  �  �   E  �  ;  :     &   P  1   w  (   �     �  "   �  �   
  {  �  r   G    �    �!  ,   �#  8   
$  ]   C$  ;   �$    �$  u   �&  g  o'  #   �)  �   �)  �   �*  �  #+  (   -  %   =-  9  c-     �/  �   �/  =   �0  !   �0  �  1     �3  �   �3  i  =4  �  �5  1  *7   Can encryption be disabled without the user's password? Change private key password Encrypting your Nextcloud files on the server Encryption FAQ Files not encrypted How can encryption be disabled? If we did that, then we would need to store your login password in the database. This could be seen as a security issue, so nothing like that is planned. If you don't have the users password or `file recovery key <https://docs.nextcloud.com/server/latest/admin_manual/configuration_files/encryption_configuration.html#enabling-users-file-recovery-keys>`_, then there is no way to decrypt all files. What's more, running it on login would be dangerous, because you would most likely run into timeouts. If you mean adding users to groups and make it magically work? No. This only works with the master key. If your Nextcloud administrator has enabled the recovery key feature, you can choose to use this feature for your account. If you enable "Password recovery" the administrator can read your data with a special password. This feature enables the administrator to recover your files in the event you lose your Nextcloud password. If the recovery key is not enabled, then there is no way to restore your files if you lose your login password. If your Nextcloud server is not connected to any remote storage services, then it is better to use some other form of encryption such as file-level or whole disk encryption. Because the keys are kept on your Nextcloud server, it is possible for your Nextcloud admin to snoop in your files, and if the server is compromised the intruder may get access to your files. (Read `Encryption in Nextcloud <https://nextcloud.com/blog/encryption-in-nextcloud/>`_ to learn more.) Image thumbnails from the Gallery app. Is group Sharing possible with the recovery key? Is it planned to move this to the next user login or a background job? Is it possible to disable encryption with the recovery key? Its main purpose is to encrypt files on remote storage services that are connected to your Nextcloud server. This is an easy and seamless way to protect your files on remote storage. You can share your remote files through Nextcloud in the usual way, however you cannot share your encrypted files directly from the remote service you are using, because the encryption keys are stored on your Nextcloud server, and are never exposed to outside service providers. Nextcloud encryption is pretty much set it and forget it, but you have a few options you can use. Nextcloud includes a server side Encryption app, and when it is enabled by your Nextcloud administrator all of your Nextcloud data files are automatically encrypted on the server. Encryption is server-wide, so when it is enabled you cannot choose to keep your files unencrypted. You don't have to do anything special, as it uses your Nextcloud login as the password for your unique private encryption key. Just log in and out and manage and share your files as you normally do, and you can still change your password whenever you want. Old files in the trash bin. Only the data in your files is encrypted, and not the filenames or folder structures. These files are never encrypted: Only those files that are shared with third-party storage providers can be encrypted, the rest of the files may not be encrypted. Only users who have private encryption keys have access to shared encrypted files and folders. Users who have not yet created their private encryption keys will not have access to encrypted shared files; they will see folders and filenames, but will not be able to open or download the files. They will see a yellow warning banner that says "Encryption App is enabled but your keys are not initialized, please log-out and log-in again." Previews from the Files app. Recovery key password Share owners may need to re-share files after encryption is enabled; users trying to access the share will see a message advising them to ask the share owner to re-share the file with them. For individual shares, un-share and re-share the file. For group shares, share with any individuals who can't access the share. This updates the encryption, and then the share owner can remove the individual shares. Sharing encrypted files The only way to disable encryption is to run the `"decrypt all" <https://docs.nextcloud.org/server/latest/admin_manual/configuration_server/occ_command.html#encryption-label>`_ script, which decrypts all files and disables encryption. The search index from the full text search app. Third-party app data This option is only available if the encryption password has not been changed by the administrator, but only the log-in password. This can occur if your Nextcloud provider uses an external user back-end (for example, LDAP) and changed your login password using that back-end configuration. In this case, you can set your encryption password to your new login password by providing your old and new login password. The Encryption app works only if your login password and your encryption password are identical. Using encryption When you log back in it takes a few minutes to work, depending on how many files you have, and then you are returned to your default Nextcloud page. When your Nextcloud admin enables encryption for the first time, you must log out and then log back in to create your encryption keys and encrypt your files. When encryption has been enabled on your Nextcloud server you will see a yellow banner on your Files page warning you to log out and then log back in: Yes, *if* every user uses the `file recovery key <https://docs.nextcloud.com/server/latest/admin_manual/configuration_files/encryption_configuration.html#enabling-users-file-recovery-keys>`_, `"decrypt all" <https://docs.nextcloud.org/server/latest/admin_manual/configuration_server/occ_command.html#encryption-label>`_ will use it to decrypt all files. You must never lose your Nextcloud password, because you will lose access to your files. Though there is an optional recovery option that your Nextcloud administrator may enable; see the Recovery Key Password section (below) to learn about this. Project-Id-Version: Nextcloud latest User Manual latest
Report-Msgid-Bugs-To: 
POT-Creation-Date: 2021-04-08 09:39+0000
PO-Revision-Date: 2019-11-07 20:29+0000
Last-Translator: Miguel Anxo Bouzada <mbouzada@gmail.com>, 2021
Language: gl
Language-Team: Galician (https://www.transifex.com/nextcloud/teams/64236/gl/)
Plural-Forms: nplurals=2; plural=(n != 1)
MIME-Version: 1.0
Content-Type: text/plain; charset=utf-8
Content-Transfer-Encoding: 8bit
Generated-By: Babel 2.9.1
 Pódese desactivar o cifrado sen o contrasinal do usuario? Cambiar o contrasinal da chave privada Cifrar os seus ficheiros no Nextcloud no servidor Preguntas frecuentes (FAQ) sobre cifrado Ficheiros sen cifrar Como se pode desactivar o cifrado? Se fixésemos iso, necesitaríamos almacenar o seu contrasinal de inicio de sesión na base de datos. Isto podería considerarse un problema de seguridade, polo que non hai nada diso previsto. Se non ten o contrasinal de usuario ou a `chave de recuperación de ficheiros <https://docs.nextcloud.com/server/latest/admin_manual/configuration_files/encryption_configuration.html#enabling-users-file-recovery-keys>`_, entón non hai forma de descifrar todos os ficheiros. É máis, executalo no inicio de sesión sería perigoso, porque é probable que teña tempos de espera. Se quere dicir engadir usuarios a grupos e facelo funcionar máxicamente? Non. Isto só funciona coa chave mestra. Se o seu administrador do Nextcloud activou a función de chave de recuperación, pode optar por usar esta función para a súa conta. Se activa o «Contrasinal de recuperación» o administrador pode ler os seus datos cun contrasinal especial. Esta característica permite que o administrador poida recuperar os seus ficheiros no caso de que perda o seu contrasinal do Nextcloud. Se a chave de recuperación non está activada, non hai xeito de restaurar os ficheiros se perdeu o seu contrasinal de inicio de sesión. Se o seu servidor do Nextcloud non está conectado a ningún servizo de almacenamento remoto, é mellor usar algunha outra forma de cifrado como o cifrado a nivel de ficheiro ou o cifrado de disco completo. Debido a que as chaves se gardan no servidor do Nextcloud, é posíbel que o seu administrador do Nextcloud poida botar unha ollada nos seus ficheiros e se o servidor está comprometido, o intruso pode acceder aos seus ficheiros. (Lea `Cifrado no Nextcloud  <https://nextcloud.com/blog/encryption-in-nextcloud/>`_ para saber máis.) Miniaturas de imaxe da aplicación Galería. É posíbel compartir grupos coa chave de recuperación? Está previsto pasar isto ao seguinte inicio de sesión de usuario ou a un traballo de fondo? É posible desactivar o cifrado coa chave de recuperación? O seu principal propósito é cifrar ficheiros en servizos de almacenamento remoto conectados ao seu servidor do Nextcloud. Este é un xeito sinxelo e transparente de protexer os seus ficheiros en almacenamento remoto. Pode compartir os seus ficheiros remotos a través do Nextcloud da forma habitual, porén non pode compartir os seus ficheiros cifrados directamente dende o servizo remoto que está a usar, porque as chaves de cifrado están almacenadas no servidor do Nextcloud e nunca están expostas a provedores de servizos externos. O cifrado do Nextcloud está máis ou menos estabelecido e pode esqueecelo, mais ten algunhas opcións que pode usar. O Nextcloud inclúe unha aplicación de cifrado do lado do servidor e cando o seu administrador do Nextcloud o activa, todos os seus ficheiros de datos do Nextcloud son cifrados automaticamente no servidor. O cifrado realizase en todo o servidor, polo que cando está activado non pode optar por manter os seus ficheiros sen cifrar. Non ten que facer nada especial, xa que usa o seu inicio de sesión Nextcloud como contrasinal para a súa chave de cifrado privado. Só ten que iniciar sesión e saír e xestionar e compartir os seus ficheiros como fai normalmente. Pode cambiar o seu contrasinal sempre que queira. Ficheiros antigos no cesto do lixo. Só se cifran os datos dos seus ficheiros e non os nomes de ficheiro ou as estruturas de cartafoles. Estes ficheiros nunca se cifran: Só se poden cifrar aqueles ficheiros que se comparten con fornecedores de almacenamento de terceiros, é posíbel que o resto dos ficheiros non estean cifrados. Só os usuarios que teñen chaves de cifrado privadas teñen acceso a ficheiros e cartafoles cifrados compartidos. Os usuarios que aínda non crearon as súas chaves de cifrado privado non terán acceso a ficheiros compartidos cifrados; verán cartafoles e nomes de ficheiros, pero non poderán abrir ou descargar os ficheiros. Verán unha pancarta de aviso amarelo que di «A aplicación de cifrado está activada, mais as chaves non foron preparadas, saia da sesión e volva a acceder de novo» Vistas previas da aplicación Ficheiros. Contrasinal da chave de recuperación É posíbel que os propietarios de recursos compartidos teñan que  volver compartir ficheiros após activar o cifrado; os usuarios que tenten acceder á compartición verán unha mensaxe aconsellándolle que solicite ao propietario que comparta de novo o ficheiro. No caso de comparticións individuais, deixar de compartir e volver compartir o ficheiro. Para compartir en grupo, comparta con calquera persoa que non poida acceder á compartición. Isto actualiza o cifrado e, deseguido, o propietario do recurso compartido pode eliminar as comparticións individuais. Compartir ficheiros cifrados O único xeito de desactivar o cifrado é executar `«descifrar todo» <https://docs.nextcloud.org/server/latest/admin_manual/configuration_server/occ_command.html#encryption-label>`_ script, que descifra todos os ficheiros e desactiva o cifrado. O índice de busca da aplicación de busca de texto completo. Datos da aplicación de terceiros Esta opción só está dispoñíbel se o administrador non cambiou o contrasinal de cifrado, senón só o contrasinal de inicio de sesión.. Isto pode ocorrer se o seu provedor do Nextcloud usa unha infraestrutura de usuario externo (por exemplo, LDAP) e cambiou o seu contrasinal de inicio de sesión usando esa configuración de infraestrutura. Neste caso, pode estabelecer o seu contrasinal de cifrado no seu novo contrasinal de inicio de sesión fornecendo o seu antigo e novo contrasinal de inicio de sesión. A aplicación de cifrado funciona só se o seu contrasinal de inicio de sesión e o seu contrasinal de cifrado son idénticos. Usar o cifrado Cando volva iniciar sesión tarda uns minutos en traballar, dependendo de cantos ficheiros teña e logo volve á súa páxina predeterminada do Nextcloud. Cando o seu administrador do Nextcloud activa por primeira vez o cifrado, ten que pechar sesión e logo iniciar sesión para crear as chaves de cifrado e cifrar os seus ficheiros. Cando estea activado o cifrado no seu servidor do Nextcloud, verá unha pancarta amarela na súa páxina de Ficheiros advertindolle que peche a sesión e logo volva iniciar sesión: Si, *se* cada usuario usa a `chave de recuperación de ficheiros <https://docs.nextcloud.com/server/latest/admin_manual/configuration_files/encryption_configuration.html#enabling-users-file-recovery-keys>`_, `«descifrar todo» <https://docs.nextcloud.org/server/latest/admin_manual/configuration_server/occ_command.html#encryption-label>`_ empregarao para descifrar todos os ficheiros. Nunca debe perder o seu contrasinal do Nextcloud, porque vai perder o acceso aos seus ficheiros. Aínda que existe unha opción de recuperación opcional que pode activar o seu administrador do Nextcloud; consulte a sección Contrasinal da chave de recuperación (deseguido) para obter máis información. 