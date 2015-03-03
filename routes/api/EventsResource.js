//Config for the app
var async = require('async');
var data = require('../model/core-data.js');
var ctx = require('../util/conf.js').context();
//
// 
exports.search = function(req, res) {

    var filters = getFiltersByCategories(req.query.categories);
    var maxResults = ctx.EVENTS_MAXRESULTS;


    var conditions = {
        "start.dateTime": {
            $lt: filters.time.max
        },
        "end.dateTime": {
            $gt: filters.time.min,
        },
        "categories": {
            $all: filters.categories // TODO: For now it only supports querying with at least one category.
        }
    }



    var callPaginationData = function(callback) {
        data.Event.aggregate([{
                $match: conditions
            }, {
                $unwind: "$categories"
            }, {
                $group: {
                    _id: null,
                    eventsCategories: {
                        $addToSet: "$categories"
                    }
                }
            }],
            function(err, results) {
                callback(err, results);
            })
    }

    var callEventsQuery = function(callback) {

        data.Event.find()
            .where(conditions)
            .populate('location')
            .limit(maxResults)
            .sort('-start.dateTime')
            .exec(function(err, events) {
                callback(err, events);
            });
    }

    async.parallel([callPaginationData, callEventsQuery],
        function(err, results) {
            if (err) {
                throw err;
            }

            var combined = results[0][0];
            if (combined) {
                combined.events = results[1];
            }

            res.send(combined);
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


    return filters;
}

var getTimeFilter = (function(happensOn) {
    var time = {};
    time.min = (ctx.SIMULATED_NOW ? new Date(ctx.SIMULATED_NOW) : new Date());
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
        .populate('location')
        .exec(function(err, singleEvent) {
            res.send(singleEvent);
        });
};
