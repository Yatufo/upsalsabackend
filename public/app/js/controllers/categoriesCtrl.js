'use strict';

/* Controllers */

angular.module('myAppControllers')
    .controller('CategoriesCtrl', ['$scope', '$http', '$routeParams', 'CONFIG', 'diffusionService',
        function($scope, $http, $routeParams, CONFIG, diffusionService) {


            $scope.isCollapsed = false;
            $scope.selectedCategories = {};
            $scope.categories = {};
            $scope.rootCategories = [];
            $scope.reloadCategories = false;

            $http.get(CONFIG.CATEGORIES_ENDPOINT).success(function(data) {
                $scope.categories = data;
                $scope.rootCategories = data['root'];
                setDefaultValues();
            });

            var setDefaultValues = function() {
                for (var key in CONFIG.DEFAULT_CATEGORIES) {
                    $scope.selectedCategories[key] = CONFIG.DEFAULT_CATEGORIES[key];
                }

                //the event type selected by the user
                if ($routeParams.eventType) {
                    $scope.changeSelectCategory("eventtype", $routeParams.eventType);
                }
            };

            $scope.changeSelectCategory = function(rootId, childId) {
                $scope.selectedCategories[rootId] = ($scope.selectedCategories[rootId] !== childId ? childId : null);
                diffusionService.changeCategories($scope.selectedCategories);
                changeCategoriesStatus();
            };


            $scope.isGroupVisible = function(category) {
                return angular.isUndefined(category.parent) || $scope.selectedCategories[category.parent] === category.id;
            };


            diffusionService.onChangeEvents($scope, function(message) {
                $scope.eventsCategories = message.eventsCategories;
                changeCategoriesStatus();
            });

            var changeCategoriesStatus = function() {

                $scope.rootCategories.forEach(function(root) {

                    var visibleCount = 0;
                    $scope.categories[root.id].forEach(function(category) {
                        updateCategoryStatus(category);

                        if (category.visible) {
                            visibleCount++;
                        }
                    });

                    root.visible = updateRootCategoryStatus(root, visibleCount);

                });
            }


            var updateRootCategoryStatus = function(category, count) {
                var isChildToggled = angular.isString($scope.selectedCategories[category.id]);
                var isVisibleChildren = count > 1;

                return isChildToggled || isVisibleChildren;
            }


            var updateCategoryStatus = function(category) {

                category.selected = $scope.selectedCategories[category.parent] === category.id;

                var isHappensOn = category.parent === "happenson"
                var isContainedInEvents = $scope.eventsCategories.indexOf(category.id) != -1;
                var isNoSiblingToggled = !angular.isString($scope.selectedCategories[category.parent]);

                if (category.selected && !isHappensOn && !isContainedInEvents) {
                    $scope.selectedCategories[category.parent] = null;
                }

                category.visible = (isHappensOn || isContainedInEvents) && (isNoSiblingToggled || category.selected);
                category.disabled = !(isHappensOn || isContainedInEvents);
            }

        }


    ]);
