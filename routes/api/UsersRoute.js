var async = require('async');
var data = require('../model/core-data.js');


function findById(userId) {
  return new Promise(function(resolve, reject) {
    data.User.findOne({
        'sync.auth0': userId
      })
      .populate("ratings")
      .exec(function(e, foundUser) {
        if (e) return next(e);
        
        if (foundUser) {
          resolve(foundUser)
        } else {
          reject(e)
        }
      });
  })
}

function createUser(user) {
  return new Promise(function(resolve, reject) {
    var newUser = new data.User(user);
    newUser.save(function(e) {
      if (e) reject(e);
      else resolve(newUser);
    });
  });
}

exports.findById = findById;

exports.findCurrent = function(req, res) {
  var userId = req.user.sub;
  findById(userId)
    .then(function(foundUser) {
      res.send(foundUser);
    }).catch(function() {
      res.status(404).send("User not found");
    });
};
//
//
exports.findOrCreate = function(req, res, next) {
  var userId = req.user.sub;
  var done = function(user) {
    res.send(user);
  };

  findById(userId)
    .then(done)
    .catch(function(e) {

      var newUser = req.body;
      newUser.sync = {
        created_at : new Date(req.body.sync.created_at),
        updated_at : new Date(req.body.sync.updated_at),
        auth0: userId
      };

      createUser(newUser)
        .then(done)
        .catch(function(e) {
          next(e);
        })
    });

};
