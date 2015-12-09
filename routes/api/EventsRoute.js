//Config for the app
var _ = require('underscore-node');
var async = require('async');
var data = require('../model/core-data.js');
var ctx = require('../util/conf.js').context();
var usersRoute = require('./UsersRoute.js');
var upload = require('./UploadRoute.js');

//
//
exports.search = function(req, res) {

  var conditions = getFiltersByCategories(req.query.categories);


  data.Event.find()
    .where(conditions)
    .limit(ctx.EVENTS_MAXRESULTS)
    .sort('start.dateTime')
    .exec(function(e, events) {
      if (e) throw e;
      res.status(200).send(events);
    });

};

var getFiltersByCategories = function(categories) {

  var filters = {
    categories: []
  };

  if (categories) {
    filters.categories = categories.split(",");

    var happensOnCategories = ['today', 'tomorrow', 'week', 'weekend'];
    happensOnCategories.forEach(function(happensOn) {
      var index = filters.categories.indexOf(happensOn);
      if (index > -1) {
        filters.categories.splice(index, 1);
        filters.time = getTimeFilter(happensOn);
      }
    });
  }

  if (!filters.time) {
    filters.time = getTimeFilter();
  }

  return {
    "start.dateTime": {
      $lt: filters.time.max
    },
    "end.dateTime": {
      $gt: filters.time.min,
    },
    "categories": {
      $all: filters.categories // TODO: For now it only supports querying with at least one category.
    }
  };
}

var getTimeFilter = (function(happensOn) {
  var time = {};
  time.min = new Date();
  time.max = new Date(time.min);
  time.max.setHours(0);

  switch (happensOn) {
    case "today":
      time.max.setDate(time.max.getDate() + 1);
      break;
    case "tomorrow":
      time.min.setDate(time.min.getDate() + 1);
      time.min.setHours(0);
      time.max.setDate(time.max.getDate() + 2);
      break;
    case "weekend":
      var dow = time.max.getDay()
      var offsetMin = 0;
      var offsetMax = 0;
      // is week day
      if (1 <= dow && dow <= 5) {
        offsetMin = 5 - dow;
        offsetMax = offsetMin + 3;
      } else if (dow > 5) {
        offsetMax = 2;
      } else {
        offsetMax = 1;
      }

      time.min.setDate(time.min.getDate() + offsetMin);
      time.max.setDate(time.max.getDate() + offsetMax);

      break;
    case "week":
      time.max.setDate(time.max.getDate() + 7);
      break;
    default:
      time.max.setDate(time.max.getDate() + 30);
      break;
  };

  return time;
});

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

        data.Event.findOneAndUpdate({
          _id: eventId
        }, {
          $addToSet: {
            images: {
              url: imageUrl,
              createdBy: user.id,
            }
          }
        }, function(e, location) {
          if (e) throw e;
          res.status(201).send(location);
        });
      });

  });


};
