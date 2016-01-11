Examples
========

Init the library
----------------

Start using the library; it is needed to init the object mClient that will be
in charge of keeping the communication with the server.

Code example
~~~~~~~~~~~~

.. code-block:: java

  public class MainActivity extends Activity
                            implements  OnRemoteOperationListener,
                                        OnDatatransferProgressListener {
  private OwnCloudClient mClient;
  private Handler mHandler = new Handler();

  ...

  public void onCreate(Bundle savedInstanceState) {

  ...

  // Parse URI to the base URL of the ownCloud server
  Uri serverUri = Uri.parse(getString(R.string.server_base_url));

  // Create client object to perform remote operations
  mClient = OwnCloudClientFactory.createOwnCloudClient(
              serverUri,
              this,
              // Activity or Service context
              true);


Set credentials
---------------

Authentication on the app is possible by 3 different methods:

* Basic authentication, user name and password
* Bearer access token (oAuth2)
* Cookie (SAML-based single-sign-on)

Code example
~~~~~~~~~~~~

.. code-block:: java

  package com.owncloud.android.lib.common;

  public class OwnCloudClient extends HttpClient {
    ...
    // Set basic credentials
    client.setCredentials(
        OwnCloudCredentialsFactory.newBasicCredentials(username, password)
    );
    // Set bearer access token
    client.setCredentials(
        OwnCloudCredentialsFactory.newBearerCredentials(accessToken)
    );
    // Set SAML2 session token
    client.setCredentials(
        OwnCloudCredentialsFactory.newSamlSsoCredentials(cookie)
    );
  }

Create a folder
---------------

Create a new folder on the cloud server, the info needed to be sent is the path
of the new folder.

Code example
~~~~~~~~~~~~
                                                      
.. code-block:: java

  private void startFolderCreation(String newFolderPath) {
    CreateRemoteFolderOperation createOperation = new CreateRemoteFolderOperation(newFolderPath, false); 
    createOperation.execute( mClient , this , mHandler); 
  }

  @Override
  public void onRemoteOperationFinish(RemoteOperation operation, RemoteOperationResult result) {
    if (operation instanceof CreateRemoteFolderOperation) {
      if (result.isSuccess()) {
      // do your stuff here
      }
    }
    …
  }

Read folder
-----------

Get the content of an existing folder on the cloud server, the info needed to
be sent is the path of the folder, in the example shown it has been asked the
content of the root folder.  As answer of this method, it will be received an
array with all the files and folders stored in the selected folder.

Code example
~~~~~~~~~~~~

.. code-block:: java

  private void startReadRootFolder() {
    ReadRemoteFolderOperation refreshOperation = new ReadRemoteFolderOperation(FileUtils.PATH_SEPARATOR); 
    // root folder
    refreshOperation.execute(mClient, this, mHandler);
  }


  @Override
  public void onRemoteOperationFinish(RemoteOperation operation, RemoteOperationResult result) { 
    if (operation instanceof ReadRemoteFolderOperation) {
      if (result.isSuccess()) {
        List< RemoteFile > files = result.getData(); 
        // do your stuff here
      }
    }
    …
  }

Read file
---------

Get information related to a certain file or folder, information obtained is:
``filePath``, ``filename``, ``isDirectory``, ``size`` and ``date``.

Code example
~~~~~~~~~~~~

.. code-block:: java

  private void startReadFileProperties(String filePath) {
    ReadRemoteFileOperation readOperation = new ReadRemoteFileOperation(filePath);
    readOperation.execute(mClient, this, mHandler);
  }

  @Override
  public void onRemoteOperationFinish(RemoteOperation operation, RemoteOperationResult result) {
    if (operation instanceof ReadRemoteFileOperation) {
      if (result.isSuccess()) { 
        RemoteFile file = result.getData()[0];
        // do your stuff here
      }
    }
    …
  }

Delete file or folder
---------------------

Delete a file or folder on the cloud server. The info needed is the path of
folder/file to be deleted.

Code example
~~~~~~~~~~~~

.. code-block:: java

  private void startRemoveFile(String filePath) { 
    RemoveRemoteFileOperation removeOperation = new RemoveRemoteFileOperation(remotePath);
    removeOperation.execute( mClient , this , mHandler);
  }

  @Override
  public void onRemoteOperationFinish(RemoteOperation operation, RemoteOperationResult result) {
    if (operation instanceof RemoveRemoteFileOperation) {
      if (result.isSuccess()) { 
        // do your stuff here 
      }
    }
    …
  }


Download a file
---------------

Download an existing file on the cloud server. The info needed is path of the
file on the server and targetDirectory, path where the file will be stored on
the device.

Code example
~~~~~~~~~~~~

.. code-block:: java

  private void startDownload(String filePath, File targetDirectory) {
    DownloadRemoteFileOperation downloadOperation = new DownloadRemoteFileOperation(filePath, targetDirectory.getAbsolutePath());
    downloadOperation.addDatatransferProgressListener(this); 
    downloadOperation.execute( mClient, this, mHandler);
  }

  @Override
  public void onRemoteOperationFinish( RemoteOperation operation, RemoteOperationResult result) {
    if (operation instanceof DownloadRemoteFileOperation) {
      if (result.isSuccess()) {
        // do your stuff here
      }
    }
  }

  @Override
  public void onTransferProgress( long progressRate, long totalTransferredSoFar, long totalToTransfer, String fileName) {
  mHandler.post( new Runnable() {
    @Override
    public void run() { 
      // do your UI updates about progress here
    }
  });
  }

Upload a file
-------------

Upload a new file to the cloud server. The info needed is fileToUpload, path
where the file is stored on the device, remotePath, path where the file will be
stored on the server and mimeType.

Code example
~~~~~~~~~~~~

.. code-block:: java

  private void startUpload (File fileToUpload, String remotePath, String mimeType) { 
    UploadRemoteFileOperation uploadOperation = new UploadRemoteFileOperation( fileToUpload.getAbsolutePath(), remotePath, mimeType);
    uploadOperation.addDatatransferProgressListener(this); 
    uploadOperation.execute(mClient, this, mHandler); 
  }

  @Override
  public void onRemoteOperationFinish(RemoteOperation operation, RemoteOperationResult result) {
    if (operation instanceof UploadRemoteFileOperation) {
      if (result.isSuccess()) {
        // do your stuff here 
      }
    }
  }

  @Override 
  public void onTransferProgress(long progressRate, long totalTransferredSoFar, long totalToTransfer, String fileName) {
    mHandler.post( new Runnable() {
      @Override
      public void run() {
        // do your UI updates about progress here
      }
    });
  }

Move a file or folder
---------------------

Move an exisintg file or folder to a different location in the ownCloud server. Parameters needed are the path
to the file or folder to move, and the new path desired for it. The parent folder of the new path must exist in 
the server.

When the parameter 'overwrite' is set to 'true', the file or folder is moved even if the new path is already
used by a different file or folder. This one will be replaced by the former.

Code example
~~~~~~~~~~~~
                                                      
.. code-block:: java

  private void startFileMove(String filePath, String newFilePath, boolean overwrite) {
    MoveRemoteFileOperation moveOperation = new MoveRemoteFileOperation(filePath, newFilePath, overwrite); 
    moveOperation.execute( mClient , this , mHandler); 
  }

  @Override
  public void onRemoteOperationFinish(RemoteOperation operation, RemoteOperationResult result) {
    if (operation instanceof MoveRemoteFileOperation) {
      if (result.isSuccess()) {
      // do your stuff here
	  }
    }
    …
  }

Read shared items by link
-------------------------

Get information about what files and folder are shared by link (the object
mClient contains the information about the server url and account)

Code example
~~~~~~~~~~~~

.. code-block:: java

  private void startAllSharesRetrieval() {
    GetRemoteSharesOperation getSharesOp = new GetRemoteSharesOperation();
    getSharesOp.execute( mClient , this , mHandler); 
  }

  @Override
  public void onRemoteOperationFinish( RemoteOperation operation, RemoteOperationResult result) {
    if (operation instanceof GetRemoteSharesOperation) {
      if (result.isSuccess()) { 
        ArrayList< OCShare > shares = new ArrayList< OCShare >(); 
        for (Object obj: result.getData()) {
          shares.add(( OCShare) obj);
        }
        // do your stuff here
      }
    }
  }

Get the share resources for a given file or folder
--------------------------------------------------


Get information about what files and folder are shared by link on a certain
folder. The info needed is filePath, path of the file/folder on the server, the
Boolean variable, getReshares, come from the Sharing api, from the moment it is
not in use within the ownCloud Android library.

Code example
~~~~~~~~~~~~

.. code-block:: java

  private void startSharesRetrievalForFileOrFolder(String filePath, boolean getReshares) {
    GeteRemoteSharesForFileOperation operation = new GetRemoteSharesForFileOperation(filePath, getReshares, false);
    operation.execute( mClient, this, mHandler); 
  }

  private void startSharesRetrievalForFilesInFolder(String folderPath, boolean getReshares) {
    GetRemoteSharesForFileOperation operation = new GetRemoteSharesForFileOperation(folderPath, getReshares, true);
    operation.execute( mClient, this, mHandler); 
  }

  @Override
  public void onRemoteOperationFinish( RemoteOperation operation, RemoteOperationResult result) {
    if (operation instanceof GetRemoteSharesForFileOperation) {
      if (result.isSuccess()) {
        ArrayList< OCShare > shares = new ArrayList< OCShare >(); 
        for (Object obj: result.getData()) {
          shares.add(( OCShare) obj); 
        }
        // do your stuff here
     }
  }
  }


Share link of file or folder
-----------------------------


Share a file or a folder from your cloud server by link.

The info needed is filePath, the path of the item that you want to share and
Password, this comes from the Sharing api, from the moment it is not in use
within the ownCloud Android library.


Code example
~~~~~~~~~~~~

.. code-block:: java

  private void startCreationOfPublicShareForFile(String filePath, String password) {
    CreateRemoteShareOperation operation = new CreateRemoteShareOperation(filePath, ShareType.PUBLIC_LINK, "", false, password, 1);
    operation.execute( mClient , this , mHandler);
  }

  private void startCreationOfGroupShareForFile(String filePath, String groupId) {
    CreateRemoteShareOperation operation = new CreateRemoteShareOperation(filePath, ShareType.GROUP, groupId, false , "", 31); 
    operation.execute(mClient, this, mHandler); 
  }

  private void startCreationOfUserShareForFile(String filePath, String userId) {
    CreateRemoteShareOperation operation = new CreateRemoteShareOperation(filePath, ShareType.USER, userId, false, "", 31);
    operation.execute(mClient, this, mHandler);
  }

  @Override
  public void onRemoteOperationFinish( RemoteOperation operation, RemoteOperationResult result) {
    if (operation instanceof CreateRemoteShareOperation) {
      if (result.isSuccess()) { 
        OCShare share = (OCShare) result.getData ().get(0);
        // do your stuff here
      }
    }
  }


Delete a share resource
-----------------------

Stop sharing by link a file or a folder from your cloud server.

The info needed is the object OCShare that you want to stop sharing by link.

Code example
~~~~~~~~~~~~

.. code-block:: java

  private void startShareRemoval(OCShare share) {
    RemoveRemoteShareOperation operation = new RemoveRemoteShareOperation((int) share.getIdRemoteShared());
    operation.execute( mClient, this, mHandler);
  }

  @Override
  public void onRemoteOperationFinish( RemoteOperation operation, RemoteOperationResult result) {
    if (operation instanceof RemoveRemoteShareOperation) {
      if (result.isSuccess()) {
      // do your stuff here
      }
    }
  }


Tips
----

* Credentials must be set before calling any method
* Paths must not be on URL Encoding
* Correct path: ``https://example.com/owncloud/remote.php/dav/PopMusic``
* Wrong path: ``https://example.com/owncloud/remote.php/dav/Pop%20Music/``
* There are some forbidden characters to be used in folder and files names on the server, same on the ownCloud Android Library "\","/","<",">",":",""","|","?","*"
* Upload and download actions may be cancelled thanks to the objects uploadOperation.cancel(), downloadOperation.cancel()
* Unit tests, before launching unit tests you have to enter your account information (server url, user and password) on TestActivity.java
