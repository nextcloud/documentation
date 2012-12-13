Data Migration
==============

As of OC4, user migration is supported. To include migration support in your app (which is highly recommended and doesn’t take long) you must provide a migrate.php file in appname/appinfo/migrate.php.The function of the migrate.php file is to provide an import and export functions for app data. To assist in this, we set the user id of the user being exported / user being imported in $this->uid. There is also an instance of the OC_Migration_Content class stored in $this->content. The OC_Migration_Content class helps to make importing and exporting data easy for app developers.

Export
------

In this function, you must do everything necessary to export a user from the current ownCloud instance, given a user id. For most apps this is just the case of saving a few rows from the database.

Database Data
~~~~~~~~~~~~~

To make exporting database data really easy, the class OC_Migration_Content has a method called copyRows() which will save these rows for you given some options. Take a look at the export function for the bookmarks app:

.. code-block:: php
  
  function export( ){
    OC_Log::write('migration','starting export for bookmarks',OC_Log::INFO);
  	$options = array(
  		'table'=>'bookmarks',
  		'matchcol'=>'user_id',
  		'matchval'=>$this->uid,
  		'idcol'=>'id'
  	);
  	$ids = $this->content->copyRows( $options );
  	$options = array(
  		'table'=>'bookmarks_tags',
  		'matchcol'=>'bookmark_id',
  		'matchval'=>$ids
  	);
  	
  	// Export tags
  	$ids2 = $this->content->copyRows( $options );
  	
  	// If both returned some ids then they worked
  	if( is_array( $ids ) && is_array( $ids2 ) )
  	{
  		return true;	
  	} else {
  		return false;
  	}	
  }

The bookmarks app stores all of its data in the database, in two tables: *PREFIX* bookmarks and *PREFIX* bookmarks_tags so to export this, we need to run copyRows() twice. Here is an explanation of the options passed to OC_Migration_Content::copyRows(): 

* ‘table’ => string name of the table to export (without any prefix)
* ‘matchcol’ => (optional) string name of the column that will be matched with the value in ‘matchval’ (Basically the column used in the WHERE sql query)
* ‘matchval’ => (optional) the value that will be searched for in the table
* ‘idcol’ => the name of the column that will be returned

To export the bookmarks, ‘matchcol’ is set to the user_id column and ‘matchval’ is set to the user being exported: $this->content->uid. ‘idcol’ is set to the id of the bookmark, as we need to retrive the tags associated with the bookmarks for the user being exported. The function will return an array of id’s.Next we run the copyRows() method again, this time on the bookmarks_tags table, matching a range of values (as we want to find all tags, related to all bookmarks owned by the exported user).Finally we check that both functions returned arrays which confirms that they were successful and return a boolean value to represent the success of the export.

Files
~~~~~

If you use files to hold some app data in data/userid/appname, they will be automatically copied exported for you.

Import
------

Import is a little more tricky as we have to take into account data from different versions of your app, and also handle changing primary keys. Here is the import function for the bookmarks app which imports bookmarks and tags:

.. code-block:: php
  
  function import(){
    switch( $this->appinfo->version ){
  		default:
  		// All versions of the app have had the same db structure
  		// so all can use the same import function
  		$query = $this->content->prepare( "SELECT * FROM bookmarks WHERE user_id LIKE ?" );
  		$results = $query->execute( array( $this->olduid ) );
  		$idmap = array();
  		while( $row = $results->fetchRow() ){
  			// Import each bookmark, saving its id into the map	
  			$query = OC_DB::prepare( "INSERT INTO *PREFIX*bookmarks(url, title, user_id, public, added, lastmodified) VALUES (?, ?, ?, ?, ?, ?)" );
  			$query->execute( array( $row['url'], $row['title'], $this->uid, $row['public'], $row['added'], $row['lastmodified'] ) );
  			// Map the id
  			$idmap[$row['id']] = OC_DB::insertid();
  		}
  		// Now tags
  		foreach($idmap as $oldid => $newid){
  			$query = $this->content->prepare( "SELECT * FROM bookmarks_tags WHERE user_id LIKE ?" );
  			$results = $query->execute( array( $oldid ) );
  			while( $row = $data->fetchRow() ){
  				// Import the tags for this bookmark, using the new bookmark id
  				$query = OC_DB::prepare( "INSERT INTO *PREFIX*bookmarks_tags(bookmark_id, tag) VALUES (?, ?)" );
  				$query->execute( array( $newid, $row['tag'] ) );	
  			}		
  		}
  		// All done!
  		break;
  	}
  return true;
  }

We start off by using a switch to run different import code for different versions of your app. $this->appinfo->version contains the version string from the info.xml of your app. In the case of the bookmarks app the db structure has not changed, so only one version of import code is needed.To import the db data, first we must retrive it from the migration.db. To do this we use the prepare method from OC_Migration_Content, which returns a MDB2 db object. We then cycle through the bookmarks in migration.db and insert them into the owncloud database. The important bit is the ‘idmapping’. After inserting a boookmark, The new id of the bookmark is saved in an array, with the key being the old id of the bookmark. This means when inserting the tags, we know what the new id of the bookmark is simply by getting the value of $idmap['oldid']. Remember this part of the import code may be a good place to emit some hooks depending on your app. For example the contacts app could emit some hooks to show some contacts have been added.After importing the bookmarks, we must import the tags. It is a very similar process to importing the bookmarks, except we have to take into account the changes in primary keys. This is done by using a foreach key in the $idmap array, and then inserting the tags using the new id.After all this, we must return a boolean value to indicate the success or failure of the import.Again, app data files stored in data/userid/appname will be automatically copied over before the apps import function is executed, this allows you to manipulate the imported files if necessary.

Conclusion
----------

To fully support user migration for your app you must provide a import and export function under an instance of OC_Migration_Provider and put this code in the file appname/appinfo/migrate.php

You can view other migration providers here:

* `Bookmarks migration provider`_
* `Contact migration provider`_

.. _Bookmarks migration provider: http://gitorious.org/owncloud/owncloud/blobs/migration/apps/bookmarks/appinfo/migrate.php
.. _Contact migration provider: http://gitorious.org/owncloud/owncloud/blobs/migration/apps/contacts/appinfo/migrate.php
