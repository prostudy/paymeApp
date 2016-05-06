StarterModule.controller('CreateReminderCtrl', function($state,$scope, $stateParams,$http,$ionicLoading,Global,$localstorage, $ionicModal,FormatFieldService,$filter,$sce) {
	$scope.init = function(){
		console.log("CreateReminderCtrl");
		$scope.resetData(Global.CRETE_NEW_REMINDER);		
	};
	
	$scope.resetData = function(actionMode){
		$scope.model = {};
		$scope.params = {};
		$scope.model.reminders = [];
		$scope.model.paramMode = actionMode;
		$scope.model.maxReminders = 3; //Numero maximo de recordatorios
		//$scope.model.totalReminders = 30;
		$scope.model.btnCreateDisabled = true;
		$scope.btnUpdateDisable = true;
		$scope.model.btnSendNowDisabled = true;
		$scope.readUserInfoFromLocal();
		console.log("Action Mode:"+$scope.model.paramMode);
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
		var dateMin = new Date();
		
		if($scope.model.paramMode ==  Global.CRETE_NEW_REMINDER){
			$scope.model.btnCreateDisabled = !FormatFieldService.validFields($scope.model.email,$scope.model.name,$scope.model.lastname,$scope.model.company,$scope.model.description,$scope.model.cost,$scope.model.reminders,dateMin,$scope.model.paramMode);
		}
		
		if($scope.model.paramMode ==  Global.UPDATE_REMINDER){
			$scope.model.btnUpdateDisable =  !FormatFieldService.validFields($scope.model.email,$scope.model.name,$scope.model.lastname,$scope.model.company,$scope.model.description,$scope.model.cost,$scope.model.reminders,dateMin,$scope.model.paramMode);
		}
		
		$scope.model.btnSendNowDisabled =  !FormatFieldService.validReminderFieldsForSendNow($scope.model.email,$scope.model.name,$scope.model.lastname,$scope.model.company,$scope.model.description,$scope.model.cost);
		if($scope.model.maxReminders < 3){
			$scope.model.btnSendNowDisabled = true; 
		}
		
		$scope.prepareDataToServer();
	};
	
	
	/**
	 * Prepara la url para crear recordatorio
	 * */
	$scope.prepareDataToServer = function(sendReminderNow){				
		if($scope.model.paramMode ==  Global.CRETE_NEW_REMINDER){
			$scope.prepareDaysForDataBase();
		}
		
		//Solo para el caso de actualizar
		if($scope.model.paramMode ==  Global.UPDATE_REMINDER){
			$scope.prepareUpdateDaysForDataBase();
		}

		if(sendReminderNow){//Si debe enviar ahora se obtiene la fecha actual y se manda
			var day =  $filter('date')(new Date(),"yyyy-MM-ddTHH:mm");
			$scope.params.paramsReminder = "&dateReminders="+ day;
		}else{//Se mandan las fechas separadas por coma
			$scope.params.paramsReminder = "&dateReminders="+ $scope.remindersAux.join();
		}

		$scope.params.paramsClient = "&userid="+$scope.model.userInfo.idusers+"&email="+$scope.model.email+"&name="+$scope.model.name+"&lastname="+$scope.model.lastname+"&company="+$scope.model.company;
		$scope.params.paramsProject = "&description="+$scope.model.description+"&cost="+$scope.model.cost + "&idprojects="+$scope.model.idproject;
		$scope.params.paramsReminder +=  "&sendnow="+sendReminderNow;
		$scope.params.paramMode = "&mode=" + $scope.model.paramMode;
	};
	
	/**
	 * Se prepara el formato de las fechas cuando es un recordatorio nuevo  MODE: 1
	 * 	La fecha se toma del control y se transforma para enviarla al servidor en el formato correcto.
	 * */
	$scope.prepareDaysForDataBase = function(){
		$scope.remindersAux = [];
		for(i=0; i < $scope.model.reminders.length; i++ ){
			$scope.remindersAux.push( $filter('date')($scope.model.reminders[i].day, "yyyy-MM-ddTHH:mm") );
		}
	};
	
	
	/**	Se prepara el formato de las fechas cuando es un recordatorio es de actualizacion MODE: 2
	 *	Solo se agregan las fechas que sean validas
	 **/
	$scope.prepareUpdateDaysForDataBase = function(){
		$scope.remindersAux = [];
		for(i=0; i < $scope.model.reminders.length; i++ ){
			if($scope.model.reminders[i].day != undefined && $scope.model.reminders[i].action.length >0){
				$scope.remindersAux.push($scope.model.reminders[i].action + "|" + $scope.model.reminders[i].idreminders +"|"+ $filter('date')($scope.model.reminders[i].day, "yyyy-MM-ddTHH:mm") );
			}
		}
	};

	
	/**
	 * Envia los parametros necesarios al servidor para crear el recordatorio o enviarlo en caso de send sea true
	 * */
	$scope.createOrSendReminder = function(sendReminderNow){
		//TODO:VAlidar fecha con el servidor
		$scope.prepareDataToServer(sendReminderNow);
		//console.log($scope.params.paramsClient+$scope.params.paramsProject+$scope.params.paramsReminder+$scope.params.paramMode);
		$ionicLoading.show({});
		var url = Global.URL_CREATE_CLIENT_PROJECT_REMINDER + $scope.params.paramsClient + $scope.params.paramsProject + $scope.params.paramsReminder + $scope.params.paramMode;
		console.log(url);
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
			console.log(response.data.message);
			$scope.openModal();
		}else{
			//$scope.showAlert(response.data.message);
			console.log(response.data.message);
		}
	};
	
	
	/*$scope.setTemplate = function(templateId){
		$scope.model.template = templateId;
		if($scope.model.template == 1){
			$scope.activeTemplate1 = 'active'
			$scope.activeTemplate2 = ''
			$scope.activeTemplate3 = ''
		}else if($scope.model.template == 2){
			$scope.activeTemplate1 = ''
			$scope.activeTemplate2 = 'active'
			$scope.activeTemplate3 = ''
		}else{
			$scope.activeTemplate1 = ''
			$scope.activeTemplate2 = ''
			$scope.activeTemplate3 = 'active'
		}
		console.log("Change tamplate:"+$scope.model.template);
	};*/
	
	
	
	/**
	 * Accion que se ejecuta al presionar el boton de add more dates
	 */
	$scope.btnAddDate = function(){
		switch ($scope.model.paramMode) {
		case Global.CRETE_NEW_REMINDER:
			$scope.addFieldDateForNewReminder();
			break;
		
		case Global.UPDATE_REMINDER:
			$scope.addFieldDateForUpdateReminder();
			break;
			
		default:
			break;
		}
	};
	
	
	
	
	/**
	 * Implementa la logica de agregar campos de fechas cuando se crea un nuevo recordatorio
	 */
	$scope.addFieldDateForNewReminder = function(){
		if ($scope.model.maxReminders > 0 ){
			if($scope.model.reminders.length > 0){//Si ya hay recordatorios agregados se toma el ultimo y se suma un dia
				var minNextDay = $scope.getNextDayValid($scope.model.reminders);
				$scope.model.reminders.push({'day':minNextDay, 'disableDay':false, 'action':'','minDay':minNextDay});
			}else{//Se toma la fecha del dia y se asigna al nuevo campo de fechas
				var dateMin = new Date();
				$scope.model.reminders.push( {'day' : dateMin, 'disableDay':false,'action':'', 'minDay': dateMin} );
			}
			$scope.model.maxReminders--;
			$scope.changeField();
		}
		
	};
	
	
	/**
	 * Suma un dia ala fecha pasada como parametro, regresa la fecha nueva
	 */
	$scope.getNextDayValid = function(reminders){
		var lastReminderIndex = $scope.model.reminders.length -1;//Se recupera el ultimo indice de los recordatorios
		var minNextDay = new Date($scope.model.reminders[lastReminderIndex].day);
		minNextDay.setDate( minNextDay.getDate() + 1); //se suma un dia a la fecha*/
		return minNextDay;	
	};
	

	
	/**
	 * Implementa la logica de agregar campos de fechas cuando se esta en modo edicion
	 */
	$scope.addFieldDateForUpdateReminder = function(){
		if ($scope.model.maxReminders > 0){
			$scope.model.maxReminders--;
			var minNextDay = new Date();
			$scope.model.reminders.push({'idreminders':0, 'day':new Date(), 'disableDay':false, 'action':'create', 'minDay': minNextDay});
			$scope.changeField();
		}
	};
	
	
	/**
	 * Accion que se ejecuta al presionar el boton de delete de un campo de fecha
	 */
	$scope.btnRemoveDate = function(reminder){
		var index = $scope.model.reminders.indexOf(reminder);
		
		switch ($scope.model.paramMode) {
		case Global.CRETE_NEW_REMINDER:
			$scope.removeFieldDateForNewReminder(index,reminder);
			break;
		
		case Global.UPDATE_REMINDER:
			$scope.removeFieldDateForUpdateReminder(index,reminder);
			break;
			
		default:
			break;
		}
		$scope.model.maxReminders++;
		$scope.changeField();
	};
	
	
	/**
	 * Implementa la logica de eliminar campos de fechas cuando se esta en modo edicion
	 */
	$scope.removeFieldDateForNewReminder = function(index,reminder){
		$scope.model.reminders.splice(index,1)
	};
	
	/**
	 * Implementa la logica de eliminar campos de fechas cuando se crea un nuevo recordatorio
	 */
	$scope.removeFieldDateForUpdateReminder = function(index, reminder){
		if(reminder.action.localeCompare("create") == 0  ){//Si el recordatorio fue agregado al modelo se elimina directamente y no pasa nada
			$scope.model.reminders.splice(index,1);
		}else if(reminder.action.localeCompare("update") == 0  ){
				$scope.model.reminders[index].action = 'delete';
		}	
	};
	
	
	/*$scope.removeDay = function(reminder){
		var index = $scope.model.reminders.indexOf(reminder);
		if($scope.model.paramMode ==  Global.CRETE_NEW_REMINDER){//Cuando es un nuevo recordatorio se borra del modelo
			if(index!=0){
				$scope.model.maxReminders++;
				$scope.model.reminders.splice(index,1) 
			}
		}else if($scope.model.paramMode ==  Global.UPDATE_REMINDER){
			if(index!=0 ){//&& reminder.day != undefined ){
				$scope.model.maxReminders++;
				console.log("eliminar:");
				console.log(reminder);
				if(reminder.action.localeCompare("create") == 0  ){//Si el recordatorio fue agregado al modelo se elimina directamente y no pasa nada
					$scope.model.reminders.splice(index,1);
				}else if(reminder.action.localeCompare("update") == 0  ){
					$scope.model.reminders[i].action = 'delete';
				}	
			} 
		}
	};*/
	
	
	
	
//-------SECCION PARA MANEJAR CUANDO UN RECORDATORIO TIENE QUE ACTUALIZARSE----------//	
	/**
	 * 
	 * Es invocado desde ClientProjectCtrl enviado el proyecto que se va editar
	 * 
	 * 
	 * */
	$scope.$on('updateClientProjectInfo', function(event, clientProjectInfo) {
		$scope.resetData(Global.UPDATE_REMINDER);
		$scope.model.paramMode = Global.UPDATE_REMINDER;//Es una actualizacion 
		$scope.model.email = clientProjectInfo.email;
		$scope.model.name = clientProjectInfo.name;
		$scope.model.lastname = clientProjectInfo.lastname
		$scope.model.company = clientProjectInfo.company;
		
		$scope.model.description = clientProjectInfo.project.description;
		$scope.model.cost = parseFloat(clientProjectInfo.project.cost);
		$scope.model.idproject = clientProjectInfo.project.idprojects;
		
		$scope.model.reminders = clientProjectInfo.project.reminders;
	
		
		//Prepara el formato de las fechas para angular
		$scope.prepareRemindersFromServerToApp();
				
		$scope.changeField();//TODO: Tener cuidado con esta validacion para activar el boton de update
	});
	
	/**
	 * //Prepara el formato de las fechas para la vista y para deshabilitar el control en caso de que la fecha sea pasada
	 */
	$scope.prepareRemindersFromServerToApp = function(){
		var dateMin = new Date();
		for(i=0;i< $scope.model.reminders.length; i++) {
			$scope.model.reminders[i].day = new Date($scope.model.reminders[i].date);
			
			if(dateMin > $scope.model.reminders[i].day){
				$scope.model.reminders[i].disableDay = true;
				$scope.model.reminders[i].action = '';
				$scope.model.reminders[i].minDay = $scope.model.reminders[i].day;
			}else{
				$scope.model.maxReminders--;
				$scope.model.reminders[i].disableDay = false;
				$scope.model.reminders[i].action = 'update';
				$scope.model.reminders[i].minDay = dateMin;
			}
		}
	};
	
	
	/*$scope.updateProject = function(){
		console.log("Update");
		$scope.prepareDataToServer(false);
		console.log($scope.params.paramsClient+$scope.params.paramsProject+$scope.params.paramsReminder+$scope.params.paramMode);
	};*/
	
	
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

	
	$scope.init();

	
});
