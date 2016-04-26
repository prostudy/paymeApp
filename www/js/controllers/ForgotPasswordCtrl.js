StarterModule.controller('ForgotPasswordCtrl', function($scope,$state,$ionicHistory,Global,$ionicLoading,$ionicPopup,$http,FormatFieldService) {
	$scope.init = function(){
		console.log("ForgotPasswordCtrl");
		$scope.resetData();
	};
	
	$scope.resetData = function(){
		$scope.model = {};
		$scope.showMessageClass = 'showMessageClassHidden';
	}
	
	$scope.goBack = function(){
		 $ionicHistory.goBack();
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
			$scope.showAlert(response.data.message);
			$scope.model = {};
			$scope.goBack();
		}else{
			$scope.model = {};
			//$scope.showAlert(response.data.message);
			console.log(response.data.message);
			$scope.showMessageClass = 'showMessageClass';
		}
	};
	
	
	 // An alert dialog
	 $scope.showAlert = function(message) {
	   var alertPopup = $ionicPopup.alert({
	     title: 'Change password',
	     template: message
	   });

	   alertPopup.then(function(res) {
	     console.log('Muestra alert');
	   });
	 };
		
	$scope.init();
});
