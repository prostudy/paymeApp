StarterModule.controller('SettingsCtrl', function($scope, $stateParams,$localstorage,Global,FormatFieldService,$ionicLoading,$http) {
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
		$scope.model.picture = 'img/default-user.jpg';
		/*if($scope.model.picture == null){
			$scope.model.picture = {};
			$scope.model.picture.data.url = 'img/default-user.jpg';
		} */
	};
	
	
	/**
	 * Accion que se invoca desde el boton de crear cuenta
	 * */
	$scope.updateAccount = function(){
		if(FormatFieldService.validUpdateAccountFields($scope.model.name,$scope.model.lastname,$scope.model.email)){
			$scope.model.name = $scope.model.name.trim().toUpperCase();
			$scope.model.lastname = $scope.model.lastname.trim().toUpperCase();
			$scope.model.email = $scope.model.email.trim().toLowerCase();
			$scope.model.password = $scope.model.password.trim();
			$scope.model.text_account = $scope.model.text_account.trim().toUpperCase();
			$scope.sendDataForUpdateAccount($scope.model.name,$scope.model.lastname,$scope.model.email,$scope.model.password,$scope.model.text_account);
		}else{
			$scope.showMessageClass = 'showMessageClass';
		}
	};
	
	/**
	 * Se conecta al servidor para validar los datos de crear cuenta
	 * */
	$scope.sendDataForUpdateAccount = function(name,lastname,email,password,text_account){
		$ionicLoading.show({});
		var url = Global.URL_UPDATE_USER + '&iduser=' + $scope.model.idusers + '&email=' + email + '&name=' + name + '&lastname=' + lastname + '&password=' + password + '&textAccount=' + text_account ;
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
			alert("Failed to update your data");
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
        	
        	$localstorage.setObject(Global.OBJECT_USER_INFO, data.data.items.user);
        	alert("Your data is updated correctly");
        	
        	$ionicLoading.hide();
            },function errorCallback(data, status, headers, config) {
                console.log(data);
                //$scope.showAlert(response.data.message);
                $scope.showMessageClass = 'showMessageClass';
                $ionicLoading.hide();
                alert("Failed to update your data");
        });
	};	
	
	
		
	$scope.init();
});
