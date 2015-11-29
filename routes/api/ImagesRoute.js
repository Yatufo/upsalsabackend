var data = require('../model/core-data.js');
var upload = require('./UploadRoute.js');
var ctx = require('../util/conf.js').context();


exports.addImage = function(req, res) {

  upload.uploadImage(req, res, function(imageUrl) {

    res.status(201).send({
      url: imageUrl
    });

  });

};
