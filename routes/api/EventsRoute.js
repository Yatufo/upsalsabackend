//Config for the app
var _ = require('underscore-node');
var moment = require('moment');
var async = require('async');
var data = require('../model/core-data.js');
var ctx = require('../util/conf.js').context();
var usersRoute = require('./UsersRoute.js');
var upload = require('./UploadRoute.js');

//
//
exports.search = function(req, res, next) {

  var conditions = getFiltersByCategories(req.query.categories);


  data.Event.find()
    .where(conditions)
    .limit(ctx.EVENTS_MAXRESULTS)
    .sort('start.dateTime')
    .exec(function(e, events) {
      if (e) next(e);
      res.status(200).send(events);
    });

};

var getFiltersByCategories = function(categories) {


  var yesterday = moment(new Date()).subtract(1, 'day').toDate()
  var filters = {
    "start.dateTime": {
      $gt: yesterday
    }
  }

  if (categories) {
    _.extend(filters, {
      "categories": {
        $all: categories.split(",") // TODO: For now it only supports querying with at least one category.
      }
    })
  }

  return filters;
}

exports.findById = function(req, res) {

  data.Event.findById(req.params.id)
    .exec(function(err, singleEvent) {
      res.send(singleEvent);
    });
};


//
//
exports.create = function(req, res) {

  var userId = req.user.sub;
  var newEvent = req.body;
  usersRoute
    .findById(userId)
    .then(function(user) {
      newEvent.createdBy = user.id;

      if (newEvent.images) {
        newEvent.images.forEach(function(image) {
          image.createdBy = user.id
        })
      }

      var eventsData = new data.Event(newEvent);
      eventsData.save(function(err) {
        if (err) {
          res.status(500).send(err);
        }
        res.status(201).send(eventsData);
      });

    });
};



//
//
exports.delete = function(req, res) {
  var userId = req.user.sub;
  var eventId = req.params.id;

  usersRoute
    .findById(userId)
    .then(function(user) {


    data.Event.findOneAndRemove({ _id: eventId, createdBy: user.id}, function(e, deleted) {
      if (e) next(e);

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
  var eventId = req.params.id;
  var newEvent = req.body;

  usersRoute
    .findById(userId)
    .then(function(user) {


      newEvent.createdBy = user.id;
      data.Event.findOneAndUpdate({ _id: eventId, createdBy: user.id}, newEvent, function(e, modified) {
        if (e) next(e);

        if (modified) {
          res.send(modified);
        } else {
          res.status(404).send();
        }
      });

  });
};







exports.findByLocationId = function(req, res) {
  var categories = getFiltersByCategories(req.query.categories);

  var conditions = _.extend(categories, {
    "location.id": req.params.id
  });

  data.Event.find()
    .where(conditions)
    .limit(ctx.EVENTS_MAXRESULTS)
    .sort('start.dateTime')
    .exec(function(err, singleEvent) {
      res.send(singleEvent);
    });
};




exports.addImage = function(req, res) {
  var userId = req.user.sub;
  var eventId = req.params.id;


  upload.uploadImage(req, res, function(imageUrl) {

    if (!(userId && eventId && imageUrl)) {
      console.error("Invalid image parameters ", userId, eventId, imageUrl);
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

        data.Event.findOneAndUpdate({
          _id: eventId
        }, {
          $addToSet: {
            images: savedImage
          }
        }, function(e, event) {
          if (e) next(e);
          res.status(201).send(savedImage);
        });
      });

  });


};
