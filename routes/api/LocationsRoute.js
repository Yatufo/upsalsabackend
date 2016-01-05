var data = require('../model/core-data.js');
var upload = require('./UploadRoute.js');
var ctx = require('../util/conf.js').context();
var usersRoute = require('./UsersRoute.js');

//
//
exports.create = function(req, res) {


  var userId = req.user.sub;
  var newLocation = req.body;


  usersRoute
    .findById(userId)
    .then(function(user) {
      newLocation.createdBy = user.id;


      var locationData = new data.Location(newLocation);
      locationData.save(function(e, saved) {
        if (e) throw e;

        res.status(201).send(saved);
      });

  });


};




//
//
exports.delete = function(req, res) {
  var userId = req.user.sub;
  var locationId = req.params.id;

  usersRoute
    .findById(userId)
    .then(function(user) {


    data.Location.findOneAndRemove({ _id: locationId, createdBy: user.id}, function(e, deleted) {
      if (e) throw e;

      if (deleted) {
        res.send(deleted);
      } else {
        res.status(404).send();
      }
    });

  });
};

//
//
exports.update = function(req, res) {
  var userId = req.user.sub;
  var locationId = req.params.id;
  var newLocation = req.body;

  usersRoute
    .findById(userId)
    .then(function(user) {


      newLocation.createdBy = user.id;
      data.Location.findOneAndUpdate({ _id: locationId, createdBy: user.id}, newLocation, function(e, modified) {
        if (e) throw e;

        if (modified) {
          res.send(modified);
        } else {
          res.status(404).send();
        }
      });

  });
};

//
//
exports.findAll = function(req, res) {

  var maxResults = ctx.LOCATIONS_MAXRESULTS;
  data.Location.find()
    .select('id name url phone address coordinates.latitude coordinates.longitude ratings images score comments')
    .populate('comments')
    .sort({
      score: -1,
      name: 1
    })
    .limit(maxResults)
    .exec(function(err, locations) {
      res.send(locations);
    });
};



exports.findById = function(req, res) {

  data.Location.findOne({
      "id": req.params.id
    })
    .select('id name url phone address coordinates.latitude coordinates.longitude ratings images score comments')
    .populate('comments')
    .exec(function(err, singleLocation) {
      if (err) {
        console.error('location not found for that id: ', req.params.id, err);
      }
      res.send(singleLocation);
    });
};



exports.addImage = function(req, res) {
  var userId = req.user.sub;
  var locationId = req.params.id;


  upload.uploadImage(req, res, function(imageUrl) {

    if (!(userId && locationId && imageUrl)) {
      console.error("Invalid image parameters ", userId, locationId, imageUrl);
      res.status(500).send({
        "messages": ["Could not save the image"]
      })
      return
    }

    var savedImage = {
      url: imageUrl,
      owner: userId,
      created: new Date()
    }

    data.Location.findOneAndUpdate({
      id: locationId
    }, {
      $addToSet: {
        images: savedImage
      }
    }, function(e, location) {
      if (e) throw e;

      res.status(201).send(location);
    });

  });


};
