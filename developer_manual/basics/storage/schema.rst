============================
Database schema (deprecated)
============================

.. warning:: Using the database.xml schema file is deprecated.
             You should migrate to using :ref:`Database Migrations <app_db_migrations>`.

.. sectionauthor:: Bernhard Posselt <dev@bernhard-posselt.com>

Nextcloud uses a database abstraction layer on top of either PDO, depending on the availability of PDO on the server.

The database schema is inside :file:`appinfo/database.xml` in MDB2's `XML scheme notation <http://www.wiltonhotel.com/_ext/pear/docs/MDB2/docs/xml_schema_documentation.html>`_ where the placeholders \*dbprefix* (\*PREFIX* in your SQL) and \*dbname* can be used for the configured database table prefix and database name.

An example database XML file would look like this:

.. code-block:: xml

  <?xml version="1.0" encoding="UTF-8" ?>
  <database>
   <name>*dbname*</name>
   <create>true</create>
   <overwrite>false</overwrite>
   <charset>utf8</charset>
   <table>
    <name>*dbprefix*yourapp_items</name>
    <declaration>
      <field>
        <name>id</name>
        <type>integer</type>
        <default>0</default>
        <notnull>true</notnull>
            <autoincrement>1</autoincrement>
        <length>4</length>
      </field>
      <field>
        <name>user</name>
        <type>text</type>
        <notnull>true</notnull>
        <length>64</length>
      </field>
      <field>
        <name>name</name>
        <type>text</type>
        <notnull>true</notnull>
        <length>100</length>
      </field>
      <field>
        <name>path</name>
        <type>clob</type>
        <notnull>true</notnull>
      </field>
    </declaration>
  </table>
  </database>

To update the tables used by the app, simply adjust the database.xml file and increase the app version number in :file:`appinfo/info.xml` to trigger an update.
