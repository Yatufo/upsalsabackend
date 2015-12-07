var categories = require('../api/CategoriesResource.js');

var bucket = [];
var res = {
    send: (function(categories) {
        var unindexed = [];
        categories['root'].categories.forEach(function(rootCategories, index) { // Eventype, Level, Class, etc.
            unindexed.push(categories[rootCategories._id].categories);
        });


        var multiply = function(a, b) {
            var multiplication = [];
            var index = 0
            a.forEach(function(element1) {
                multiplication[index] = [];
                addAllElements(multiplication[index], element1);
                index++;

                b.forEach(function(element2) {
                    multiplication[index] = [element2.id];
                    addAllElements(multiplication[index], element1)
                    index++;
                });
            });
            return multiplication;
        };

        var addAllElements = function(elements, newElements) {
            if (Array.isArray(newElements)) {
                newElements.forEach(function(subElement) {
                    elements.push(subElement);
                });
            } else {
                elements.push(newElements.id);
            }
        }


        var previousResult = [];
        unindexed.forEach(function(element, index) {
            if (index == 0) {
                previousResult = element;
            } else {
                previousResult = multiply(previousResult, unindexed[index]);
            }
        });

        previousResult.forEach(function(list, index) {
            if (list.length >= 4) {
                console.log(list.join('-'));
            }
        });
    })
}
categories.findAll(null, res);
