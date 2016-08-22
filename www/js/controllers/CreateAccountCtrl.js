StarterModule.controller('CreateAccountCtrl', function($scope, $state,$cordovaOauth ,$stateParams,$http,$ionicLoading,Global,$ionicPopup,FormatFieldService,$cordovaDialogs,$ionicModal,ModalService) {
	$scope.init = function(){
		console.log("CreateAccountCtrl");
		$scope.resetData();
	};
	
	$scope.resetData = function(){
		$scope.model = {};
		$scope.model.createDisabled = true;
		$scope.showMessageClass = 'showMessageClassHidden';
		$scope.commonModal = null;
	}
	
	/**
	 * Se validan los campos cada vez que hay un cambio para activar el boton de registrar
	 * */
	$scope.changeField = function(){
		$scope.model.createDisabled = !(FormatFieldService.validCreateAccountFields($scope.model.name,$scope.model.lastname,$scope.model.email,$scope.model.password) &&  $scope.model.termAndCondition.checked) ;	
	};	
	
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
		var url = Global.URL_CREATE_ACCOUNT + "&email=" + email + "&name=" + name +"&lastname=" + lastname + "&password=" + password;
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
			//$scope.goToLoginScreen();
			 $scope.showCommunModal();//Muestra un modal con el mensaje de exito
		}else{
			//$scope.showAlert(response.data.message);
			$scope.showMessageClass = 'showMessageClass';
			console.log(response.data.message);
		}
	};
	
	/**
	 * login con facebook
	 * http://ngcordova.com/docs/plugins/oauth/
	 * https://forum.ionicframework.com/t/unknown-provider-cordovaprovider/13305/11
	 * http://www.sitepoint.com/how-to-integrate-facebook-login-into-a-cordova-based-app/
	 */
	$scope.createAccountWithFacebook = function(){
		 $cordovaOauth.facebook(Global.ID_FACEBOOK_APP, ["email", "public_profile"]).then(function(result) {
	            $scope.getCredentialsFromFacebook(result.access_token);
	        }, function(error) {
	            alert("There was a problem signing in!");
	            console.log(error);
	        });
	};
	
	$scope.getCredentialsFromFacebook = function(access_token){
		$http.get("https://graph.facebook.com/v2.2/me", 
				{params: {access_token: access_token, fields: "name,first_name,last_name,gender,picture,email", format: "json" }})
				.then(function(result) {
					if(result.data.email){//Si facebook regresa el email  
						$scope.sendCredentialsForCreateAccount(result.data.name, result.data.last_name,result.data.email, result.data.email+ result.data.id);
					}else{//Si facebook NO regresa el email
						 $cordovaDialogs.prompt('Enter an email', 'title', ['btn 1','btn 2'], '')
						    .then(function(promptEmail) {
						      var email = promptEmail.input1.trim().toLowerCase();
						      // no button = 0, 'OK' = 1, 'Cancel' = 2
						      var btnIndex = promptEmail.buttonIndex;
						      if(btnIndex == 1 && !FormatFieldService.invalidEmail(email)){
								$scope.sendCredentialsForCreateAccount(result.data.name, result.data.last_name,email, email + result.data.id);
						      }
						    });
					}
					
		 }, function(error) {
		        alert("Error: " + error);
		 });
	};
	
	
	//Muestra un modal con el mensaje de exito
	$scope.showCommunModal = function(){
		$scope.messageModal = "Registro exitoso del usuario";
		$scope.titleButtonModal = 'Iniciar session';
		$scope.actionButtonModal = "login";
		ModalService.initModal('templates/modals/common-modal.html','createAccount-modal', $scope)
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
