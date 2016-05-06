StarterModule.controller('ClientProjectCtrl', function($state,$scope,$ionicHistory ,$stateParams,$ionicLoading,Global,$localstorage,$rootScope,$http,$timeout) {
	$scope.init = function(){
		console.log("ClientProjectCtrl");
		$scope.resetData();
	};
	
	$scope.resetData = function(){
		$scope.model = {};

	}
	
	$scope.$on('updateClientSelected', function(event, clientAndProject) {
		$scope.model = clientAndProject;
	});
	
	$scope.archivingProject = function(archive){
		var url = Global.URL_SET_PROJECT_AS_ARCHIVED + $scope.model.project.idprojects +'&idclient=' +$scope.model.idclients + '&deleted=' + archive ;
		$http.jsonp(url).
        then(function successCallback(data, status, headers, config){
        	$scope.validResponsaDataFromServer(data);        	
            },function errorCallback(data, status, headers, config) {
                console.log(data);
        });
	};
	
	$scope.editProject = function(){
		$state.go('createReminder');
		$timeout(function() {
			 $rootScope.$broadcast('updateClientProjectInfo',$scope.model);
		 }, 200);
	};
	
	$scope.paidup = function(paid){
		var url = Global.URL_SET_PROJECT_AS_PAIDUP + $scope.model.project.idprojects +'&idclient=' +$scope.model.idclients + '&paid=' +paid ;
		$http.jsonp(url).
        then(function successCallback(data, status, headers, config){
        	$scope.validResponsaDataFromServer(data);        	
            },function errorCallback(data, status, headers, config) {
                console.log(data);
        });
	};
	
	/**
	 * Valida la respuesta del webservice
	 * */
	$scope.validResponsaDataFromServer = function(response){
		if(response.data.success){
			console.log(response.data.message);
			 $ionicHistory.goBack();
			 $timeout(function() {
				 $rootScope.$broadcast('doRefresh');
			 }, 1000);
		}else{
			console.log(response.data.message);
		}
	};
	
	$scope.init();
});
