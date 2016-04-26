StarterModule.controller('ClientsProjectsCtrl', function($state,$scope, $stateParams,$http,$ionicLoading,Global,$localstorage,$ionicHistory) {
	$scope.init = function(){
		console.log("ClientsProjectsCtrl");
		$scope.resetData();
		$scope.readUserInfoFromLocal();
	};
	
	$scope.resetData = function(){
		$scope.model = {};
		$scope.notPaidupActive = 'active';
		$scope.model.clientsPaidup = [];
		$scope.model.clientsNotPaidup = [];
		$scope.paidupActive = '';
		
		//$scope.clientList = $scope.clientsNotPaidup;
		$ionicHistory.clearHistory();
		$ionicHistory.clearCache();
	}
	
	/**
	 * Realiza la lectura del localstorage
	 * */
	$scope.readUserInfoFromLocal = function(){
		if($localstorage.getObject(Global.OBJECT_USER_INFO)){
			$scope.model.userInfo = $localstorage.getObject(Global.OBJECT_USER_INFO)
			$scope.getClientsFromServer($scope.model.userInfo.idusers);
		}else{
			$state.go("login");
		}
	};
		
	$scope.getClientsFromServer = function(userId){
		$ionicLoading.show({});
		var url = Global.URL_CLIENTS_PROJECTS_AND_REMINDERS + userId;
		$http.jsonp(url).
        then(function successCallback(data, status, headers, config){
        	$scope.validResponsaDataFromServer(data);        	
            $ionicLoading.hide();
            },function errorCallback(data, status, headers, config) {
                console.log(data);
                $ionicLoading.hide();
        });
	};
	
	/**
	 * Valida la respuesta del webservice
	 * */
	$scope.validResponsaDataFromServer = function(response){
		if(response.data.success){
        	$scope.prepareClients(response.data.items);
		}else{
			console.log(response.data.message);
			//$state.go("login");
		}
	};
	
	/**
	 * Prepara los datos para ser presentados en pantalla
	 * */
	$scope.prepareClients = function(allclients){
		$scope.model.allClients = allclients;
		
		angular.forEach($scope.model.allClients.clientsNotPaidup, function(value, key) {
			if(key != 'total'){$scope.model.clientsNotPaidup.push( value);}
		});
		
		angular.forEach($scope.model.allClients.clientsPaidup, function(value, key) {
			if(key != 'total'){$scope.model.clientsPaidup.push( value);}
		});
	
		$scope.clientList = $scope.model.clientsNotPaidup;
		$scope.clientListTotal =  $scope.model.allClients.clientsNotPaidup.total;
	};
	

	$scope.activeNotPaidup = function(){
		$scope.notPaidupActive = 'active';
		$scope.paidupActive = '';
		$scope.clientList = $scope.model.clientsNotPaidup;
		$scope.clientListTotal = $scope.model.allClients.clientsNotPaidup.total;
	};
	
	$scope.activePaidup = function(){
		$scope.notPaidupActive = '';
		$scope.paidupActive = 'active';
		$scope.clientList = $scope.model.clientsPaidup;
		$scope.clientListTotal = $scope.model.allClients.clientsPaidup.total; 
	};
	
	$scope.clientSelected = function(client){
		console.log("El cliente seleccionado es:");
		console.log(client);
		$state.go('clientProject', {client: client.project.description });
	};
	
	$scope.init();
});
