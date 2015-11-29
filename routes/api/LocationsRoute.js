var data = require('../model/core-data.js');
var upload = require('./UploadRoute.js');
var ctx = require('../util/conf.js').context();


//
//
exports.create = function(req, res) {

  var locationData = new data.Location(req.body);
  locationData.save(function(err) {
    if (err) {
      res.status(500).send(err);
    }
    res.status(201).send(locationData);
  });
};


//
//
exports.findAll = function(req, res) {

  var maxResults = ctx.LOCATIONS_MAXRESULTS;
  data.Location.find()
    .select('-_id id name url phone address coordinates.latitude coordinates.longitude ratings images score comments')
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
    .select('-_id id name url phone address coordinates.latitude coordinates.longitude ratings images score comments')
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
      res.status(500).send({ "messages" : ["Could not save the image"]})
      return
    }

    var savedImage = {
      url: imageUrl,
      owner: userId,
      created : new Date()
    }
    console.log(locationId);
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
