StarterModule.controller('CreateAccountCtrl', function($scope, $state, $stateParams,$http,$ionicLoading,Global,$ionicPopup,FormatFieldService) {
	$scope.init = function(){
		console.log("CreateAccountCtrl");
		$scope.resetData();
	};
	
	$scope.resetData = function(){
		$scope.model = {};
		$scope.showMessageClass = 'showMessageClassHidden';
	}
	
	/**
	 * Accion que se invoca desde el boton de crear cuenta
	 * */
	$scope.createAccount = function(){
		if(FormatFieldService.validCreateAccountFields($scope.model.name,$scope.model.lastname,$scope.model.email,$scope.model.password)){
			$scope.model.name = $scope.model.name.trim().toUpperCase();
			$scope.model.lastname = $scope.model.lastname.trim().toUpperCase();
			$scope.model.email = $scope.model.email.trim().toLowerCase();
			$scope.model.password = $scope.model.password.trim();
			$scope.sendCredentialsForCreateAccount($scope.model.name,$scope.model.lastname,$scope.model.email,$scope.model.password);
		}else{
			$scope.showMessageClass = 'showMessageClass';
		}
	};
	
	/**
	 * Se conecta al servidor para validar los datos de crear cuenta
	 * */
	$scope.sendCredentialsForCreateAccount = function(name,lastname,email,password){
		$ionicLoading.show({});
		var url = Global.URL_CREATE_ACCOUNT + "&email=" + email + "&name=" + name +"&lastname=" + lastname + "&password=" + $scope.model.password;
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
	 * Valida la respuesta del webservice de crear cuenta
	 * */
	$scope.validResponsaDataFromServer = function(response){
		if(response.data.success){
			$scope.resetData();
			$scope.goToLoginScreen();
		}else{
			//$scope.showAlert(response.data.message);
			$scope.showMessageClass = 'showMessageClass';
			console.log(response.data.message);
		}
	};
	
	$scope.goToLoginScreen = function(){
		 $state.go('login');
	};
		
	$scope.init();
});
