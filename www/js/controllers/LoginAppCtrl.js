StarterModule.controller('LoginAppCtrl', function($scope,$state, $stateParams,$http,$ionicLoading,Global,$localstorage) {
	$scope.init = function(){
		console.log("LoginAppCtrl");
		$scope.model = {};
	};
	
	/**
	 * Accion que se invoca desde el boton de la pantalla de login
	 * */
	$scope.login = function(){
		if($scope.verifyData()){
			$scope.sendCredentials($scope.model.email,$scope.model.password);
		}else{
			console.log("Los datos no son correctos");
		}
	};
	
	/**
	 * Validación del formato de los datos
	 * */
	$scope.verifyData =  function(){
		if($scope.model.email && $scope.model.password){
			if($scope.model.email.length == 0 || $scope.model.password.length == 0){
				console.log("Los campos estan vacios");
				return false;
			}else if(!$scope.validateEmail($scope.model.email)){
				console.log("Error en el formato del correo");
				return false;
			}else{
				$scope.model.email = $scope.model.email.trim().toLowerCase();
				$scope.model.password = $scope.model.password.trim().toLowerCase();
				return true;
			}
		}else{
			return false;
		}
		
		
	};
	
	$scope.validateEmail = function(email) {
	    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	    return re.test(email);
	}
	
	/**
	 * Se conecta al servidor para validar los datos de login
	 * */
	$scope.sendCredentials = function(){
		$ionicLoading.show({});
		var userId = 50;
		var url = Global.URL_LOGIN + "&email=" + $scope.model.email + "&password=" + $scope.model.password;
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
	 * Valida la respuesta del webservices que valida los usuarios
	 * */
	$scope.validResponsaDataFromServer = function(response){
		if(response.data.success){
			$scope.saveUserInfo(response.data.items.user);
			$scope.goToClientsScreen();
			$scope.model = {};
		}else{
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
		
	$scope.init();
});
