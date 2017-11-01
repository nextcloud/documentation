=====================
加密您的Nextcloud文件
=====================

Nextcloud包含一个加密应用程序，当您的Nextcloud管理员启用后，您的所有Nextcloud数据文件将被自动加密。加密是整个服务器范围的，所以当启用它时，您不能选择保留文件不加密。您不必执行任何特殊操作，因为它将使用您的Nextcloud登录作为唯一私有加密密钥的密码。只需像往常一样登录并管理和共享您的文件，您仍然可以随时更改密码。

其主要目的是加密连接到您的Nextcloud服务器（如Dropbox和Google Drive）的远程存储服务上的文件。这是一种简单而无缝的方式来保护远程存储上的文件。您可以通过常规方式通过Nextcloud共享您的远程文件，但是您无法直接从Dropbox，Google Drive或任何远程服务共享您的加密文件，因为加密密钥存储在您的Nextcloud服务器上，并且永远不会暴露到外部服务提供商。

如果您的Nextcloud服务器未连接到任何远程存储服务，那么最好使用其它形式的加密，如文件级或全盘加密。因为密钥保存在您的Nextcloud服务器上，您的Nextcloud管理员可能会窥探您的文件，如果服务器遭到入侵，入侵者可能会访问您的文件。（阅读`Nextcloud如何使用加密来保护您的数据<https://owncloud.org/blog/how-owncloud-uses-encryption-to-protect-your-data/>`_了解更多信息。）

加密问答
--------

如何关闭加密？
^^^^^^^^^^^^^

禁用加密的唯一方法是`"decrypt all"
<https://docs.nextcloud.org/server/12/admin_manual/configuration_server/occ_command.html#encryption-label>`_。

.. TODO ON RELEASE: Update version number above on release

这将解密所有文件并关闭加密。

是否可以使用恢复密钥禁用加密？
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

可以，*如果*每个用户使用`文件恢复密钥
<https://docs.nextcloud.com/server/12/admin_manual/configuration_files/encryption_configuration.html#enabling-users-file-recovery-keys>`_，`"decrypt all"
<https://docs.nextcloud.org/server/12/admin_manual/configuration_server/occ_command.html#encryption-label>`_将解密所有文件。

.. TODO ON RELEASE: Update version number above on release

没有用户密码可以禁用加密吗？
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

如果您没有用户密码或者`文件恢复密钥<https://docs.nextcloud.com/server/12/admin_manual/configuration_files/encryption_configuration.html#enabling-users-file-recovery-keys>`_.

.. TODO ON RELEASE: Update version number above on release

那么您的所有文件将不能解密。此外，在登录时运行它将是危险的，因为您很可能会遇到超时。

是否计划将其移到下一次用户登录或后台工作？
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

如果我们这样做，那么我们需要将您的登录密码存储在数据库中。这可以被视为一个安全问题，所以没有这样的计划。

使用群组共享是否可以逃过恢复密钥？
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

如果您的意思是将用户添加到组，并使其神奇地工作？ 不可以。只能与主密钥一起使用。

使用加密
--------

Nextcloud加密十分容易设置使用的，您可以使用以下的选项。

当您的Nextcloud管理员第一次启用加密时，您必须注销，然后重新登录以创建加密密钥并对文件进行加密。 当您的Nextcloud服务器上启用了加密功能时，您将在“文件”页面上看到一个黄色横幅警告您注销并重新登录。

.. figure:: ../images/encryption1.png

当您重新登录时，需要几分钟的时间，具体取决于您拥有的文件数量，然后返回到默认的Nextcloud页面。

.. figure:: ../images/encryption2.png


.. 提示::您永远不要丢失您的Nextcloud密码，因为您将无法访问您的文件。虽然您的Nextcloud管理员可以启用可选的恢复选项; 请参阅“恢复密钥密码”部分（以下）了解此信息。 

共享加密文件
------------

只有具有专用加密密钥的用户才能访问共享的加密文件和文件夹。 尚未创建私有加密密钥的用户将无法访问加密的共享文件; 他们将看到文件夹和文件名，但无法打开或下载文件。 他们将看到一个黄色警告横幅，表示“加密应用程序已启用，但您的密钥未初始化，请退出并重新登录”。

共享所有者可能需要重新共享加密后的文件; 尝试访问共享的用户将看到一条消息，建议他们要求共享所有者与他们重新共享文件。 对于个人共享来说，取消共享和重新共享文件。 对于群组，无法访问该共享的任何个人共享。 这会更新加密，然后共享所有者可以删除个人共享。

恢复密钥密码
^^^^^^^^^^^^

如果您的Nextcloud管理员已启用恢复密钥功能，则可以选择为您的帐户使用此功能。 如果启用“密码恢复”，管理员可以使用特殊密码读取数据。 如果您丢失了Nextcloud密码，该功能使管理员能够恢复您的文件。 如果恢复密钥未启用，那么如果丢失登录密码，则无法恢复文件。

.. figure:: ../images/encryption3.png

不加密的文件
------------

- 在回收站中的旧文件。
- 照片应用中的图片缩略图。
- 文件应用中的预览。
- 全文搜索应用程序的搜索索引。
- 第三方应用数据。

可能还有其它没有加密的文件; 只有暴露给第三方存储提供商的文件才能被加密。

更改私钥密码
^^^^^^^^^^^^

此选项仅在您的管理员更改登录密码但不是加密密码时可用。 如果您的Nextcloud提供商使用外部用户后端（例如LDAP）并使用该后端配置更改了登录密码，则可能会发生这种情况。 在这种情况下，您可以通过提供新的登录密码来将加密密码设置为新的登录密码。 加密应用程序仅在您的登录密码和加密密码相同时有效。
