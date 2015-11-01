var multer = require('multer');
var s3 = require('multer-s3');
var ctx = require('../util/conf.js').context();
var path = require('path')



var storageS3 = s3({
  dirname: '/',
  bucket: ctx.s3.bucket,
  secretAccessKey: ctx.s3.secretAccessKey,
  accessKeyId: ctx.s3.accessKeyId,
  region: ctx.s3.region,
  filename: function(req, file, cb) {
    req.NEW_FILE_NAME = Date.now() + path.extname(file.originalname);
    cb(null, req.NEW_FILE_NAME);
  }
});

var multer = multer({
  storage: storageS3
});

var upload = multer.single("image");

exports.uploadImage = function(req, res, next) {

  upload(req, res, function(err) {
    if (err) {
      throw err;
    }
    
    console.log(req.NEW_FILE_NAME);

    res.status(200).send('Successfully uploaded!');
  });

};
