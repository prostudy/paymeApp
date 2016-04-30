StarterModule.controller("leftMenuController",
function($scope,$ionicSlideBoxDelegate,$ionicSideMenuDelegate,$ionicSideMenuDelegate,$localstorage,Global,$http,$rootScope){
	
	$scope.toggleLeftSideMenu= function(){
		 $ionicSideMenuDelegate.toggleLeft();
	};
	
	$scope.init = function(){
		console.log("leftMenuController");
		$scope.resetData();
	};

	$scope.resetData = function(){
		$scope.model = {};
	};
	
	/**
	 * Este evento espera el llamado desde ClientsProjectsCtrl para consultar al server y llenar el menu izquierdo
	 * */
	$scope.$on('lefMenugetRemindersSent', function(event, iduser) {
		$scope.resetData();
		$scope.getRemindersSent(iduser);
	});
 	
	
	
	$scope.getRemindersSent = function (iduser){
		var url = Global.URL_GET_REMINDERS_SENT+iduser;
		$http.jsonp(url).
        then(function successCallback(data, status, headers, config){
        	$scope.validResponsaDataFromServer(data);        	
            },function errorCallback(data, status, headers, config) {
                console.log(data);
        });
	};
	
	/**
	 * Valida la respuesta del webservice
	 * */
	$scope.validResponsaDataFromServer = function(response){
		if(response.data.success){
			$scope.prepareRemindersSent (response.data.items);
		}else{
			console.log(response.data.message);
		}
	};
	
	/**
	 * Prepara los datos para ser presentados en pantalla
	 * */
	$scope.prepareRemindersSent = function(remindersSent){
		$scope.model.remindersSent = remindersSent;
		$rootScope.$broadcast('updateNotifications', $scope.model.remindersSent.length);
	 };
	 
	/**
	 * Marca como leido una notificación
	 */
	$scope.checkReminder = function(index,reminderSent){
		$scope.model.remindersSent.splice(index, 1);
		$rootScope.$broadcast('updateNotifications', $scope.model.remindersSent.length);
		$scope.setREmindersAsRead(reminderSent.idreminders);
	};
	
	/**
	 * MArca como leidas todas las notificaciones
	 */
	$scope.clearNotifications = function(){
		var idreminders = [];
		angular.forEach($scope.model.remindersSent , function(reminder, key) {
			idreminders.push(reminder.idreminders);
		});
		$scope.model.remindersSent = [];
		$rootScope.$broadcast('updateNotifications', $scope.model.remindersSent.length);
		$scope.setREmindersAsRead(idreminders.join());
	};
	
	$scope.setREmindersAsRead = function(idreminders){
		var url = Global.URL_SET_REINDERS_AS_READ + idreminders ;
		$http.jsonp(url).
	    then(function successCallback(data, status, headers, config){
	    	console.log(data.data.message);      	
	        },function errorCallback(data, status, headers, config) {
	            console.log(data);
	    });
	};
	
	
	$scope.init();
	
});