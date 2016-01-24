var async = require('async');
var Promise = require('promise');
var data = require('../model/core-data.js');
var usersRoute = require('./UsersRoute.js');
var commentCollector = require('../collectors/CommentCollector.js');

exports.create = function(req, res, next) {
  var userId = req.user.sub;

  usersRoute
    .findById(userId)
    .then(function(user) {
      var commentData = new data.Comment(req.body);
      commentData.created = new Date();
      commentData.lastUpdate = commentData.created;
      commentData.user = user._id;
      commentData.userInfo = user.publicInfo;
      commentData.save(function(e) {
        if (e) return next(e);

        res.location('/api/comments/' + commentData.id)
        res.status(201).send(commentData);
        commentCollector.collect(commentData, function (e) {
          if (e) { console.warn("Could not collect the comment", e);}
        });
      });
    });

};

//
//allows a user to modify her own comments.
exports.update = function(req, res, next) {
  var userId = req.user.sub;

  usersRoute
    .findById(userId)
    .then(function(user) {
      data.Comment.findOneAndUpdate({
        _id: req.body.id,
        user: user._id
      }, {
        $set: {
          lastUpdate: new Date(),
          comment: req.body.comment
        }
      }, function(e, commentData) {
        if (e) return next(e);

        res.status(204).send();
      });
    });
};
