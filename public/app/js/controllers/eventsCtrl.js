'use strict';

/* Controllers */

var myAppControllers = angular.module('myAppControllers', ['myAppConfig']);

myAppControllers.controller('EventsCtrl', ['$scope', '$http', 'CONFIG',
    function($scope, $http, CONFIG) {

        $scope.localTime = CONFIG.TODAY;
        $scope.daysRange = CONFIG.DEFAULT_HAPPENSON;

        $http.get(CONFIG.EVENTS_ENDPOINT).success(function(data) {
            $scope.events = data;
        });
    }
]);
