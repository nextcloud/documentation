Share
=====


This class provides the ability for apps to share their content between users.
Apps must create a backend class that implements OCP\Share_Backend and register it with this class.

It provides the following hooks:
 - post_shared

.. php:namespace:: OCP
.. php:class:: Share




  .. php:staticmethod:: Share::registerBackend($itemType, $class, $collectionOf=null, $supportedFileExtensions=null)

    :param string $itemType: Item type
    :param string $class: Backend class
    :param string $collectionOf: (optional) Depends on item type
    :param array $supportedFileExtensions: (optional) List of supported file extensions if this item type depends on files
    :returns \\OCP\\Returns: true if backend is registered or false if error


    Register a sharing backend class that implements OCP\Share_Backend for an item type


  .. php:staticmethod:: Share::isEnabled()

    :returns \\OCP\\Returns: true if enabled or falseThe Share API is enabled by default if not configured


    Check if the Share API is enabled


  .. php:staticmethod:: Share::getItemsSharedWith($itemType, $format=self::FORMAT_NONE, $parameters=null, $limit=-1, $includeCollections=false)

    :param string $itemType: Item type
    :param int $format: Format (optional) Format type must be defined by the backend
    :param int $parameters: Number of items to return (optional) Returns all by default
    :param mixed $limit: 
    :param mixed $includeCollections: 
    :returns \\OCP\\Return: depends on format


    Get the items of item type shared with the current user


  .. php:staticmethod:: Share::getItemSharedWith($itemType, $itemTarget, $format=self::FORMAT_NONE, $parameters=null, $includeCollections=false)

    :param string $itemType: Item type
    :param string $itemTarget: Item target
    :param int $format: Format (optional) Format type must be defined by the backend
    :param mixed $parameters: 
    :param mixed $includeCollections: 
    :returns \\OCP\\Return: depends on format


    Get the item of item type shared with the current user


  .. php:staticmethod:: Share::getItemSharedWithBySource($itemType, $itemSource, $format=self::FORMAT_NONE, $parameters=null, $includeCollections=false)

    :param string $itemType: Item type
    :param string $itemSource: Item source
    :param int $format: Format (optional) Format type must be defined by the backend
    :param mixed $parameters: 
    :param mixed $includeCollections: 
    :returns \\OCP\\Return: depends on format


    Get the item of item type shared with the current user by source


  .. php:staticmethod:: Share::getItemSharedWithByLink($itemType, $itemSource, $uidOwner)

    :param string $itemType: Item type
    :param string $itemSource: Item source
    :param string $uidOwner: Owner of link
    :returns \\OCP\\Item: 


    Get the item of item type shared by a link


  .. php:staticmethod:: Share::getShareByToken($token)

    :param string $token: token
    :returns \\OCP\\Item: 


    Get the item shared by a token


  .. php:staticmethod:: Share::getItemsShared($itemType, $format=self::FORMAT_NONE, $parameters=null, $limit=-1, $includeCollections=false)

    :param string $itemType: Item type
    :param int $format: Format (optional) Format type must be defined by the backend
    :param int $parameters: Number of items to return (optional) Returns all by default
    :param mixed $limit: 
    :param mixed $includeCollections: 
    :returns \\OCP\\Return: depends on format


    Get the shared items of item type owned by the current user


  .. php:staticmethod:: Share::getItemShared($itemType, $itemSource, $format=self::FORMAT_NONE, $parameters=null, $includeCollections=false)

    :param string $itemType: Item type
    :param string $itemSource: Item source
    :param int $format: Format (optional) Format type must be defined by the backend
    :param mixed $parameters: 
    :param mixed $includeCollections: 
    :returns \\OCP\\Return: depends on format


    Get the shared item of item type owned by the current user


  .. php:staticmethod:: Share::shareItem($itemType, $itemSource, $shareType, $shareWith, $permissions)

    :param string $itemType: Item type
    :param string $itemSource: Item source
    :param int $shareType: SHARE_TYPE_USER, SHARE_TYPE_GROUP, or SHARE_TYPE_LINK
    :param string $shareWith: User or group the item is being shared with
    :param int $permissions: CRUDS permissions
    :returns bool|string: Returns true on success or false on failure, Returns token on success for links


    Share an item with a user, group, or via private link


  .. php:staticmethod:: Share::unshare($itemType, $itemSource, $shareType, $shareWith)

    :param string $itemType: Item type
    :param string $itemSource: Item source
    :param int $shareType: SHARE_TYPE_USER, SHARE_TYPE_GROUP, or SHARE_TYPE_LINK
    :param string $shareWith: User or group the item is being shared with
    :returns \\OCP\\Returns: true on success or false on failure


    Unshare an item from a user, group, or delete a private link


  .. php:staticmethod:: Share::unshareAll($itemType, $itemSource)

    :param string $itemType: Item type
    :param string $itemSource: Item source
    :returns \\OCP\\Returns: true on success or false on failure


    Unshare an item from all users, groups, and remove all links


  .. php:staticmethod:: Share::unshareFromSelf($itemType, $itemTarget)

    :param string $itemType: Item type
    :param string $itemTarget: Item target
    :returns \\OCP\\Returns: true on success or false on failureUnsharing from self is not allowed for items inside collections


    Unshare an item shared with the current user


  .. php:staticmethod:: Share::setPermissions($itemType, $itemSource, $shareType, $shareWith, $permissions)

    :param string $itemType: Item type
    :param string $itemSource: Item source
    :param int $shareType: SHARE_TYPE_USER, SHARE_TYPE_GROUP, or SHARE_TYPE_LINK
    :param string $shareWith: User or group the item is being shared with
    :param int $permissions: CRUDS permissions
    :returns \\OCP\\Returns: true on success or false on failure


    Set the permissions of an item for a specific user or group


  .. php:staticmethod:: Share::setExpirationDate($itemType, $itemSource, $date)

    :param mixed $itemType: 
    :param mixed $itemSource: 
    :param mixed $date: 



  .. php:staticmethod:: Share::post_deleteUser($arguments)

    :param mixed $arguments: 


    Hook Listeners


  .. php:staticmethod:: Share::post_addToGroup($arguments)

    :param mixed $arguments: 



  .. php:staticmethod:: Share::post_removeFromGroup($arguments)

    :param mixed $arguments: 



  .. php:staticmethod:: Share::post_deleteGroup($arguments)

    :param mixed $arguments: 

