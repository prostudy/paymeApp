StarterModule.controller('BarController', function($state,$scope, $stateParams,$http,$ionicLoading,Global,$localstorage,$ionicHistory,$rootScope) {
	$scope.init = function(){
		console.log("BarController");
	};
	
	
	$scope.$on('updateNotifications', function(event, totalNotifications) {
		$scope.totalNotifications = totalNotifications
	});
	

	$scope.init();
});
