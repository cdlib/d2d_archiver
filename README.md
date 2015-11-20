## D2D Archiver Service

### Description

A simple web service that will retrieve your application's archive file and store it on the local disk or in a designated AWS S3 bucket.

### Installation

1. Install node and npm on your server
2. Clone this repository 
3. Run npm installer > npm install
4. Setup you ./config/app.json file
5. Create the following directories: ./log, ./tmp, ./test/tmp 
6. Run the tests > npm test
7. Run the ./start.sh script

### Registering an application

You must first register an application before it can begin sending this service archive files. You must define the following values in the ./config/app.json file.

```json
 "projects": { 
   "application_1": {"domain": "my.server.org",
              "archive_extension": "gz",
              "key": "1234567890",
              "uri_form_field": "archive-file",
              "io": {"path": "/path/to/archive/"},
              "aws": {"region": "us-west-2",
                      "bucket": "vendor-bucket",
                      "key_prefix": "archive/"}}
  }
```

* *domain* --> The domain of the application/host from which the archive files will be downloaded from
* *archive_extension* --> The type of file
* *key* --> An API key that is unique to the application
* *uri_form_field* --> The field that contains the URI of the archive file that should be downloaded

* *io* --> The directory on the local disk that the service will place the downloaded archive file
* *aws* --> The AWS S3 bucket that the service will upload the downloaded archive file to 

Note that if you want your archive to go into an S3 bucket like: s3://my-bucket/archives/[file name]
You should put 'my-bucket' as the 'bucket' and 'archives/' as the 'key_prefix' in the config.

You can specify the 'io' and/or 'aws' sections for your application. If you only want a copy to be stored in an S3 bucket you can omit the 'io' section and vice versa.

### Sending a Request to the Service

> curl -v --data "archive-file=http://my.server.org/path/file_name.gz" http://service.host.org/application_1/1234567890/

Note: 
* The POST data has a form value, 'archive-file' that matches the uri_form_field in the config 
* The domain of the file in the 'archive-file' value MUST match the 'domain' in the config
* The service MUST be addressed to match the config [project]/[key]/ 

### Future Development
The service could be extended to allow an HTTP Post that contains the archive file instead of a URI.