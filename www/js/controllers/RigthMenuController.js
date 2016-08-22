StarterModule.controller("rigthMenuController",
function($state,$scope,$ionicSlideBoxDelegate,$ionicSideMenuDelegate,$ionicSideMenuDelegate,$localstorage,Global,$state,$ionicHistory,FormatFieldService){
	$scope.toggleRigthSideMenu= function(){
		 $ionicSideMenuDelegate.toggleRight();
	};
	
	

	
	$scope.init = function(){
		console.log("rigthMenuController");
		$scope.model = FormatFieldService.readUserInfoFromLocal();
		/*if($scope.model.picture == null){
			$scope.model.picture = $scope.model.picure;
		} */
	};
	
	$scope.logout = function(){
		$scope.deleteUserInfo();
	};
	
	$scope.deleteUserInfo = function(){
		$localstorage.removeItem(Global.OBJECT_USER_INFO);
		$localstorage.removeItem(Global.OBJECT_CLIENT_LIST);
		$ionicHistory.clearHistory();
		$ionicHistory.clearCache();
		$state.go('start');
	};
	
	$scope.goToSettings=function(){
		$ionicSideMenuDelegate.toggleRight();
		$state.go("settings");
		
	};
	
	$scope.init();
	
});