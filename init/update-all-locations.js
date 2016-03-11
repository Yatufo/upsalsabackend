var data = require('../routes/model/core-data.js');
var _ = require('lodash');

data.Location.find()
  .exec(function(e, locations) {
    if(e) console.error(e);

    locations.forEach(function( location ) {
      location.code = _.kebabCase(_.truncate(location.name, 40));

      data.Location.findOneAndUpdate({_id : location._id}, location, function(e, saved) {
        if(e) console.error(e);
        console.log(saved);
      });

    })

});
