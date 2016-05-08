StarterModule.controller('ClientsProjectsCtrl', function($state,$scope, $stateParams,$http,$ionicLoading,Global,$localstorage,$ionicHistory,ConnectivityMonitor,$rootScope,$timeout,FormatFieldService) {
	$scope.init = function(){
		console.log("ClientsProjectsCtrl");
		$scope.isOnline = ConnectivityMonitor.isOnline();
		$scope.resetData();
		$scope.readUserInfoFromLocal();
	};
	
	$scope.resetData = function(){
		$scope.model = {};
		$scope.clientList  = [];
		$scope.clientList  = 0;
		$scope.notPaidupActive = 'active';
		$scope.model.clientsPaidup = [];
		$scope.model.clientsNotPaidup = [];
		$scope.paidupActive = '';
		
		//$scope.clientList = $scope.clientsNotPaidup;
		$ionicHistory.clearHistory();
		$ionicHistory.clearCache();
	}
	
	$scope.doRefresh = function() {
		$localstorage.removeItem(Global.OBJECT_CLIENT_LIST);
		$scope.init();
	 };
	 
	/**
	 * Se invoca desde ClientProjectCtrl cada que se hace una actualizacion sobre un proyecto.
	 */ 
	$scope.$on('doRefresh', function(event) {
		 $scope.doRefresh();
	});
	
	/**
	 * Realiza la lectura del localstorage
	 * */
	$scope.readUserInfoFromLocal = function(){
		if(ConnectivityMonitor.isOnline()){ 
			if( $localstorage.getObject(Global.OBJECT_USER_INFO)){
				$scope.model.userInfo = FormatFieldService.readUserInfoFromLocal();
				$scope.getClientList($scope.model.userInfo.idusers);
				$scope.getNotificationsByUserId($scope.model.userInfo.idusers);
			}else{
				$state.go("login");
			}
		}	
	};
	
	/**
	 * Dispara un evento para que leftMenuController consulte al server las notificaciones
	 */
	$scope.getNotificationsByUserId = function(iduser){
		$rootScope.$broadcast('lefMenugetRemindersSent',iduser);
	};
	
	
	/**
	 * Verifica si los datos fueron descargados y los lee del localstorage o los descarga del server
	 */
	$scope.getClientList = function(iduser){
		if( $localstorage.getObject(Global.OBJECT_CLIENT_LIST)){
			$scope.prepareClients( $localstorage.getObject(Global.OBJECT_CLIENT_LIST) );
		}else{
			$scope.getClientsFromServer(iduser);
		}
		
	};
		
	$scope.getClientsFromServer = function(userId){
		//$ionicLoading.show({});
		var url = Global.URL_CLIENTS_PROJECTS_AND_REMINDERS + userId;
		$http.jsonp(url).
        then(function successCallback(data, status, headers, config){
        	$scope.validResponsaDataFromServer(data);        	
            //$ionicLoading.hide();
            // Stop the ion-refresher from spinning
            $scope.$broadcast('scroll.refreshComplete');
            },function errorCallback(data, status, headers, config) {
                console.log(data);
               // $ionicLoading.hide();
                // Stop the ion-refresher from spinning
                $scope.$broadcast('scroll.refreshComplete');
        });
	};
	
	/**
	 * Valida la respuesta del webservice
	 * */
	$scope.validResponsaDataFromServer = function(response){
		if(response.data.success){
			$scope.saveClientList(response.data.items);
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
		if($scope.model.allClients){
		
			angular.forEach($scope.model.allClients.clientsNotPaidup, function(value, key) {
				if(key != 'total'){$scope.model.clientsNotPaidup.push( value);}
			});
			
			angular.forEach($scope.model.allClients.clientsPaidup, function(value, key) {
				if(key != 'total'){$scope.model.clientsPaidup.push( value);}
			});
	
			$scope.clientList = $scope.model.clientsNotPaidup;
			$scope.clientListTotal =  $scope.model.allClients.clientsNotPaidup.total;
		}
	};
	
	/**
	 * Guarda de manera local el listado
	 * */
	$scope.saveClientList = function(clientList){
		$localstorage.setObject(Global.OBJECT_CLIENT_LIST, clientList);
	};
	

	$scope.activeNotPaidup = function(){
		$scope.notPaidupActive = 'active';
		$scope.paidupActive = '';
		if($scope.model.clientsNotPaidup && $scope.model.allClients){
			$scope.clientList = $scope.model.clientsNotPaidup;
			$scope.clientListTotal = $scope.model.allClients.clientsNotPaidup.total;
		}
	};
	
	$scope.activePaidup = function(){
		$scope.notPaidupActive = '';
		$scope.paidupActive = 'active';
		
		if($scope.model.clientsPaidup && $scope.model.allClients){
			$scope.clientList = $scope.model.clientsPaidup;
			$scope.clientListTotal = $scope.model.allClients.clientsPaidup.total; 
		}
		
	};
	
	$scope.clientSelected = function(clientAndProject){
		$state.go('clientProject');
		$timeout(function() {
			$rootScope.$broadcast('updateClientSelected', clientAndProject);
		 }, 200);
	};
	
	$scope.init();
});
