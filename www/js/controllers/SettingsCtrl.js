StarterModule.controller('SettingsCtrl', function($scope, $stateParams,$localstorage,Global,FormatFieldService) {
	$scope.init = function(){
		console.log("SettingsCtrl");
		$scope.resetData();
		$scope.readUserInfoFromLocal();
	};
	
	$scope.resetData = function(){
		$scope.model = {};
		$scope.model.createDisabled = true;
		$scope.showMessageClass = 'showMessageClassHidden';
	}
	
	/**
	 * Se validan los campos cada vez que hay un cambio para activar el boton de registrar
	 * */
	$scope.changeField = function(){
		$scope.model.createDisabled = !FormatFieldService.validCreateAccountFields($scope.model.name,$scope.model.lastname,$scope.model.email,$scope.model.password);	
	};
	
	$scope.readUserInfoFromLocal = function(){
		$scope.model = FormatFieldService.readUserInfoFromLocal();
		if($scope.model.picture == null){
			$scope.model.picture = 'img/default-user.jpg';
		} 
	};
	
	
		
	$scope.init();
});
