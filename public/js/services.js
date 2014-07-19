'use strict';

angular.module('JugPlanner.Services', []).
    factory('LoginService', [ function () {
        var user = null;

        return {
            getUserLogged: function () {
                return user;
            },
            setUserLogged: function (newUsername) {
                user = {username: newUsername};
            },
            clearLoggedUser: function(){
                user = null;
            }
        };
    }]);