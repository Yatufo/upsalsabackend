//Config for the app
var _ = require('underscore-node');
var moment = require('moment-timezone');
var async = require('async');
var data = require('../model/core-data.js');
var ctx = require('../util/conf.js').context();
var usersRoute = require('./UsersRoute.js');
var upload = require('./UploadRoute.js');
var RRule = require('rrule').RRule;
var Promise = require('promise');


//
//
exports.search = function(req, res, next) {

  var conditions = getFiltersByCategories(req.query.categories);


  data.Event.find()
    .where(conditions)
    .limit(ctx.EVENTS_MAXRESULTS)
    .sort('start.dateTime')
    .exec(function(e, events) {
      if (e) return next(e);
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
exports.create = function(req, res, next) {

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
      var eventDatas = getEventDatas(newEvent);

      var savePromises = eventDatas.map(function(eventData) {
        return eventData.save();
      })

      Promise.all(savePromises)
      .then(function(values) {
        res.status(201).send(values[0]);
      }).catch(function(e) {
        next(e);
      });

    }).catch(function (e) {
      next(e);
    });
};


function getEventDatas(event) {
  var result = [];

  if (_.isObject(event.recurrence) && event.recurrence.rule) {

    var duration = moment(event.end.dateTime).diff(event.start.dateTime);

    //Workaround since the rrule does not support timeZones https://github.com/jkbrzt/rrule/issues/38
    var options = RRule.parseString(event.recurrence.rule)
    options.dtstart = moment.tz(event.start.dateTime, event.start.timeZone).toDate();
    var rule = new RRule(options)

    var recurrenceId = data.ObjectId();

    result = rule.all().map(function(ruleStart) {
      var recurentEvent = clone(event);
      var startTime = moment(ruleStart);
      var endTime = moment(startTime).add(duration, 'milliseconds');

      recurentEvent.start.dateTime = startTime.toDate();
      recurentEvent.end.dateTime = endTime.toDate();

      var dataEvent = new data.Event(recurentEvent);
      dataEvent.recurrence.id = recurrenceId;

      return dataEvent;
    });
  } else {
    result = [new data.Event(event)];
  }

  return result;
}

function clone(o) {
  return JSON.parse(JSON.stringify(o));
}

//
//
exports.delete = function(req, res) {
  var userId = req.user.sub;
  var eventId = req.params.id;

  usersRoute
    .findById(userId)
    .then(function(user) {


      data.Event.findOneAndRemove({
        _id: eventId,
        createdBy: user.id
      }, function(e, deleted) {
        if (e) return next(e);

        if (deleted) {
          res.send(deleted);
        } else {
          res.status(404).send();
        }
      });

    }).catch(function (e) {
      next(e);
    });;
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
      data.Event.findOneAndUpdate({
        _id: eventId,
        createdBy: user.id
      }, newEvent, function(e, modified) {
        if (e) return next(e);

        if (modified) {
          res.send(modified);
        } else {
          res.status(404).send();
        }
      });

    }).catch(function (e) {
      next(e);
    });;
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
    .exec(function(e, singleEvent) {
      if(e) return next(e);

      res.status(200).send(singleEvent);
    });
};




exports.addImage = function(req, res) {
  var userId = req.user.sub;
  var eventId = req.params.id;


  upload.uploadImage(req, res, function(e, imageUrl) {

    if (e){
      console.warn("Could not save the image", e);
    }

    if (!(userId && eventId && imageUrl)) {
      console.error("Invalid image parameters ", userId, eventId, imageUrl);
      res.status(400).send({
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
          if (e) return next(e);

          res.status(201).send(savedImage);
        });
      }).catch(function (e) {
        next(e);
      });

  });


};
