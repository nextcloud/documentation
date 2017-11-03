==========
大文件上传
==========

通过Web客户端上传文件时，Nextcloud受到PHP和Apache配置的限制。默认情况下，PHP配置只有2兆字节的上传。由于此默认上传限制并不完全有用，因此建议您的Nextcloud管理员将Nextcloud变量添加到适合用户的大小。

修改某些Nextcloud变量需要进行管理员权限。如果您需要比默认提供的更大的上传限制（或已由管理员设置）:

 * 请与您的管理员联系，要求增加这些变量
 * 请参考 `管理文档 <https://docs.nextcloud.org/server/12/admin_manual/configuration_files/big_file_upload_configuration.html>`_ 介绍如何管理文件上传大小限制的部分。
.. TODO ON RELEASE: Update version number above on release
