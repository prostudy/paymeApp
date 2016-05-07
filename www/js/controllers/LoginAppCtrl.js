StarterModule.controller('LoginAppCtrl', function($scope,$state, $stateParams,$http,$ionicLoading,Global,$localstorage,$ionicPopup,FormatFieldService,$ionicHistory,ConnectivityMonitor) {

	$scope.init = function(){
		console.log("LoginAppCtrl");
		$scope.connectivity();
		$scope.resetData();
	};
	
	$scope.resetData = function(){
		$scope.model = {};
		$scope.showMessageClass = 'showMessageClassHidden';
		$scope.model.loginDisabled = true;
		$ionicHistory.clearHistory();
		$ionicHistory.clearCache();
	};
	
	
	/**
	 * Inicia el servicio que verifica si hay conexion
	 * */
	$scope.connectivity = function(){
		$ionicLoading.show({});
		$scope.isOnline = true;
		ConnectivityMonitor.startWatching();
		 setTimeout(function () {
			$ionicLoading.hide();
			$scope.isOnline = ConnectivityMonitor.isOnline();
			$scope.readUserInfoFromLocal();
		}, 2000);
	};
	
	/**
	 * Realiza la lectura del localstorage para ver si se tienen los datos y realizar el login automaticamente
	 * */
	$scope.readUserInfoFromLocal = function(){
		if($localstorage.getObject(Global.OBJECT_USER_INFO)){
			$scope.model = $localstorage.getObject(Global.OBJECT_USER_INFO)
			$scope.sendCredentials($scope.model.email,$scope.model.password,true);
		}
	};
	
	/**
	 * Se validan los campos cada vez que hay un cambio para activar el boton de login
	 * */
	$scope.changeField = function(){
		$scope.model.loginDisabled = !FormatFieldService.validLoginFields($scope.model.email,$scope.model.password);	
	};
	
	/**
	 * Accion que se invoca desde el boton de la pantalla de login
	 * */
	$scope.login = function(){
		$scope.isOnline = ConnectivityMonitor.isOnline();
		if(FormatFieldService.validLoginFields($scope.model.email,$scope.model.password) && $scope.isOnline){
			$scope.model.email = $scope.model.email.trim().toLowerCase();
			$scope.model.password = $scope.model.password.trim();
			$scope.sendCredentials($scope.model.email,$scope.model.password,false);
		}else{
			$scope.showMessageClass = 'showMessageClass';
		}
	};
	
	
	/**
	 * Se conecta al servidor para validar los datos de login
	 * */
	$scope.sendCredentials = function(email,password,localstorage){
		$ionicLoading.show({});
		var url = Global.URL_LOGIN + "&email=" + email + "&password=" + password + "&localstorage=" + localstorage  ;
		$http.jsonp(url).
        then(function successCallback(data, status, headers, config){ 
        	$scope.validResponsaDataFromServer(data);
        	$ionicLoading.hide();
            },function errorCallback(data, status, headers, config) {
                console.log(data);
                //$scope.showAlert(response.data.message);
                $scope.showMessageClass = 'showMessageClass';
                $ionicLoading.hide();
        });
	};
	
	/**
	 * Valida la respuesta del webservices que valida los usuarios
	 * */
	$scope.validResponsaDataFromServer = function(response){
		if(response.data.success){
			$scope.saveUserInfo(response.data.items.user);
			$scope.resetData();
			$scope.goToClientsScreen();
		}else{
			//$scope.showAlert(response.data.message);
			$scope.showMessageClass = 'showMessageClass';
			console.log(response.data.message);
		}
	};
	
	/**
	 * Guarda de manera local la información del usuario
	 * */
	$scope.saveUserInfo = function(userInfo){
		$localstorage.setObject(Global.OBJECT_USER_INFO, userInfo);
	};
	
	$scope.goToClientsScreen = function(){
		 $state.go('clientsProjects');
	};
	
	$scope.goToChangePasswordScreen = function(){
		$state.go('forgotPassword');
	}
	
	// An alert dialog
	 $scope.showAlert = function(message) {
	   var alertPopup = $ionicPopup.alert({
	     title: 'Login Payme',
	     template: message
	   });

	   alertPopup.then(function(res) {
	     //console.log('Muestra alert');
	   });
	 };
		
	$scope.init();
});
