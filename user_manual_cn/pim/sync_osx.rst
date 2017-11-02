与OS X同步
==========

要使用NextCloud与iCal，您将需要使用以下URL地址::

    https://example.com/remote.php/dav/principals/users/USERNAME/

iOS设置基本与要同步的Nextcloud路径设置相同 ``https://yourserver.workfile.cn/remote.php/dav/principals/users/USERNAME``。对于OS X 10.7 Lion 和10.8 Mountain Lion 所有一切工作得很好, 但是对于OS X 10.6 (Snow Leopard)和更老的版本需要进行些些操作。用户贡献了以下内容:

 #. 确认“地址簿”不能工作。如果是，请选择窗口，然后按Command + Q终止它。
 #. 前往 **/Users/YOUR_USERNAME/Library/Application Support/AddressBook/Sources** 文件夹。如果您已经设置了某种地址簿，可能会看到一些名为  **BEA92826-FBF3-4E53-B5C6-ED7C2B454430** 的文件夹。注意现在有什么文件夹，让窗口保持打开状态。
 #. 打开“地址簿”，并尝试添加一个新的CardDav地址簿。在这一点上，输入的信息无关紧要。当您点击“创建”时，会出现与之前提到的相同的错误消息。忽略它，然后再次单击“创建”。将添加非功能地址簿。
 #. 再次使用Command + Q
 #. 关闭“地址簿”。返回步骤2中的文件夹窗口。现在，您将看到一个新创建的文件夹，其中包含另一个长字符串作为其名称。
 #. 前往新创建的文件夹，并使用自己喜欢的文本编辑器编辑Configuration.plist。
 #. 搜索这样的部分::

    <key>servername</key> <string>https://:0(null)</string> <key>username</key> <string>Whatever_you_entered_before</string>

 #. 使它看起来像这样。请注意：443之后的 **example.com** 很重要：

    <key>servername</key <string>https://example.com:443/nextcloud/remote.php/dav/principals/users/USERNAME</string> <key>username</key <string>username</string>

 #. 保存文件并再次打开地址簿，这还不行。

 #. 打开您的Nextcloud CardDAV帐户的首选项并输入您的密码。11.您可能需要再次重新启动地址簿。之后，它应该工作。

 #. 您可能需要再次重新启动地址簿。之后，它应该正常工作。

如果仍然不能正常工作，查看 :doc:`故障排查`和 
`联系人和日历故障排查`_ 指南。

论坛中也有容易使用的`如何操作`_。


.. _如何操作: https://forum.owncloud.org/viewtopic.php?f=3&t=132
.. _联系人和日历故障排查: https://docs.nextcloud.org/server/12/admin_manual/issues/index.html#troubleshooting-contacts-calendar
.. TODO ON RELEASE: Update version number above on release
