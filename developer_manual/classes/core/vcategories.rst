OC_VCategories
==============


Class for easy access to categories in VCARD, VEVENT, VTODO and VJOURNAL.
A Category can be e.g. 'Family', 'Work', 'Chore', 'Special Occation' or
anything else that is either parsed from a vobject or that the user chooses
to add.
Category names are not case-sensitive, but will be saved with the case they
are entered in. If a user already has a category 'family' for a type, and
tries to add a category named 'Family' it will be silently ignored.

.. php:namespace:: global
.. php:class:: OC_VCategories




  .. php:method:: __construct($type, $user=null, $defcategories=array())

    :param \\ $type: The type identifier e.g. 'contact' or 'event'.
    :param \\ $user: The user whos data the object will operate on. This  parameter should normally be omitted but to make an app able to  update categories for all users it is made possible to provide it.
    :param \\ $defcategories: An array of default categories to be used if none is stored.


    Constructor.


  .. php:staticmethod:: OC_VCategories::isEmpty($type, $user=null)

    :param \\ $type: The type identifier e.g. 'contact' or 'event'.
    :param \\ $user: The user whos categories will be checked. If not set current user will be used.


    Check if any categories are saved for this type and user.


  .. php:method:: categories($format=null)

    :param \\ $format: 


    Get the categories for a specific user.


  .. php:method:: idsForCategory($category)

    :param string|integer $category: Category id or name.


    Get the a list if items belonging to $category.
    Throws an exception if the category could not be found.


  .. php:method:: itemsForCategory($category, $tableinfo, $limit=null, $offset=null)

    :param string|integer $category: Category id or name.
    :param array $tableinfo: Array in the form {'tablename' => table, 'fields' => ['field1', 'field2']}
    :param int $limit: 
    :param int $offset: This generic method queries a table assuming that the idfield is called 'id' and the table name provided is inthe form '*PREFIX*table_name'.If the category name cannot be resolved an exception is thrown.TODO: Maybe add the getting permissions for objects?


    Get the a list if items belonging to $category.
    Throws an exception if the category could not be found.


  .. php:method:: hasCategory($name)

    :param \\ $name: The name to check for.


    Checks whether a category is already saved.


  .. php:method:: add($name)

    :param \\ $name: A string with a name of the category


    Add a new category.


  .. php:method:: addMulti($names, $sync=false, $id=null)

    :param \\ $names: A string with a name or an array of strings containingthe name(s) of the categor(y|ies) to add.
    :param \\ $sync: bool When true, save the categories
    :param \\ $id: int Optional object id to add to this|these categor(y|ies)


    Add a new category.


  .. php:method:: loadFromVObject($id, $vobject, $sync=false)

    :param mixed $id: 
    :param \\ $vobject: The instance of OC_VObject to load the categories from.
    :param mixed $sync: 


    Extracts categories from a vobject and add the ones not already present.


  .. php:method:: rescan($objects, $sync=true, $reset=true)

    :param \\ $objects: An array of vobjects (as text).To get the object array, do something like:// For Addressbook:$categories = new OC_VCategories('contacts');$stmt = OC_DB::prepare( 'SELECT `carddata` FROM `*PREFIX*contacts_cards`' );$result = $stmt->execute();$objects = array();if(!is_null($result)) {	while( $row = $result->fetchRow()){		$objects[] = array($row['id'], $row['carddata']);	}}$categories->rescan($objects);
    :param mixed $sync: 
    :param mixed $reset: 


    Reset saved categories and rescan supplied vobjects for categories.


  .. php:staticmethod:: OC_VCategories::post_deleteUser($arguments)

    :param mixed $arguments: 


    Delete categories and category/object relations for a user.For hooking up on post_deleteUser


  .. php:method:: purgeObject($id, $type=null)

    :param int $id: The id of the object
    :param string $type: The type of object (event/contact/task/journal).	Defaults to the type set in the instance


    Delete category/object relations from the db


  .. php:method:: getFavorites($type=null)

    :param string $type: The type of object (event/contact/task/journal).	Defaults to the type set in the instance


    Get favorites for an object type


  .. php:method:: addToFavorites($objid, $type=null)

    :param int $objid: The id of the object
    :param string $type: The type of object (event/contact/task/journal).	Defaults to the type set in the instance


    Add an object to favorites


  .. php:method:: removeFromFavorites($objid, $type=null)

    :param int $objid: The id of the object
    :param string $type: The type of object (event/contact/task/journal).	Defaults to the type set in the instance


    Remove an object from favorites


  .. php:method:: addToCategory($objid, $category, $type=null)

    :param int $objid: The id of the object
    :param int|string $category: The id or name of the category
    :param string $type: The type of object (event/contact/task/journal).	Defaults to the type set in the instance


    Creates a category/object relation.


  .. php:method:: removeFromCategory($objid, $category, $type=null)

    :param int $objid: The id of the object
    :param int|string $category: The id or name of the category
    :param string $type: The type of object (event/contact/task/journal).	Defaults to the type set in the instance


    Delete single category/object relation from the db


  .. php:method:: delete($names, $objects=null)

    :param \\ $names: An array of categories to delete
    :param array $objects: An array of arrays with [id,vobject] (as text) pairs suitable for updating the apps object table.


    Delete categories from the db and from all the vobject supplied
