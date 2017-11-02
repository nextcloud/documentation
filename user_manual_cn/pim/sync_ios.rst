iOS - iPhone/iPad同步
=====================

日历
----

 #. 打开“设置”应用。
 #. 选择“账户与密码”。
 #. 选择“添加账户”。
 #. 选择“其他”账户类型。
 #. 选择“添加CAlDAV账户”。
 #. 服务器：填写``example.com/remote.php/dav/principals/users/USERNAME/``
 #. 输入您的“用户名”和“密码”。
 #. 选择“下一步”。
 #. 如果您的服务器不支持SSL，将会显示一条警告，选择继续。
 #. 如果您的iPhone不能验证账户信息，请执行以下步骤：

   - 选择确认。
   - 选择高级设置。
   - 如果您的服务器不支持SSL，确认SSL选择设置为关闭。
   - 端口改为80。
   - 返回账户信息，点击保存。

日历应用中将可以看到您的Nextcloud日历信息。


地址薄
------

 #. 打开“设置”应用。
 #. 选择“账户与密码”。
 #. 选择“添加账户”。
 #. 选择“其他”账户类型。
 #. 选择“添加CardDAV账户”。
 #. 服务器：输入 ``example.com/remote.php/dav/principals/users/USERNAME/``
 #. 输入您的“用户名”和“密码”。
 #. 选择“下一步”。
 #. 如果您的服务器不支持SSL，将会显示一条警告，选择继续。
 #. 如果您的iPhone不能验证账户信息，请执行以下步骤：

   - 选择确认。
   - 选择高级设置。
   - 如果您的服务器不支持SSL，确认SSL选择设置为关闭。
   - 端口改为80。
   - 返回账户信息，点击保存。

现在应该可以在您的iPhone的通讯录中找到您的联系人。如果仍然不正常，查看:doc:`故障排查`和`联系人和日历故障排查`_ 指南.

.. _联系人和日历故障排查: https://docs.nextcloud.org/server/12/admin_manual/issues/index.html#troubleshooting-contacts-calendar
.. TODO ON RELEASE: Update version number above on release
