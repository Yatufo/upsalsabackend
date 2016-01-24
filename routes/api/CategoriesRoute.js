var data = require('../model/core-data.js');

//
//
exports.findAll = function(req, res, next) {

    data.Category.find()
        .select('id name categories parent')
        .populate({
            path: 'categories',
            select: 'id name categories parent',
        })
        .exec(function(e, categories) {
            if (e) return next(e);

            res.send(categories);
        });

};
