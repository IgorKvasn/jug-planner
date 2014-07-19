'use strict';

angular.module('JugPlanner.Controllers', ['JugPlanner.Services']).
    controller('NavbarMenuCtrl', ['$scope', '$http', 'LoginService', function ($scope, $http, loginService) {
        $scope.getUserLogged = function () {
            return loginService.getUserLogged();
        }
    }])

    .controller('LoginCtrl', ['$scope', '$http', 'LoginService', function ($scope, $http, loginService) {
        $scope.loginError = null;
        $scope.loginData = {};

         $scope.actionLogin = function () {
            $scope.loginError = null;
            $http.post('/api/login', $scope.loginData).success(function (data) {
                loginService.setUserLogged($scope.loginData.username);
                $('#loginModal').modal('hide');
            }).error(function (err) {
                $scope.loginError = err;
            });

        };

        $scope.actionLogout = function () {
            //todo server-side logout
            loginService.clearLoggedUser();
            $('#logoutModal').modal('hide');
        };
    }])

    .controller('RegistrationCtrl', ['$scope', '$http', function ($scope, $http) {
        $scope.submitted = false;
        $scope.passwordsMatch = true;
        $scope.formData = {};
        $scope.formError = null;
        $scope.registrationSuccessful = false;

        $scope.submitForm = function (isValid) {
            $scope.formError = null;
            $scope.submitted = true;
            $scope.passwordsMatch = true;

            if (isValid) {
                if (!matchPasswords()) {
                    $scope.formError = 'Passwords do not match';
                    $scope.formData.password1 = '';
                    $scope.formData.password2 = '';
                    return;
                }

                $http.post('/api/register', $scope.formData).success(function (data) {
                    $scope.registrationSuccessful = true;

                }).error(function (err) {
                    $scope.formError = err;
                });

            }

            function matchPasswords() {
                return $scope.formData.password1 === $scope.formData.password2;
            }
        };
    }])

    .controller('UserListCtrl', ['$scope', '$http', function ($scope, $http) {
        $scope.userList = "";
        $http.get('/api/usersData').success(function (data) {
            $scope.userList = data;
        });
    }]);
