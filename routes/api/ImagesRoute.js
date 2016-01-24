var data = require('../model/core-data.js');
var upload = require('./UploadRoute.js');
var ctx = require('../util/conf.js').context();


exports.addImage = function(req, res, next) {

  upload.uploadImage(req, res, function(e, imageUrl) {
    if (e) {
      return next(e);
    }

    res.status(201).send({
      url: imageUrl
    });

  });

};
