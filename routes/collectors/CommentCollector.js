var data = require('../model/core-data.js');



var updateLocationComments = function(comment, done) {
  data.Location.findOneAndUpdate({
    _id: comment.location
  }, {
    $addToSet: {
      comments: comment._id
    }
  }).exec(done);

}


exports.collect = function(comment, done) {
  updateLocationComments(comment, done);
}
