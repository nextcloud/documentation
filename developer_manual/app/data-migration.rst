Data Migration
==============
As of OC4, user migration is supported. To include migration support in your app (which is highly recommended and does not take long) you must provide a :file:`appinfo/migrate.php`. The function of the migrate.php file is to provide import and export functions for app data. To assist in this, we set the user id of the user being exported / user being imported in **$this->uid**. There is also an instance of the **OC_Migration_Content** class stored in **$this->content**. The **OC_Migration_Content** class helps to make importing and exporting data easy for app developers.

Export
------
In this function, you must do everything necessary to export a user from the current ownCloud instance, given a user id. For most apps this is just the case of saving a few rows from the database.

Database Data
~~~~~~~~~~~~~

To make exporting database data really easy, the class **OC_Migration_Content** has a method called **copyRows()** that will save these rows for you given some options. Take a look at the export function for the bookmarks app:

.. code-block:: php

  <?php

  function export( ){
    OC_Log::write('migration','starting export for bookmarks',OC_Log::INFO);

	// migrate two tables
	$bookmarkOptions = array(
		'table'=>'bookmarks',
		'matchcol'=>'user_id',
		'matchval'=>$this->uid,
		'idcol'=>'id'
	);
	$bookmarkIds = $this->content->copyRows( $bookmarkOptions );

	$bookmarkTagsOptions = array(
		'table'=>'bookmarks_tags',
		'matchcol'=>'bookmark_id',
		'matchval'=>$ids
	);
	$bookmarkTagsIds = $this->content->copyRows( $bookmarkTagsOptions );

	// If both returned some ids then they worked
	if( is_array( $bookmarkIds ) && is_array( $bookmarkTagsIds ) )
	{
		return true;
	} else {
		return false;
	}
  }

The bookmarks app stores all of its data in the database, in two tables: \*PREFIX*bookmarks and \*PREFIX*bookmarks_tags so to export this, we need to run **copyRows()** twice. Here is an explanation of the options passed to it:

* **table**: string name of the table to export (without any prefix)
* **matchcol**: (optional) string name of the column that will be matched with the value in **matchval** (Basically the column used in the WHERE SQL query)
* **matchval**: (optional) the value that will be searched for in the table
* **idcol**: the name of the column that will be returned.

To export the bookmarks, **matchcol** is set to the user_id column and **matchval** is set to the user being exported: **$this->content->uid**. **idcol** is set to the id of the bookmark, as we need to retrieve the tags associated with the bookmarks for the user being exported. The function will return an array of ids. Next, we run the **copyRows()** method again, this time on the bookmarks_tags table, matching a range of values (as we want to find all tags, related to all bookmarks owned by the exported user). Finally, we check that both functions returned arrays, which confirms that they were successful, and we return a boolean value to represent the success of the export.

Files
~~~~~

If you use files to hold some app data in **data/userid/appname/**, they will be automatically copied exported for you.

Import
------

Import is a little trickier as we have to take into account data from different versions of your app, and also handle changing primary keys. Here is the import function for the bookmarks app, which imports bookmarks and tags:

.. code-block:: php
  
  <?php

  function import(){
    switch( $this->appinfo->version ){
		default:
		// All versions of the app have had the same db structure
		// so all can use the same import function
		$query = $this->content->prepare( "SELECT * FROM bookmarks WHERE user_id LIKE ?" );
		$results = $query->execute( array( $this->olduid ));
		$idmap = array();
		while( $row = $results->fetchRow() ){
			// Import each bookmark, saving its id into the map
			$sql = "INSERT INTO *PREFIX*bookmarks" . 
					"(url, title, user_id, public, added, lastmodified)" .
					" VALUES (?, ?, ?, ?, ?, ?)";
			$query = OC_DB::prepare($sql);
			$query->execute( array( 
				$row['url'], 
				$row['title'], 
				$this->uid, 
				$row['public'], 
				$row['added'], 
				$row['lastmodified'] 
			) );
			// Map the id
			$idmap[$row['id']] = OC_DB::insertid();
		}
		// Now tags
		foreach($idmap as $oldid => $newid){
			$sql = "SELECT * FROM bookmarks_tags WHERE user_id LIKE ?";
			$query = $this->content->prepare($sql);
			$results = $query->execute( array( $oldid ) );
			while( $row = $data->fetchRow() ){
				// Import the tags for this bookmark, using the new bookmark id
				$sql = "INSERT INTO *PREFIX*bookmarks_tags(bookmark_id, tag)".
						" VALUES (?, ?)";
				$query = OC_DB::prepare($sql);
				$query->execute( array( $newid, $row['tag'] ) );
			}
		}
		// All done!
		break;
	}
  	return true;
  }

We start off by using a switch to run different import code for different versions of your app. **$this->appinfo->version** contains the version string from the :file:`appinfo/info.xml` of your app. In the case of the bookmarks app, the db structure has not changed, so only one version of the import code is needed.

To import the db data, first we must retrieve it from the **migration.db**. To do this, we use the prepare method from **OC_Migration_Content**, which returns a MDB2 db object. We then cycle through the bookmarks in migration.db and insert them into the ownCloud database. The important bit is the **idmapping**. After inserting a boookmark, the new id of the bookmark is saved in an array, with the key being the old id of the bookmark. This means that, when inserting the tags, we know what the new id of the bookmark is simply by getting the value of **$idmap['oldid']**. 

Remember that this part of the import code may be a good place to emit some hooks depending on your app. For example, the contacts app could emit some hooks to show some contacts have been added.

After importing the bookmarks, we must import the tags. It is a very similar process to importing the bookmarks, except we have to take into account the changes in primary keys. This is done by using a foreach key in the **$idmap** array, and then inserting the tags using the new id.

After all this, we must return a boolean value to indicate the success or failure of the import. Again, app data files stored in **data/userid/appname/** will be automatically copied over before the apps import function is executed, so this allows you to manipulate the imported files if necessary.

Conclusion
----------

To fully support user migration for your app, you must provide import and export functions under an instance of **OC_Migration_Provider** and put this code in the file :file:`appinfo/migrate.php`
