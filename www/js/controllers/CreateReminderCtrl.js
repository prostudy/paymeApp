StarterModule.controller('CreateReminderCtrl', function($state,$scope, $stateParams,$http,$ionicLoading,Global,$localstorage, $ionicModal,FormatFieldService,$filter) {
	$scope.init = function(){
		console.log("CreateReminderCtrl");
		$scope.resetData();
		$scope.readUserInfoFromLocal();
	};
	
	$scope.resetData = function(){
		$scope.model = {};
		$scope.params = {};
		$scope.model.dateMin = new Date();
		//$scope.model.dreminder = $scope.model.dateMin;
		$scope.model.createDisabled = true;
		$scope.model.sendNowDisabled = true;
	};
	
	
	/**
	 * Realiza la lectura del localstorage
	 * */
	$scope.readUserInfoFromLocal = function(){
		if($localstorage.getObject(Global.OBJECT_USER_INFO)){
			$scope.model.userInfo = $localstorage.getObject(Global.OBJECT_USER_INFO)
		}else{
			$state.go("login");
		}
	};
	
	/**
	 * Se validan los campos cada vez que hay un cambio para activar el boton de crear y de enviar
	 * */
	$scope.changeField = function(){
		$scope.model.dateMin = new Date();
		$scope.model.createDisabled = !FormatFieldService.validReminderFields($scope.model.email,$scope.model.name,$scope.model.lastname,$scope.model.company,$scope.model.description,$scope.model.cost,$scope.model.dreminder);
		$scope.model.sendNowDisabled = !FormatFieldService.validReminderFieldsForSendNow($scope.model.email,$scope.model.name,$scope.model.lastname,$scope.model.company,$scope.model.description,$scope.model.cost);
		
		$scope.prepareDataToServer();
		//console.log($scope.params.paramsClient+$scope.params.paramsProject+$scope.params.paramsReminder);
	};
	
	
	/**
	 * Prepara la url para crear recordatorio
	 * */
	$scope.prepareDataToServer = function(sendReminderNow){
		//Datos para la tabla de clientes:
		var darereminder = $filter('date')($scope.model.dreminder, "yyyy-MM-ddTHH:mm");
		$scope.params.paramsClient = "&userid="+$scope.model.userInfo.idusers+"&email="+$scope.model.email+"&name="+$scope.model.name+"&lastname="+$scope.model.lastname+"&company="+$scope.model.company;
		$scope.params.paramsProject = "&description="+$scope.model.description+"&cost="+$scope.model.cost;
		$scope.params.paramsReminder = "&dateReminder="+ darereminder +"&sendnow="+sendReminderNow+"&idTemplates=1";
		//$scope.params.paramsReminder = "&dateReminder=2016-04-27 16:40:00&sendnow="+sendReminderNow+"&idTemplates=1";
		
	};
	
	
	/**
	 * Envia los parametros necesarios al servidor para crear el recordatorio o enviarlo en caso de send sea true
	 * */
	$scope.createOrSendReminder = function(sendReminderNow){
		//TODO:VAlidar fecha con el servidor
		$scope.prepareDataToServer(sendReminderNow);
		console.log($scope.params.paramsClient+$scope.params.paramsProject+$scope.params.paramsReminder);
		
		$ionicLoading.show({});
		var url = Global.URL_CREATE_CLIENT_PROJECT_REMINDER + $scope.params.paramsClient + $scope.params.paramsProject + $scope.params.paramsReminder;
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
	 * Valida la respuesta del webservice
	 * */
	$scope.validResponsaDataFromServer = function(response){
		if(response.data.success){
			$scope.openModal();
		}else{
			//$scope.showAlert(response.data.message);
			console.log(response.data.message);
		}
	};
	
	/*Es invocado desde ClientProjectCtrl enviado el proyecto que se va editar*/
	$scope.$on('updateClientProjectInfo', function(event, clientProjectInfo) {
		$scope.init();
		$scope.model.email = clientProjectInfo.email;
		$scope.model.name = clientProjectInfo.name;
		$scope.model.lastname = clientProjectInfo.lastname
		$scope.model.company = clientProjectInfo.company;
		
		$scope.model.description = clientProjectInfo.project.description;
		$scope.model.cost = parseFloat(clientProjectInfo.project.cost);
		$scope.model.dreminders = clientProjectInfo.project.reminders;
		
		//Prepara el formato de las fechas para angular
		for(i=0;i< $scope.model.dreminders.length; i++) {
			$scope.model.dreminders[i].dateAux = new Date($scope.model.dreminders[i].date);
			
			if($scope.model.dateMin < $scope.model.dreminders[i].dateAux){
				$scope.model.dreminders[i].invalidDate = false;
				
			}else{
				$scope.model.dreminders[i].invalidDate = true;
			}
		}
				
		$scope.changeField();
		$scope.model.update = true;

	});
	
	
	$scope.updateProject = function(){
		console.log("Update");
		$scope.prepareDataToServer(false);
		console.log($scope.params.paramsClient+$scope.params.paramsProject+$scope.params.paramsReminder);
	
	};
	
	

	
		
	$scope.init();
	
	
	$ionicModal.fromTemplateUrl('templates/reminderSent.html', {
		scope: $scope,
		animation: 'slide-in-up'
		}).then(function(modal) {
		$scope.modal = modal;
	});
	$scope.openModal = function() {
		$scope.modal.show();
	};
	$scope.closeModal = function() {
		$scope.modal.hide();
	};
	// Cleanup the modal when we're done with it!
	$scope.$on('$destroy', function() {
		$scope.modal.remove();
	});
	// Execute action on hide modal
	$scope.$on('modal.hidden', function() {
	// Execute action
	});
	// Execute action on remove modal
	$scope.$on('modal.removed', function() {
	// Execute action
	});

	
	
	
});
