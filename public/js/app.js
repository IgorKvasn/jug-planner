'use strict';

var JugPlanner = angular.module('JugPlanner', [
    'ui.bootstrap',
    'JugPlanner.Controllers',
    'ngRoute']);

//AngularJS Routes
JugPlanner.config(['$routeProvider', '$locationProvider',
    function ($routeProvider, $locationProvider) {
        $routeProvider.
            when('/user_list', {
                templateUrl: 'partials/user_list',
                controller: 'UserListCtrl'
            }).
            when('/register', {
                templateUrl: 'partials/register',
                controller: 'RegistrationCtrl'
            });
        $locationProvider.html5Mode(true);
    }]);
