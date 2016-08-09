StarterModule.controller('SettingsCtrl', function($scope, $stateParams,$localstorage,Global,FormatFieldService,$ionicLoading,$http,$cordovaOauth) {
	$scope.init = function(){
		console.log("SettingsCtrl");
		$scope.resetData();
		$scope.readUserInfoFromLocal();
	};
	
	$scope.resetData = function(){
		$scope.model = {};
		$scope.model.updateDisabled = true;
		$scope.showMessageClass = 'showMessageClassHidden';
	}
	
	/**
	 * Se validan los campos cada vez que hay un cambio para activar el boton de actualizar
	 * */
	$scope.changeField = function(){
		$scope.model.updateDisabled = !FormatFieldService.validUpdateAccountFields($scope.model.name,$scope.model.lastname,$scope.model.email,$scope.model.password);	
	};
	
	$scope.readUserInfoFromLocal = function(){
		$scope.model = FormatFieldService.readUserInfoFromLocal();
		$scope.model.passwordLocal = $scope.model.password;
		$scope.model.password = '';
	};
	
	
	/**
	 * Accion que se invoca desde el boton de actualizar
	 * */
	$scope.updateAccount = function(){
		if(FormatFieldService.validUpdateAccountFields($scope.model.name,$scope.model.lastname,$scope.model.email)){
			$scope.model.name = $scope.model.name.trim().toUpperCase();
			$scope.model.lastname = $scope.model.lastname.trim().toUpperCase();
			$scope.model.email = $scope.model.email.trim().toLowerCase();
			$scope.model.password = $scope.model.password.trim();
			$scope.model.text_account = $scope.model.text_account.trim().toUpperCase();
			$scope.model.phone =  $scope.model.phone;
			$scope.model.clabe =  $scope.model.clabe;
			$scope.model.card =  $scope.model.card;
			$scope.model.paypal = $scope.model.paypal ? $scope.model.paypal.trim().toLowerCase() : '';
			$scope.sendDataForUpdateAccount($scope.model.name,$scope.model.lastname,$scope.model.email,$scope.model.password,$scope.model.text_account,$scope.model.clabe,$scope.model.card,$scope.model.paypal,$scope.model.phone);
		}else{
			$scope.showMessageClass = 'showMessageClass';
		}
	};
	
	/**
	 * Se conecta al servidor para validar los datos de crear cuenta
	 * */
	$scope.sendDataForUpdateAccount = function(name,lastname,email,password,text_account,clabe,card,paypal,phone){
		$ionicLoading.show({});
		var url = Global.URL_UPDATE_USER + '&iduser=' + $scope.model.idusers + '&email=' + email + '&name=' + name + '&lastname=' + lastname + '&password=' + password + '&textAccount=' + text_account + '&clabe=' + clabe + '&card=' + card + '&paypal=' + paypal + '&phone=' + phone;
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
			$scope.getInfoUserFromServer();
		}else{
			//$scope.showAlert(response.data.message);
			$scope.showMessageClass = 'showMessageClass';
			console.log(response.data.message);
			//alert("Failed to update your data");
		}
	};
	
	/**
	 * Se conecta al servidor para validar los datos de login
	 * */
	$scope.getInfoUserFromServer = function(){
		$ionicLoading.show({});
		var url = '';
		if($scope.model.password.trim().length > 0){
			url = Global.URL_LOGIN + "&email=" + $scope.model.email + "&password=" + $scope.model.password + "&localstorage=" + false  ;	
		}else{
			url = Global.URL_LOGIN + "&email=" + $scope.model.email + "&password=" + $scope.model.passwordLocal + "&localstorage=" + true  ;
		}
		$http.jsonp(url).
        then(function successCallback(data, status, headers, config){
        	data.data.items.user.phone = parseInt(data.data.items.user.phone);
        	data.data.items.user.clabe = parseInt(data.data.items.user.clabe);
        	data.data.items.user.card = parseInt(data.data.items.user.card);
        	data.data.items.user.picture = $scope.model.picture;
        	$localstorage.setObject(Global.OBJECT_USER_INFO, data.data.items.user);
        	alert("Your data is updated correctly");
        	
        	$ionicLoading.hide();
            },function errorCallback(data, status, headers, config) {
                console.log(data);
                //$scope.showAlert(response.data.message);
                $scope.showMessageClass = 'showMessageClass';
                $ionicLoading.hide();
                //alert("Failed to update your data");
        });
	};
	

	$scope.connectFacebook = function(){
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
						$scope.model.email = result.data.email.trim().toLowerCase();	
					}
					 $scope.model.picture = result.data.picture.data.url;
					 $scope.getInfoUserFromServer();
		 }, function(error) {
		        alert("Error: " + error);
		 });
	};
		
	$scope.init();
});
