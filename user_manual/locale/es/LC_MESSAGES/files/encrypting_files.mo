��    &      L              |  7   }     �  -   �     �          "  �   B  �   �  g   �  �    �  �  &   �  0   �  F   �  ;   9	  �  u	  a   C    �     �  v   �  �   P  �  �     �     �  9   �  �  �     �  �   �  /   T     �  �  �     �  �   �  4  >  a  s  �   �  �   �  �  \  A   8  *   z  /   �  $   �     �  )     �   9  �     q   �  �  R    A!  2   H#  @   {#  e   �#  C   "$    f$  m   u&  m  �&  ,   Q)  �   ~)  �   *  �  �*  .   �,  (   �,  A   �,  i  3-     �/  �   �/  Y   q0  (   �0  �  �0     �3  �   �3  F  ]4  �  �5  (  +7  �   T8   Can encryption be disabled without the user's password? Change private key password Encrypting your Nextcloud files on the server Encryption FAQ Files not encrypted How can encryption be disabled? If we did that, then we would need to store your login password in the database. This could be seen as a security issue, so nothing like that is planned. If you don't have the users password or `file recovery key <https://docs.nextcloud.com/server/latest/admin_manual/configuration_files/encryption_configuration.html#enabling-users-file-recovery-keys>`_, If you mean adding users to groups and make it magically work? No. This only works with the master key. If your Nextcloud administrator has enabled the recovery key feature, you can choose to use this feature for your account. If you enable "Password recovery" the administrator can read your data with a special password. This feature enables the administrator to recover your files in the event you lose your Nextcloud password. If the recovery key is not enabled, then there is no way to restore your files if you lose your login password. If your Nextcloud server is not connected to any remote storage services, then it is better to use some other form of encryption such as file-level or whole disk encryption. Because the keys are kept on your Nextcloud server, it is possible for your Nextcloud admin to snoop in your files, and if the server is compromised the intruder may get access to your files. (Read `Encryption in Nextcloud <https://nextcloud.com/blog/encryption-in-nextcloud/>`_ to learn more.) Image thumbnails from the Gallery app. Is group Sharing possible with the recovery key? Is it planned to move this to the next user login or a background job? Is it possible to disable encryption with the recovery key? Its main purpose is to encrypt files on remote storage services that are connected to your Nextcloud server. This is an easy and seamless way to protect your files on remote storage. You can share your remote files through Nextcloud in the usual way, however you cannot share your encrypted files directly from the remote service you are using, because the encryption keys are stored on your Nextcloud server, and are never exposed to outside service providers. Nextcloud encryption is pretty much set it and forget it, but you have a few options you can use. Nextcloud includes a server side Encryption app, and when it is enabled by your Nextcloud administrator all of your Nextcloud data files are automatically encrypted on the server. Encryption is server-wide, so when it is enabled you cannot choose to keep your files unencrypted. You don't have to do anything special, as it uses your Nextcloud login as the password for your unique private encryption key. Just log in and out and manage and share your files as you normally do, and you can still change your password whenever you want. Old files in the trash bin. Only the data in your files is encrypted, and not the filenames or folder structures. These files are never encrypted: Only those files that are shared with third-party storage providers can be encrypted, the rest of the files may not be encrypted. Only users who have private encryption keys have access to shared encrypted files and folders. Users who have not yet created their private encryption keys will not have access to encrypted shared files; they will see folders and filenames, but will not be able to open or download the files. They will see a yellow warning banner that says "Encryption App is enabled but your keys are not initialized, please log-out and log-in again." Previews from the Files app. Recovery key password Script, which decrypts all files and disables encryption. Share owners may need to re-share files after encryption is enabled; users trying to access the share will see a message advising them to ask the share owner to re-share the file with them. For individual shares, un-share and re-share the file. For group shares, share with any individuals who can't access the share. This updates the encryption, and then the share owner can remove the individual shares. Sharing encrypted files The only way to disable encryption is to run the `"decrypt all" <https://docs.nextcloud.org/server/latest/admin_manual/configuration_server/occ_command.html#encryption-label>`_. The search index from the full text search app. Third-party app data This option is only available if the encryption password has not been changed by the administrator, but only the log-in password. This can occur if your Nextcloud provider uses an external user back-end (for example, LDAP) and changed your login password using that back-end configuration. In this case, you can set your encryption password to your new login password by providing your old and new login password. The Encryption app works only if your login password and your encryption password are identical. Using encryption When you log back in it takes a few minutes to work, depending on how many files you have, and then you are returned to your default Nextcloud page. When your Nextcloud admin enables encryption for the first time, you must log out and then log back in to create your encryption keys and encrypt your files. When encryption has been enabled on your Nextcloud server you will see a yellow banner on your Files page warning you to log out and then log back in: Yes, *if* every user uses the `file recovery key <https://docs.nextcloud.com/server/latest/admin_manual/configuration_files/encryption_configuration.html#enabling-users-file-recovery-keys>`_, `"decrypt all" <https://docs.nextcloud.org/server/latest/admin_manual/configuration_server/occ_command.html#encryption-label>`_ will use it to decrypt all files. You must never lose your Nextcloud password, because you will lose access to your files. Though there is an optional recovery option that your Nextcloud administrator may enable; see the Recovery Key Password section (below) to learn about this. then there is no way to decrypt all files. What's more, running it on login would be dangerous, because you would most likely run into timeouts. Project-Id-Version: Nextcloud latest User Manual latest
Report-Msgid-Bugs-To: 
POT-Creation-Date: 2021-01-15 16:50+0000
PO-Revision-Date: 2019-11-07 20:29+0000
Last-Translator: Next Cloud <nextcloud.translator.es@cgj.es>, 2021
Language: es
Language-Team: Spanish (https://www.transifex.com/nextcloud/teams/64236/es/)
Plural-Forms: nplurals=2; plural=(n != 1)
MIME-Version: 1.0
Content-Type: text/plain; charset=utf-8
Content-Transfer-Encoding: 8bit
Generated-By: Babel 2.9.1
 ¿Puede deshabilitarse el cifrado sin la contraseña del usuario? Cambiar la contraseña de la clave privada Cifrar sus archivos de Nextcloud en el servidor Preguntas más frecuentes de cifrado Archivos no cifrados ¿Cómo se puede deshabilitar el cifrado? Si hiciéramos eso, entonces tendríamos que guardar su contraseña de inicio de sesión en la base de datos. Esto puede ser visto como un problema de seguridad, así que no hay ningún plan similar. Si no posee la contraseña del usuario o la `clave de recuperación de archivos <https://docs.nextcloud.com/server/latest/admin_manual/configuration_files/encryption_configuration.html#enabling-users-file-recovery-keys>`_, Si se refiere añadir usuarios a grupos y que funcione mágicamente, no. Esto solo funciona con la clave maestra. Si su administrador de Nextcloud ha habilitado la herramienta de la clave de recuperación, usted puede utilizarla para su cuenta. Si habilita "Recuperación por contraseña", el administrador puede leer sus datos con una contraseña especial. Esta característica permite al administrador recuperar sus archivos si usted pierde su contraseña de Nextcloud. Si la clave de recuperación no está habilitada, no hay manera de restaurar sus archivos si pierde su contraseña de inicio de sesión. Si su servidor Nextcloud no está conectado con ningún servicio de almacenamiento remoto, es mejor utilizar otra forma de cifrado, como cifrar archivos individuales o cifrado completo del disco. Como las claves de cifrado se guardan en su servidor Nextcloud, es posible que su administrador de Nextcloud acceda a sus archivos, y si el servidor queda comprometido, el intruso podría obtener acceso a sus archivos. (Lea `cifrado en Nextcloud <https://nextcloud.com/blog/encryption-in-nextcloud/>`_ para aprender más.) Miniaturas de imágenes de la aplicación Galería ¿Es posible compartir con grupos con la clave de recuperación? ¿Hay planes para mover esto al siguiente inicio de sesión del usuario o una tarea en segundo plano? ¿Es posible deshabilitar el cifrado con la clave de recuperación? Su función principal es cifrar archivos en servicios de almacenamiento remoto que están conectados a su servidor Nextcloud. Esto es una manera sencilla y transparente de proteger sus archivos en almacenamiento remoto. Puede compartir sus archivos remotos a través de Nextcloud del mismo modo, pero no puede compartir sus archivos cifrados directamente desde el servicio remoto que está usando, porque las claves de cifrado están almacenadas en su servidor Nextcloud, y nunca se exponen a proveedores de servicio externos. El cifrado de Nextcloud es del tipo "actívalo y olvídate", pero tiene unas cuantas opciones que puede usar. Nextcloud incluye una aplicación de Cifrado en el servidor. Cuando es habilitada por su administrador de Nextcloud, todos sus archivos de datos de Nextcloud son cifrados automáticamente en el servidor. El cifrado es de todo el servidor, por lo que al estar habilitada no es posible mantener sus archivos sin cifrar. Usted no tiene que hacer nada especial, porque la aplicación utiliza su inicio de sesión de Nextcloud como contraseña para su clave privada de cifrado. Puede abrir y cerrar sesión, administrar y compartir sus archivos como lo hace normalmente, e incluso puede cambiar su contraseña cuando lo desee. Viejos archivos en la papelera de reciclaje. Solo los datos en tus archivos están cifrados, y no los nombres de archivo o estructuras de carpeta. Estos archivos nunca se cifran: Solo aquellos archivos que se compartan con proveedores de almacenamiento de terceras partes pueden ser cifrados, el resto de archivos pueden no ser cifrados. Solo aquellos usuarios que tengan claves de cifrado privadas tienen acceso a archivos y carpetas cifrados compartidos. Los usuarios que aún no han creado su clave de cifrado privada no tendrán acceso a archivos compartidos cifrados; verán carpetas y nombres de archivo, pero no podrán abrir ni descargar los archivos. Verán un cartel amarillo de aviso indicando "La aplicación de cifrado está habilitada, pero tus claves no están inicializadas. Por favor, cierra sesión e iníciala de nuevo." Previsualizaciones de la aplicación Archivos. Contraseña de la Clave de Recuperación script, que descifra todos los archivos y deshabilita el cifrado. Los propietarios de archivos o carpetas compartidas deberán re-compartir archivos tras la activación del cifrado; los usuarios que intenten acceder al recurso compartido verán un mensaje indicando que soliciten al propietario del recurso compartido que re-comparta el archivo con ellos. Para archivos compartidos a un solo usuario, deje de compartir y vuelva a compartirlo. Para archivos compartidos a un grupo, compártalos con los individuos que no puedan acceder. Esta acción actualiza el cifrado, y a continuación el propietario del recurso compartido puede borrar los usuarios añadidos de forma individual. Compartir archivos cifrados La única forma de deshabilitar el cifrado es ejecutar `"decrypt all" <https://docs.nextcloud.org/server/latest/admin_manual/configuration_server/occ_command.html#encryption-label>`_. El índice de búsqueda de la aplicación Búsqueda en Texto Completo (full text search). Datos de aplicaciones de terceras partes Esta opción solo está disponible si la contraseña de cifrado no ha sido cambiada por el administrador, sino que solo se ha modificado la contraseña de inicio de sesión. Esto puede ocurrir si su proveedor de Nextcloud utiliza un soporte de usuarios externo (por ejemplo, LDAP) y ha cambiado su contraseña de inicio de sesión usando la configuración del soporte externo. En ese caso, usted puede cambiar su contraseña de cifrado a su nueva contraseña de inicio de sesión al proporcionar su antigua y nueva contraseña de inicio de sesión. La aplicación Cifrado solo funciona si su contraseña de inicio de sesión y su contraseña de cifrado son idénticas. Usar el cifrado Cuando inicie sesión de nuevo, puede que tarde unos minutos en conseguirlo, en función del número de archivos que tenga. A continuación volverá a su página por defecto de Nextcloud. Cuando su administrador de Nextcloud activa el cifrado por primera vez, debe cerrar sesión y reabrirla para crear sus claves de cifrado y cifrar sus archivos. Cuando el cifrado ha sido habilitado en su servidor Nextcloud, verá un cartel amarillo en su página de Archivos, indicándole que cierre sesión y la abra de nuevo: Sí, *si* cada usuario utiliza la `clave de recuperación de archivos <https://docs.nextcloud.com/server/latest/admin_manual/configuration_files/encryption_configuration.html#enabling-users-file-recovery-keys>`_, `"decrypt all" <https://docs.nextcloud.org/server/latest/admin_manual/configuration_server/occ_command.html#encryption-label>`_ las utilizará para descifrar todos los archivos. No debe perder nunca su contraseña de Nextcloud, porque perderá acceso a sus archivos. Sin embargo, hay una opción de recuperación opcional que su administrador de Nextcloud puede habilitar; vea la sección Contraseña de la Clave de Recuperación más adelante para saber más sobre el tema. no hay forma de descifrar todos los archivos. Es más, ejecutarlo al iniciar sesión puede ser peligroso, porque probablemente dará lugar a errores por tiempo máximo de ejecución. 