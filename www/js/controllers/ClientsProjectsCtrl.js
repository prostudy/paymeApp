StarterModule.controller('ClientsProjectsCtrl', function($state,$scope, $stateParams,$http,$ionicLoading,Global,$localstorage,$ionicHistory) {
	$scope.init = function(){
		console.log("ClientsProjectsCtrl");
		$scope.resetData();
		$scope.readUserInfoFromLocal();
	};
	
	$scope.resetData = function(){
		$scope.model = {};
		$scope.notPaidupActive = 'active';
		$scope.clientsNotPaidup = [];
		$scope.clientsPaidup = [];
		$scope.paidupActive = '';
		$scope.model.total = 0.0;
		
		$scope.clientList = $scope.clientsNotPaidup;
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
			$state.go("login");
		}
	};
	
	/**
	 * Prepara los datos para ser presentados en pantalla
	 * */
	$scope.prepareClients = function(allclients){
		$scope.model.allClients = allclients;
		$scope.clientsNotPaidup.total = 0;
		$scope.clientsPaidup.total = 0;
		
		for(index=0; index < $scope.model.allClients.clients.length; index++){
			if($scope.model.allClients.clients[index].projectsPaidup.length > 0){
				$scope.clientsPaidup.push($scope.model.allClients.clients[index]);
				$scope.clientsPaidup[$scope.clientsPaidup.length-1].total = 0;
				for(j=0;j< $scope.clientsPaidup[$scope.clientsPaidup.length-1].projectsPaidup.length;j++){
					$scope.clientsPaidup[$scope.clientsPaidup.length-1].total += parseFloat($scope.clientsPaidup[$scope.clientsPaidup.length-1].projectsPaidup[j].cost);
					$scope.clientsPaidup.total += $scope.clientsPaidup[$scope.clientsPaidup.length-1].total;
				} 
			}
		}
		
		for(index=0; index < $scope.model.allClients.clientsb.length; index++){
			if($scope.model.allClients.clientsb[index].projectsNotPaidup.length > 0){
				$scope.clientsNotPaidup.push($scope.model.allClients.clientsb[index]);
				$scope.clientsNotPaidup[$scope.clientsNotPaidup.length-1].total = 0;
				for(j=0;j< $scope.clientsNotPaidup[$scope.clientsNotPaidup.length-1].projectsNotPaidup.length;j++){
					$scope.clientsNotPaidup[$scope.clientsNotPaidup.length-1].total += parseFloat($scope.clientsNotPaidup[$scope.clientsNotPaidup.length-1].projectsNotPaidup[j].cost);
					$scope.clientsNotPaidup.total += $scope.clientsNotPaidup[$scope.clientsNotPaidup.length-1].total;
				} 
			}
		}
		
		$scope.clientList = $scope.clientsNotPaidup
		$scope.clientListTotal = $scope.clientsNotPaidup.total 
	};
	
	$scope.activeNotPaidup = function(){
		$scope.notPaidupActive = 'active';
		$scope.paidupActive = '';
		$scope.clientList = $scope.clientsNotPaidup;
		$scope.clientListTotal = $scope.clientsNotPaidup.total 
	};
	
	$scope.activePaidup = function(){
		$scope.notPaidupActive = '';
		$scope.paidupActive = 'active';
		$scope.clientList = $scope.clientsPaidup;
		$scope.clientListTotal = $scope.clientsPaidup.total 
	};
	
	$scope.clientSelected = function(client){
		console.log("El cliente seleccionado es:");
		console.log(client);
	};
	
	$scope.init();
});
