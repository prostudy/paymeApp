StarterModule.controller('ForgotPasswordCtrl', function($scope,$state,$ionicHistory,Global,$ionicLoading,$http,FormatFieldService,ModalService) {
	$scope.init = function(){
		console.log("ForgotPasswordCtrl");
		$scope.resetData();
	};
	
	$scope.resetData = function(){
		$scope.model = {};
		$scope.model.passwordDisabled = true;
		$scope.showMessageClass = 'showMessageClassHidden';
	}
	
	$scope.goBack = function(){
		 $ionicHistory.goBack();
	};
	
	/**
	 * Se validan los campos cada vez que hay un cambio para activar el boton de login
	 * */
	$scope.changeField = function(){
		$scope.model.passwordDisabled = FormatFieldService.invalidEmail($scope.model.email);		
	};
	
	/**
	 * Accion para validar el email
	 * */
	$scope.changePassword = function(){
		if(!FormatFieldService.invalidEmail($scope.model.email)){
			$scope.requestChangePassword($scope.model.email.trim().toLowerCase());
		}else{
			$scope.showMessageClass = 'showMessageClass';
		}
	};
	
	/**
	 * Se conecta al servidor para validar el email de cambio de password
	 * */
	$scope.requestChangePassword = function(email){
		$ionicLoading.show({});
		var url = Global.URL_REQUEST_CHANGE_PASSWORD + email;
		$http.jsonp(url).
	    then(function successCallback(data, status, headers, config){ 
	    	$scope.validResponsaDataFromServer(data);
	    	$ionicLoading.hide();
	        },function errorCallback(data, status, headers, config) {
	            console.log(data);
	            $ionicLoading.hide();
	            $scope.showMessageClass = 'showMessageClass';
	    });
	};
	
	
	/**
	 * Valida la respuesta del webservices que valida los usuarios
	 * */
	$scope.validResponsaDataFromServer = function(response){
		if(response.data.success){
			$scope.showCommunModal();
			$scope.resetData();
			//$scope.goBack();
		}else{
			$scope.resetData();
			//$scope.showAlert(response.data.message);
			console.log(response.data.message);
			$scope.showMessageClass = 'showMessageClass';
		}
	};
	
	

	//Muestra un modal con el mensaje de exito
	$scope.showCommunModal = function(){
		$scope.messageModal = "Se ha enviado un correo electronico";
		$scope.titleButtonModal = 'Iniciar sesion';
		$scope.actionButtonModal = "login";
		ModalService.initModal('templates/modals/common-modal.html','forgotPassword-modal', $scope)
		.then(function(modal){
			$scope.commonModal = modal;
			modal.show();
		});
	};
	//Sobre escribir este metodo en todo controler que haga uso del modal generico
	$scope.commonButtonModalAction = function(){
		 $scope.commonModal.hide();
		 $state.go($scope.actionButtonModal);
	};
	
		
	$scope.init();
});
