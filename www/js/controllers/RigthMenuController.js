StarterModule.controller("rigthMenuController",
function($scope,$ionicSlideBoxDelegate,$ionicSideMenuDelegate,$ionicSideMenuDelegate,$localstorage,Global,$state,$ionicHistory){
	$scope.toggleRigthSideMenu= function(){
		 $ionicSideMenuDelegate.toggleRigth();
	};
	$scope.init = function(){
		console.log("rigthMenuController");
	};
	
	$scope.logout = function(){
		$scope.deleteUserInfo();
	};
	
	$scope.deleteUserInfo = function(){
		$localstorage.removeItem(Global.OBJECT_USER_INFO);
		$ionicHistory.clearHistory();
		$ionicHistory.clearCache();
		$state.go('login');
	};
	
	$scope.init();
	
});