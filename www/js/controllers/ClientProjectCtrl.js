StarterModule.controller('ClientProjectCtrl', function($state,$scope, $stateParams,$http,$ionicLoading,Global,$localstorage,$ionicHistory) {
	$scope.init = function(){
		console.log("ClientProjectCtrl");
		$scope.resetData();
		$scope.model.project = $state.params.client;
	};
	
	$scope.resetData = function(){
		$scope.model = {};	
	}
	$scope.init();
});
