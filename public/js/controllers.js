'use strict';

angular.module('JugPlanner.Controllers', []).
    //Collapse-able registration form controller.
    controller('NavbarMenuCtrl', ['$scope', '$http', function ($scope, $http) {
        //This property is used for collapse-able div
      $scope.pokus='aaaa';
    }])

    .controller('LoginCtrl', ['$scope', '$http', function ($scope, $http) {

    }])

    .controller('RegistrationCtrl', ['$scope', '$http', function ($scope, $http) {
        $scope.submitted = false;
        $scope.passwordsMatch = true;
        $scope.formData = {};
        $scope.formError = null;

        $scope.submitForm = function(isValid) {
            $scope.formError = null;
            $scope.submitted = true;
            $scope.passwordsMatch = true;

            if (isValid) {
                if (!matchPasswords()){
                    $scope.formError = 'Passwords do not match';
                    $scope.formData.password1 = '';
                    $scope.formData.password2 = '';
                    return;
                }

                $http.post('/api/register', $scope.formData).success(function (data) {
                    alert(data);

                }).error(function (err) {
                    $scope.formError = err;
                });

            }

            function matchPasswords(){
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
