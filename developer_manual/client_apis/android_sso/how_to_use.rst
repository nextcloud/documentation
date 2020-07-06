=======================
How to use this library
=======================

1) Add this library to your project
-----------------------------------

.. code-block:: gradle
    repositories {
        // ...
        maven { url "https://jitpack.io" }

    }

    dependencies {
        implementation "com.github.nextcloud:Android-SingleSignOn:0.5.1"
    }

    compileOptions {
        sourceCompatibility JavaVersion.VERSION_1_8
        targetCompatibility JavaVersion.VERSION_1_8
    }

We use some features from Java 8, so your project needs also to be compiled with (at least) this version.

2) To choose an account, include the following code in your login dialog:
-------------------------------------------------------------------------

From an Activity

.. code-block:: java
    private void openAccountChooser() {
        try {
            AccountImporter.pickNewAccount(this);
        } catch (NextcloudFilesAppNotInstalledException | AndroidGetAccountsPermissionNotGranted e) {
            UiExceptionManager.showDialogForException(this, e);
        }
    }

From a Fragment

.. code-block:: java
    private void openAccountChooser() {
        try {
            AccountImporter.pickNewAccount(currentFragment);
        } catch (NextcloudFilesAppNotInstalledException | AndroidGetAccountsPermissionNotGranted e) {
            UiExceptionManager.showDialogForException(this, e);
        }
    }

3) To handle the result of the Account Chooser, include the following:
----------------------------------------------------------------------

From an Activity

.. code-block:: java
    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        AccountImporter.onActivityResult(requestCode, resultCode, data, this, new AccountImporter.IAccountAccessGranted() {

            NextcloudAPI.ApiConnectedListener callback = new NextcloudAPI.ApiConnectedListener() {
                @Override
                public void onConnected() {
                    // ignore this one… see 5)
                }

                @Override
                public void onError(Exception ex) {
                    // TODO handle errors
                }
            };

            @Override
            public void accountAccessGranted(SingleSignOnAccount account) {
                Context l_context = getApplicationContext();

                // As this library supports multiple accounts we created some helper methods if you only want to use one.
                // The following line stores the selected account as the "default" account which can be queried by using
                // the SingleAccountHelper.getCurrentSingleSignOnAccount(context) method
                SingleAccountHelper.setCurrentAccount(l_context, account.name);

                // Get the "default" account
                SingleSignOnAccount ssoAccount = null;
                try {
                    ssoAccount = SingleAccountHelper.getCurrentSingleSignOnAccount(l_context);
                } catch (NextcloudFilesAppAccountNotFoundException | NoCurrentAccountSelectedException e) {
                    UiExceptionManager.showDialogForException(l_context, e);
                }
                
                NextcloudAPI nextcloudAPI = new NextcloudAPI(l_context, ssoAccount, new GsonBuilder().create(), callback);

                // TODO ... (see code in section 4 and below)
            }
        });
    }

From a Fragment

.. code-block:: java
    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);

        AccountImporter.onActivityResult(requestCode, resultCode, data, LoginDialogFragment.this, new AccountImporter.IAccountAccessGranted() {
        
            NextcloudAPI.ApiConnectedListener callback = new NextcloudAPI.ApiConnectedListener() {
                @Override
                public void onConnected() { 
                    // ignore this one… see 5)
                }
        
                @Override
                public void onError(Exception ex) { 
                    // TODO handle errors
                }
            };
            
            @Override
            public void accountAccessGranted(SingleSignOnAccount account) {
                // As this library supports multiple accounts we created some helper methods if you only want to use one.
                // The following line stores the selected account as the "default" account which can be queried by using 
                // the SingleAccountHelper.getCurrentSingleSignOnAccount(context) method
                SingleAccountHelper.setCurrentAccount(getActivity(), account.name);
                
                // Get the "default" account
                SingleSignOnAccount ssoAccount = SingleAccountHelper.getCurrentSingleSignOnAccount(context);
                NextcloudAPI nextcloudAPI = new NextcloudAPI(context, ssoAccount, new GsonBuilder().create(), callback);
        
                // TODO ... (see code in section 4 and below)
            }
        });
    }
    
From both an Activity and Fragment

.. code-block:: java
    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);

        AccountImporter.onRequestPermissionsResult(requestCode, permissions, grantResults, this);
    }

    // Complete example: https://github.com/nextcloud/news-android/blob/890828441ba0c8a9b90afe56f3e08ed63366ece5/News-Android-App/src/main/java/de/luhmer/owncloudnewsreader/LoginDialogActivity.java#L470-L475

4) How to get account information?
----------------------------------

.. code-block:: java
    // If you stored the "default" account using setCurrentAccount(…) you can get the account by using the following line:
    SingleSignOnAccount ssoAccount = SingleAccountHelper.getCurrentSingleSignOnAccount(context);

    // Otherwise (for multi-account support): (you'll have to keep track of the account names yourself. Note: this has to be the name of SingleSignOnAccount.name)
    AccountImporter.getSingleSignOnAccount(context, accountName);

    ssoAccount.name; // Name of the account used in the android account manager
    ssoAccount.username;
    ssoAccount.token;
    ssoAccount.url;

5) How to make a network request?
---------------------------------

You'll notice that there is an callback parameter in the constructor of the ``NextcloudAPI``.

.. code-block:: java
public NextcloudAPI(Context context, SingleSignOnAccount account, Gson gson, ApiConnectedListener callback) {

You can use this callback to subscribe to errors that might occur during the initialization of the API. You can start making requests to the API as soon as you instantiated the ``NextcloudAPI`` object. For a minimal example to get started (without retrofit) take a look at section 5.2. The callback method ``onConnected`` will be called once the connection to the files app is established. You can start making calls to the api before that callback is fired as the library will queue your calls until the connection is established.

#### 5.1) **Using Retrofit**

##### 5.1.1) Before using this single sign on library, your interface for your retrofit API might look like this:

.. code-block:: java
    public interface API {

        String mApiEndpoint = "/index.php/apps/news/api/v1-2/";

        @GET("user")
        Observable<UserInfo> user();

        // use ParsedResponse, in case you also need the response headers. Works currently only for Observable calls.
        @GET("user")
        Observable<ParsedResponse<UserInfo>> user();

        @POST("feeds")
        Call<List<Feed>> createFeed(@Body Map<String, Object> feedMap);

        @DELETE("feeds/{feedId}")
        Completable deleteFeed(@Path("feedId") long feedId);

        // …
    }

You might instantiate your retrofit ``API`` by using something like this: 
   
.. code-block:: java
    public class ApiProvider {

        private API mApi;

        public ApiProvider() {
            mApi = retrofit.create(API.class);
        }
    }

##### 5.1.2) Use of new API using the nextcloud app network stack

.. code-block:: java
    public class ApiProvider {

        private API mApi;

        public ApiProvider(NextcloudAPI.ApiConnectedListener callback) {
        SingleSignOnAccount ssoAccount = SingleAccountHelper.getCurrentSingleSignOnAccount(context);
        NextcloudAPI nextcloudAPI = new NextcloudAPI(context, ssoAccount, new GsonBuilder().create(), callback);
        mApi = new NextcloudRetrofitApiBuilder(nextcloudAPI, API.mApiEndpoint).create(API.class);
    }
    }
    
Enjoy! If you're already using retrofit, you don't need to modify your application logic. Just exchange the API and you're good to go!

Note: If you need a different mapping between your json-structure and your java-structure you might want to create a custom type adapter using ``new GsonBuilder().create().registerTypeAdapter(...)``. Take a look at [this](https://github.com/nextcloud/news-android/blob/783836390b4c27aba285bad1441b53154df16685/News-Android-App/src/main/java/de/luhmer/owncloudnewsreader/helper/GsonConfig.java) example for more information.

#### 5.2) **Without Retrofit**

``NextcloudAPI`` provides a method called ``performNetworkRequest(NextcloudRequest request)`` that allows you to handle the server response yourself.

.. code-block:: java
    public class MyActivity extends AppCompatActivity {

        private NextcloudAPI mNextcloudAPI;

        @Override
        protected void onStart() {
            super.onStart();
            try {
                SingleSignOnAccount ssoAccount = SingleAccountHelper.getCurrentSingleSignOnAccount(this);
                mNextcloudAPI = new NextcloudAPI(this, ssoAccount, new GsonBuilder().create(), apiCallback);

                // Start download of file in background thread (otherwise you'll get a NetworkOnMainThreadException)
                new Thread() {
                    @Override
                    public void run() {
                        downloadFile();
                    }
                }.start();
            } catch (NextcloudFilesAppAccountNotFoundException | NoCurrentAccountSelectedException e) {
                // TODO handle errors
            }
        }

        @Override
        protected void onStop() {
            super.onStop();
            // Close Service Connection to Nextcloud Files App and
            // disconnect API from Context (prevent Memory Leak)
            mNextcloudAPI.stop();
        }
        
        private NextcloudAPI.ApiConnectedListener apiCallback = new NextcloudAPI.ApiConnectedListener() {
            @Override
            public void onConnected() {
                // ignore this one… see 5)
            }

            @Override
            public void onError(Exception ex) {
                // TODO handle error in your app
            }
        };

        private void downloadFile() {
            NextcloudRequest nextcloudRequest = new NextcloudRequest.Builder()
                    .setMethod("GET")
                    .setUrl(Uri.encode("/remote.php/webdav/sample movie.mp4","/"))
                    .build();

            try {
                InputStream inputStream = mNextcloudAPI.performNetworkRequest(nextcloudRequest);
                while(inputStream.available() > 0) {
                    inputStream.read();
                    // TODO do something useful with the data here..
                    // like writing it to a file..?
                }
                inputStream.close();
            } catch (Exception e) {
                // TODO handle errors
            }
        }
    }


WebDAV
------

The following WebDAV Methods are supported: ``PROPFIND`` / ``MKCOL``

The following examples shows how to use the ``PROPFIND`` method. With a depth of 0.

.. code-block:: java
    List<String>depth = new ArrayList<>();
    depth.add("0");
    header.put("Depth", depth);

    NextcloudRequest nextcloudRequest = new NextcloudRequest.Builder()
            .setMethod("PROPFIND")
            .setHeader(header)
            .setUrl(Uri.encode("/remote.php/webdav/"+remotePath,"/"))
            .build();

Flow Diagram
------------

Note that the "Make network request" section in the diagram only shows the workflow if you use the "retrofit" api.

![Flow Diagram](doc/NextcloudSingleSignOn.png)