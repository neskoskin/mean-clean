angular.module('myApp', []);

angular.module('myApp').controller('mainController', ['$scope', function($scope) {
	
	$scope.message = 'Hello Universe!';
	
}]);