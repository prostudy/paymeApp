StarterModule.controller('TrashCtrl', function($state,$scope, $stateParams,$http,$ionicLoading,Global,$localstorage,$ionicHistory,ConnectivityMonitor,$rootScope,$timeout,FormatFieldService) {
	$scope.init = function(){
		console.log("TrashCtrl");
		$scope.isOnline = ConnectivityMonitor.isOnline();
		$scope.resetData();
		$scope.readUserInfoFromLocal();
	};
	
	$scope.resetData = function(){
		$scope.model = {};
		$scope.model.projectsList = [];
		
	};
	
	$scope.doRefresh = function() {
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
				$scope.getProjectsDeleted($scope.model.userInfo.idusers);
			}else{
				$state.go("login");
			}
		}	
	};
	
	$scope.getProjectsDeleted = function(userId){
		var p = [{'description':'Projecto uno'},{'description':'Projecto web'}];
		$scope.prepareProjects(p);
		//$ionicLoading.show({});
		/*var url = Global.URL_CLIENTS_PROJECTS_AND_REMINDERS_DELETED + userId;
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
        });*/
	};
	
	/**
	 * Valida la respuesta del webservice
	 * */
	/*$scope.validResponsaDataFromServer = function(response){
		if(response.data.success){
        	$scope.prepareClients(response.data.items);
        	$scope.model.projectsList = response.data.items;
		}else{
			console.log(response.data.message);
			//$state.go("login");
		}
	};*/
	
	$scope.prepareProjects = function(projectsDeleted){
		$scope.model.projectsList = projectsDeleted;
	};
		
	$scope.init();
});
