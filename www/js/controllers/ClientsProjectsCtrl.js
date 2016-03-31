StarterModule.controller('ClientsProjectsCtrl', function($state,$scope, $stateParams,$http,$ionicLoading,Global) {
	$scope.init = function(){
		console.log("ClientsProjectsCtrl");
		$scope.getDataFromServer();
	};
		
	$scope.getDataFromServer = function(){
		$ionicLoading.show({});
		var userId = 50;
		var url = Global.URL_CLIENTS_PROJECTS_AND_REMINDERS + userId;
		$http.jsonp(url).
        then(function successCallback(data, status, headers, config){
        	$scope.model = data.data; 
        	console.log($scope.model);
        	//$scope.title = title;
        	$ionicLoading.hide();
            },function errorCallback(data, status, headers, config) {
                console.log(data);
                $ionicLoading.hide();
        });
	};
	
	$scope.init();
});
