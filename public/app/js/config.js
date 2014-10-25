'use strict';

var config_module = angular.module('myAppConfig', [])
    .constant('CONFIG', {
        'APP_NAME': 'Mulatti',
        'APP_VERSION': '0.1',
        'EVENTS_ENDPOINT': '/api/events',
        'TODAY': new Date('2014-10-26T00:00:01-04:00'),
        'DEFAULT_HAPPENSON': 'today',
        'ONE_DAY_MILIS':86400000,
        'WEEKEND_DAYS' : [5, 6, 0]

    });