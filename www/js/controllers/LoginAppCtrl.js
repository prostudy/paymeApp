StarterModule.controller('LoginAppCtrl', function($scope,$state,$cordovaOauth, $stateParams,$http,$ionicLoading,Global,$localstorage,$ionicPopup,FormatFieldService,$ionicHistory,ConnectivityMonitor,$cordovaDialogs) {

	$scope.init = function(){
		console.log("LoginAppCtrl");
		$scope.connectivity();
		$scope.resetData();
	};
	
	$scope.resetData = function(){
		$scope.model = {};
		$scope.showMessageClass = 'showMessageClassHidden';
		$scope.model.loginDisabled = true;
		//$ionicHistory.clearHistory();
		//$ionicHistory.clearCache();
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
			$scope.model = FormatFieldService.readUserInfoFromLocal();
			$scope.sendCredentials($scope.model.email,$scope.model.password,null,true);
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
			//$scope.model.email = $scope.model.email.trim().toLowerCase();
			//$scope.model.password = $scope.model.password.trim();
			$scope.sendCredentials($scope.model.email.trim().toLowerCase(), $scope.model.password.trim(),null,false);
		}else{
			$scope.showMessageClass = 'showMessageClass';
		}
	};
	
	
	/**
	 * Se conecta al servidor para validar los datos de login
	 * */
	$scope.sendCredentials = function(email,password,picture,localstorage){
		$ionicLoading.show({});
		var url = Global.URL_LOGIN + "&email=" + email + "&password=" + password + "&localstorage=" + localstorage  ;
		$http.jsonp(url).
        then(function successCallback(data, status, headers, config){
        	$scope.validResponsaDataFromServer(data,picture);
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
	$scope.validResponsaDataFromServer = function(response,picture){
		if(response.data.success){
			response.data.items.user.picture = picture;
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
	 * login con facebook
	 * http://ngcordova.com/docs/plugins/oauth/
	 * https://forum.ionicframework.com/t/unknown-provider-cordovaprovider/13305/11
	 * http://www.sitepoint.com/how-to-integrate-facebook-login-into-a-cordova-based-app/
	 */
	$scope.loginFacebook = function(){
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
						$scope.sendCredentials(result.data.email, result.data.email + result.data.id,result.data.picture,false);
					}else{//Si facebook NO regresa el email
						 $cordovaDialogs.prompt('Enter an email', 'title', ['btn 1','btn 2'], '')
						    .then(function(promptEmail) {
						      var email = promptEmail.input1.trim().toLowerCase();
						      // no button = 0, 'OK' = 1, 'Cancel' = 2
						      var btnIndex = promptEmail.buttonIndex;
						      if(btnIndex == 1 && !FormatFieldService.invalidEmail(email)){
						    	  $scope.sendCredentials(email, email + result.data.id,result.data.picture,false);
						      }
						    });
					}
					
		 }, function(error) {
		        alert("Error: " + error);
		 });
	};
	
	/**
	 * Guarda de manera local la información del usuario
	 * */
	$scope.saveUserInfo = function(userInfo,picture){
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
