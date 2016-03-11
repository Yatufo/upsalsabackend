var _ = require('lodash');
var data = require('../model/core-data.js');
var upload = require('./UploadRoute.js');
var ctx = require('../util/conf.js').context();
var usersRoute = require('./UsersRoute.js');

//
//
exports.create = function(req, res, next) {


  var userId = req.user.sub;
  var newLocation = req.body;


  usersRoute
    .findById(userId)
    .then(function(user) {
      newLocation.createdBy = user.id;

      if(newLocation.images){
        newLocation.images.forEach(function (image) {
          image.createdBy = user.id;
          image.created = new Date();
        })
      }

      newLocation.code = _.kebabCase(_.truncate(newLocation.name, 40));
      var locationData = new data.Location(newLocation);
      locationData.save(function(e, saved) {
        if (e) return next(e);

        res.status(201).send(saved);
      });

  }).catch(function (e) {
    next(e);
  });
;


};




//
//
exports.delete = function(req, res, next) {
  var userId = req.user.sub;
  var locationId = req.params.id;

  usersRoute
    .findById(userId)
    .then(function(user) {

    var permission = _.includes(user.roles, "ADMIN") ? {} : {createdBy: user.id};
    var conditions = _.extend({_id: locationId}, permission)

    data.Location.findOneAndRemove(conditions, function(e, deleted) {
      if (e) return next(e);

      if (deleted) {
        res.send(deleted);
      } else {
        res.status(404).send();
      }
    });

  }).catch(function (e) {
    next(e);
  });
;
};

//
//
exports.update = function(req, res, next) {
  var userId = req.user.sub;
  var locationId = req.params.id;
  var newLocation = req.body;

  usersRoute
    .findById(userId)
    .then(function(user) {


      var permission = _.includes(user.roles, "ADMIN") ? {} : {createdBy: user.id};
      var conditions = _.extend({_id: locationId}, permission)

      data.Location.findOneAndUpdate(conditions, newLocation, function(e, modified) {
        if (e) return next(e);

        if (modified) {
          res.send(modified);
        } else {
          res.status(404).send();
        }
      });

  }).catch(function (e) {
    next(e);
  });
;
};

//
//
exports.findAll = function(req, res) {

  var maxResults = ctx.LOCATIONS_MAXRESULTS;
  data.Location.find()
    .select('id code name url phone address description coordinates.latitude coordinates.longitude ratings images score comments createdBy')
    .populate('comments')
    .sort({
      score: -1,
      name: 1
    })
    .limit(maxResults)
    .exec(function(e, locations) {
      if(e) return next(e);

      res.send(locations);
    });
};



exports.findById = function(req, res) {

  data.Location.findOne({
      "_id": req.params.id
    })
    .select('id code name url phone address description coordinates.latitude coordinates.longitude ratings images score comments createdBy')
    .populate('comments')
    .exec(function(e, singleLocation) {
      if (e) return next(e);
      res.send(singleLocation);
    });
};



exports.addImage = function(req, res, next) {
  var userId = req.user.sub;
  var locationId = req.params.id;


  upload.uploadImage(req, res, function(e, imageUrl) {
    if (e){
      console.warn("Could not save the image", e);
    }

    if (!(userId && locationId && imageUrl)) {
      console.error("Invalid image parameters ", userId, locationId, imageUrl);
      res.status(500).send({
        "messages": ["Could not save the image"]
      })
      return
    }

    usersRoute
      .findById(userId)
      .then(function(user) {

        var savedImage = {
          url: imageUrl,
          createdBy: user.id,
          created: new Date()
        }

        data.Location.findOneAndUpdate({
          _id: locationId
        }, {
          $addToSet: {
            images: savedImage
          }
        }, function(e, location) {
          if (e) return next(e);

          res.status(201).send(savedImage);
        });

    }).catch(function (e) {
      next(e);
    });

  });


};
