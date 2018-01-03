'use strict';

const AWS = require('aws-sdk');

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();
const bucketName = process.env.S3_BUCKET

module.exports = (fs) => {

  if (process.env.NODE_ENV === 'develop') {
    console.log('mail');
    return (filename, path, file) => {};
  }

  return (filename, path, file) => {
    var params = {
      Bucket: bucketName,
      Key: filename,
      Body: fs.readFileSync(path)
    };
    s3.putObject(params, function(err, data) {
      if (err) {
        console.log(err, err.stack);
      } else {
        console.log(data);
      }   
      fs.unlink(tmp_path, function() {
        if (err) {
          console.log(err, err.stack);
        } else {
          console.log('TODO');
        }
      });
    });
  };
};

