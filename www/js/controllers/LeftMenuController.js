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
		$scope.model.remindersSent = [];	
		$scope.model.remindersAnswered = [];
		$scope.model.totalNotifications = 0;
	};
	
	/**
	 * Este evento espera el llamado desde ClientsProjectsCtrl para consultar al server y llenar el menu izquierdo
	 * */
	$scope.$on('lefMenugetRemindersSent', function(event, iduser) {
		$scope.resetData();
		$scope.getRemindersSent(iduser);
	});
 	
	
	$scope.getRemindersSent = function (iduser){
		var url = Global.URL_GET_REMINDERS_SENT_AND_ANSWERED+iduser;
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
	$scope.prepareRemindersSent = function(remindersSentAndAnswered){
		$scope.model.allNotificacions = remindersSentAndAnswered;
		if($scope.model.allNotificacions){
		
			angular.forEach($scope.model.allNotificacions.remindersSent, function(value, key) {
				$scope.model.remindersSent.push(value);
			});
			
			angular.forEach($scope.model.allNotificacions.remindersAnswered, function(value, key) {
				$scope.model.remindersAnswered.push(value);
			});
		}
		$scope.refreshTotalNotifications();
	 };
	 
	 
	 /**
	  * Calcula e invoca al evenvento que actualiza las notificaciones en BarController
	  */
	 $scope.refreshTotalNotifications = function(){
		 $scope.model.totalNotifications = $scope.model.remindersSent.length + $scope.model.remindersAnswered.length;
		 $rootScope.$broadcast('updateNotifications', $scope.model.totalNotifications);
	 };
	 
	 
	/**
	 * Marca como leido una notificación
	 */
	$scope.checkReminder = function(index,reminderSent){
		$scope.model.remindersSent.splice(index, 1);
		$scope.refreshTotalNotifications();
		$scope.setRemindersAsRead(reminderSent.idreminders);
	};
	
	$scope.checkReminderAnswered = function(index,reminderAnswered){
		$scope.model.remindersAnswered.splice(index, 1);
		$scope.refreshTotalNotifications();
		$scope.setRemindersAnsweredAsRead(reminderAnswered.idreminders);
	};
	
	/**
	 * MArca como leidas todas las notificaciones
	 */
	$scope.clearNotifications = function(){
		var idreminders = [];
		angular.forEach($scope.model.remindersSent , function(reminder, key) {
			idreminders.push(reminder.idreminders);
		});
		
		angular.forEach($scope.model.remindersAnswered , function(reminder, key) {
			idreminders.push(reminder.idreminders);
		});
		
		$scope.model.remindersSent = [];
		$scope.model.remindersAnswered = [];

		$scope.refreshTotalNotifications();
		$scope.setRemindersAsRead(idreminders.join());
		$scope.setRemindersAnsweredAsRead(idreminders.join());
	};
	
	$scope.setRemindersAsRead = function(idreminders){
		var url = Global.URL_SET_REMINDERS_AS_READ + idreminders ;
		$http.jsonp(url).
	    then(function successCallback(data, status, headers, config){
	    	console.log(data.data.message);      	
	        },function errorCallback(data, status, headers, config) {
	            console.log(data);
	    });
	};
	
	$scope.setRemindersAnsweredAsRead = function(idreminders){
		var url = Global.URL_SET_REMINDERS_ANSWERED_AS_READ + idreminders ;
		$http.jsonp(url).
	    then(function successCallback(data, status, headers, config){
	    	console.log(data.data.message);      	
	        },function errorCallback(data, status, headers, config) {
	            console.log(data);
	    });
	};
	
	
	$scope.init();
	
});