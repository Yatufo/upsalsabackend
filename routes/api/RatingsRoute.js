var async = require('async');
var Promise = require('promise');
var data = require('../model/core-data.js');
var usersRoute = require('./UsersRoute.js');
var ratingCollector = require('../collectors/RatingCollector.js');

exports.create = function(req, res) {

  var userId = req.user.sub;

  usersRoute
    .findById(userId)
    .then(function(user) {
      var ratingData = new data.Rating(req.body);
      ratingData.user = user._id;
      ratingData.save(function(e) {
        if (e) return next(e);

        res.location('/api/ratings/' + ratingData.id)
        res.status(201).send({
          id: ratingData.id
        });
        ratingCollector.collect(ratingData);
      });
    });

};

//
//
exports.update = function(req, res) {
  var userId = req.user.sub;

  usersRoute
    .findById(userId)
    .then(function(user) {

      data.Rating.findOneAndUpdate({
        _id: req.body.id,
        user: user._id // Find also by user, so rating can only be changed by the original user.
      }, {
        $set: {
          vote: req.body.vote
        }
      }, null, function(e, ratingData) {
        if (e) return next(e);

        res.status(204).send();
        ratingCollector.collect(ratingData);
      });

    });
};
