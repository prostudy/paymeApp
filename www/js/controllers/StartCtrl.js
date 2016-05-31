StarterModule.controller('StartCtrl', function($scope,$state,Global,$localstorage,$ionicModal) {
	$scope.init = function(){
		console.log("StartCtrl");
		if($localstorage.getObject(Global.OBJECT_USER_INFO)){
			$state.go('login');
		}
	};
	
	/*Ventanas iniciales de ayuda*/
	  $ionicModal.fromTemplateUrl('templates/modalsHelp.html', {
		    scope: $scope
		  }).then(function(modal) {
			  	if(!$localstorage.getObject(Global.OBJECT_FIRST_TIME_APP)){
			  		$localstorage.setObject(Global.OBJECT_FIRST_TIME_APP,true);
			  		$scope.modalHelp1 = modal;
			  		$scope.help1();
				}
		  });
		  
	  $scope.closeHelp1 = function() {
	    $scope.modalHelp1.hide();
	  };

	  $scope.help1 = function() {
	    $scope.modalHelp1.show();
	  };
	  
	
	$scope.init();
});
