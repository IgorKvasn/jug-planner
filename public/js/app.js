'use strict';

var JugPlanner = angular.module('JugPlanner', [
    'ui.bootstrap',
    'JugPlanner.Services',
    'JugPlanner.Controllers',
    'ngRoute',
    'ngLocale'
    ]);

//AngularJS Routes
JugPlanner.config(['$routeProvider', '$locationProvider',
    function ($routeProvider, $locationProvider) {
        $routeProvider.
            when('/register', {
                templateUrl: 'partials/register',
                controller: 'RegistrationCtrl'
            });
        $locationProvider.html5Mode(true);
    }]);
