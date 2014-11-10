/**
 * 
 */
var userForm = angular.module("writeDiary", [ 'ui.bootstrap' ,"ngRoute"]);
userForm.config(function($routeProvider, $locationProvider) {
	  $routeProvider
	   .when('/Book/:bookId', {
	    templateUrl: 'book.html',
	    controller: 'BookController',
	    resolve: {
	      // I will cause a 1 second delay
	      delay: function($q, $timeout) {
	        var delay = $q.defer();
	        $timeout(delay.resolve, 1000);
	        return delay.promise;
	      }
	    }
	  })
	  .when('/Book/:bookId/ch/:chapterId', {
	    templateUrl: 'chapter.html',
	    controller: 'UserFormCtrl'
	  });

	  // configure html5 to get links working on jsfiddle
	  $locationProvider.html5Mode(true);
	});

userForm.controller("UserFormCtrl",
		function($scope,$http,$location) {

$http.get("/users").success(function(response){
	
	$scope.results=response;
	console.log($scope.results);
} );

$scope.user_email = '';
$scope.user_name = '';
$scope.passw1 = '';
$scope.passw2 = '';

$scope.edit = true;
$scope.error = false;
$scope.incomplete = false; 

$scope.add_user=function(){
	
	$http.post("/add_user",{'email_id': $scope.user_email , 'name': $scope.user_name,'password':$scope.passw1})
	.success(function(data, status, headers, config){
	    console.log("inserted Successfully");
	    $location('/main_user');
	});	
}

$scope.editUser = function(id) {
  if (id == 'new') {
    $scope.edit = true;
    $scope.incomplete = true;
    $scope.user_email = '';
    $scope.user_name = '';
    } else {
    $scope.edit = false;
    $scope.user_email = $scope.users[id-1].user_email;
    $scope.user_name = $scope.users[id-1].user_name; 
  }
};

$scope.$watch('passw1',function() {$scope.test();});
$scope.$watch('passw2',function() {$scope.test();});
$scope.$watch('user_email', function() {$scope.test();});
$scope.$watch('user_name', function() {$scope.test();});

$scope.test = function() {
  if ($scope.passw1 !== $scope.passw2) {
    $scope.error = true;
    } else {
    $scope.error = false;
  }
  $scope.incomplete = false;
  if ($scope.edit && (!$scope.user_email.length ||
  !$scope.user_name.length ||
  !$scope.passw1.length || !$scope.passw2.length)) {
       $scope.incomplete = true;
  }
};

});

