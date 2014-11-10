/**
 * 
 */
var userForm = angular.module("writeDiary", [ 'ui.bootstrap' ]);

userForm
		.controller(
				"UserFormCtrl",
				function($scope, $http, $location, $window) {
					$http.get("/user").success(function(response) {

						$scope.results = response;
						console.log($scope.results);
					});
					$scope.add_user = function() {
						console.log("view:" + $scope.user_email);
						$http.post("/add_user", {
							'email_id' : $scope.user_email,
							'name' : $scope.user_name,
							'password' : $scope.passw1
						}).success(
								function(data, status, headers, config
										) {
									if (status == 205) {
										console.log("등록된 아이디");
										alert("등록된 아이디 입니다.");
										// 이걸하면 tooltip이 떠있는 채로 가려버리네..
										// $scope.user_email="";
										// $scope.incomplete =false;
									} else {
										alert($scope.user_name + " 님 환영합니다!");
										console.log("inserted Successfully "
												+ $location.absUrl());

										$window.location.href="main_user.html?user_id="+encodeURIComponent(data);
												// .search({
												// 'id_user' : data
												//										});
										


									}
								});
					}
					$scope.user_email = '';
					$scope.user_name = '';
					$scope.passw1 = '';
					$scope.passw2 = '';

					$scope.edit = true;
					$scope.error = false;
					$scope.incomplete = false;

					$scope.editUser = function(id) {
						if (id == 'new') {
							$scope.edit = true;
							$scope.incomplete = true;
							$scope.user_email = '';
							$scope.user_name = '';
						} else {
							$scope.edit = false;
							$scope.user_email = $scope.users[id - 1].user_email;
							$scope.user_name = $scope.users[id - 1].user_name;
						}
					};

					$scope.$watch('passw1', function() {
						$scope.test();
					});
					$scope.$watch('passw2', function() {
						$scope.test();
					});
					$scope.$watch('user_email', function() {
						$scope.test();
					});
					$scope.$watch('user_name', function() {
						$scope.test();
					});

					$scope.test = function() {
						if ($scope.passw1 !== $scope.passw2) {
							$scope.error = true;
						} else {
							$scope.error = false;
						}
						$scope.incomplete = false;
						if ($scope.edit
								&& (!$scope.user_email.length
										|| !$scope.user_name.length
										|| !$scope.passw1.length || !$scope.passw2.length)) {
							$scope.incomplete = true;
						}
					};

				});
