Big Files
=========

There are a few default configuration settings that you will want to change to enable ownCloud to operate more effectively as a self hosted file sync and share server. When uploading through the web client, ownCloud is governed by PHP and Apache. As a default, PHP is configured for only 2 MB uploads. This is not entirely useful, so it is important to increase these variables to the sizes you want to support on your server. Point your favorite text editor over to your php.ini file. On different server operating systems this is located in different places. On openSUSE and Ubuntu, for example, this is located in /etc/php5/apache2/php.ini Note: the command ‘php -i | grep php.ini’ can help you locate your php.ini on Linux. On Windows, you can find this file within C:/Program Files (x86)/PHP/PHP.ini Edit the php.ini file, looking for: 

- upload_max_filesize = 500 MB
- post_max_size = 600 MB

The defaults for these values are quite small, so change them to to 500 MB and 600MB, or 1G and 1.2G, for example, and you have adjusted the maximum file size that can be uploaded at one time. Make sure you restart your Apache server after these changes, or it will not take affect! Note: You will want these two values to be about the same size, with post_max_size slightly larger to account for headers in the uploaded files. If you find later that files keep timing out on upload, you may want to also change these settings in the php.ini file: max_input_time memory_limit max_execution_time post_max_size See below for more on php.ini settings from radlinks.com. **PHP.ini settings**

- **upload_max_filesize and post_max_size:** Files are usually POSTed to the webserver in a format known as ‘multipart/form-data’. The post_max_size sets the upper limit on the amount of data that a script can accept in this manner. Ideally this value should be larger than the value that you set for upload_max_filesize It’s important to realize that upload_max_filesize is the sum of the sizes of all the files that you are uploading. post_max_size is the upload_max_filesize plus the sum of the lengths of all the other fields in the form plus any mime headers that the encoder might include. Since these fields are typically small you can often approximate the upload max size to the post max size. According to the PHP documentation you can set a MAX_UPLOAD_LIMIT in your HTML form to suggest a limit to the browser. Our understanding is that browsers totally ignore this directive and the only solution that can impose such a client side restriction is our own Rad Upload Applet.
- **memory_limit:** When the PHP engine is handling an incoming POST it needs to keep some of the incoming data in memory. This directive has any effect only if you have used the –enable-memory-limit option at configuration time. Setting too high a value can be very dangerous because if several uploads are being handled concurrently all available memory will be used up and other unrelated scripts that consume a lot of memory might effect the whole server as well. 
- **max_execution_time and max_input_time:** These settings define the maximum life time of the script and the time that the script should spend in accepting input. If several mega bytes of data are being transfered max_input_time should be reasonably high. You can override the setting in the ini file for max_input_time by calling the set_time_limit() function in your scripts. 

**Additional IIS Server Upload Step** Now you have to go back to IIS manager and make one last change to enable file uploads on the webserver larger than 30MB. 

- Go to the start menu, and type in ‘iis manager’
- Open IIS Manager
- Select the website you want enable to accept large file uploads
- In the main window in the middle double click on the icon “Request filtering”
- Once the window is opened you will see a bunch of tabs across the top
- On the far right, select “Edit Feature Settings” and modify the “Maximum allowed content length (bytes)” In here, you can change this to up to 4.1 GB. Note: this entry is in BYTES, not KB!
- Click OK and then restart IIS.
