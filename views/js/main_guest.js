/**
 * 
 */
var userForm = angular.module("mainGuest", [ 'ui.bootstrap' ]);

userForm.controller("guestCtrl", function($scope, $http,$window) {



	$scope.click_login = function() {
		$http.post("/login", {
			'email_id' : $scope.user_email,
			'password' : $scope.passw

		}).success(function(response) {
			console.log(response);
			if (response.length > 0) {
				//go main_user_earth
				$window.location.href="main_user.html?user_id="+encodeURIComponent(response[0].id_user);
				console.log("login"+response[0].user_id);

			} else {
				alert("잘못된 정보입니다.");
			}
		});
	}

});
