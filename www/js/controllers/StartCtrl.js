StarterModule.controller('StartCtrl', function($scope,$state,Global,$localstorage) {
	$scope.init = function(){
		console.log("StartCtrl");
		if($localstorage.getObject(Global.OBJECT_USER_INFO)){
			$state.go('login');
		}
	};
	
	$scope.init();
});
