StarterModule.controller('ClientProjectCtrl', function($state,$scope,$ionicHistory ,$stateParams,$ionicLoading,Global,$localstorage,$rootScope,$http,$timeout,$ionicModal,$cordovaSocialSharing) {
	$scope.init = function(){
		console.log("ClientProjectCtrl");
		$scope.resetData();
	};
	
	$scope.shareAnywhere = function() {
        $cordovaSocialSharing.share(Global.TEXT_SHARE_PAYME, Global.TITLE_SHARE_PAYME, "www/imagefile.png", Global.URL_SHARE_PAYME + $scope.currentReminderSelected.response_code);
    }
	
	$scope.resetData = function(){
		$scope.model = {};
		
		$scope.resetRemindersModal1();
	};
	
	/*Clases para ocultar secciones en los modals*/
	$scope.resetRemindersModal1 = function(){
		$scope.reminderModal1Default = "show";
		$scope.reminderModal1Success = "hide";
	}
	
	$scope.$on('updateClientSelected', function(event, clientAndProject) {
		$scope.model = clientAndProject;
		$scope.totalpayments = 0;
		
		for(i=0; i < $scope.model.project.payments.length; i++ ){
			$scope.totalpayments += parseFloat($scope.model.project.payments[i].payment);
		}
		
		for(i=0; i < $scope.model.project.reminders.length; i++ ){
			if($scope.model.project.reminders[i].send == 0){
				$scope.model.customtext = $scope.model.project.reminders[i].customtext;
			}
		}
		
	});
	
	$scope.archivingProject = function(archive){
		var url = Global.URL_SET_PROJECT_AS_ARCHIVED + $scope.model.project.idprojects +'&idclient=' +$scope.model.idclients + '&deleted=' + archive ;
		$http.jsonp(url).
        then(function successCallback(data, status, headers, config){
        	$scope.validResponsaDataFromServer(data);        	
            },function errorCallback(data, status, headers, config) {
                console.log(data);
        });
	};
	
	$scope.editProject = function(){
		$state.go('createReminder');
		$timeout(function() {
			 $rootScope.$broadcast('updateClientProjectInfo',$scope.model);
		 }, 200);
	};
	
	$scope.paidup = function(){
		var paid = $scope.model.project.paidup == '0' ? 1 : 0;
		var url = Global.URL_SET_PROJECT_AS_PAIDUP + $scope.model.project.idprojects +'&idclient=' +$scope.model.idclients + '&paid=' +paid ;
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
			console.log(response.data.message);
			 //$ionicHistory.goBack();
			 //Version 2
				$scope.reminderModal1Default = "hide";
				$scope.reminderModal1Success = "show"
		}else{
			console.log(response.data.message);
		}
	};
	
	/**
	 * Accion que se invoca desde el boton de regresar al inicio de reminders-modal1.html
	 */
	$scope.goToClientsProjects = function(modalIndex){
		$timeout(function() {
			 $rootScope.$broadcast('doRefresh');
		 }, 1000);
		$scope.closeModal(modalIndex);
		$state.go('clientsProjects');
	};
	
	
	$scope.preparePaymentModal = function(payment,paymentAction){
		$scope.openModal(7);
		$scope.paymentAction = paymentAction;
		if(payment){
			payment.payment = parseFloat(payment.payment);
			$scope.model.currentPaymentSelected = payment.payment ;
			$scope.model.currentPayment = payment;
		}else{
			$scope.model.currentPaymentSelected = 0;
		}
		
		
		if(paymentAction == 1){
			$scope.btnAction = 'Agregar pago';
		}else if(paymentAction == 2){
			$scope.btnAction = 'Actualizar pago';
		}
	};	
	
	$scope.processPayment = function(paymentAction){
		if(paymentAction == 1){
			
			var url = Global.URL_SAVE_PAYMENT + '&projectId=' + $scope.model.project.idprojects +'&payment=' + $scope.model.currentPaymentSelected ;
			$http.jsonp(url).
	        then(function successCallback(data, status, headers, config){
	        	$scope.validResponsaDataFromServer(data);        	
	            },function errorCallback(data, status, headers, config) {
	                console.log(data);
	        });
			
		}else if(paymentAction == 2){
				
			var url = Global.URL_UPDATE_PAYMENT + '&payment=' + $scope.model.currentPaymentSelected + '&idpayment=' + $scope.model.currentPayment.idpayment;
			$http.jsonp(url).
	        then(function successCallback(data, status, headers, config){
	        	$scope.validResponsaDataFromServer(data);
	            },function errorCallback(data, status, headers, config) {
	                console.log(data);
	        });
			
		}else if(paymentAction == 3){
			
			var url = Global.URL_DELETE_PAYMENT + '&projectId=' + $scope.model.project.idprojects +'&idpayment=' + $scope.model.currentPayment.idpayment ;
			$http.jsonp(url).
	        then(function successCallback(data, status, headers, config){
	        	$scope.validResponsaDataFromServer(data);        	
	            },function errorCallback(data, status, headers, config) {
	                console.log(data);
	        });
		}
	};
	

	
/****** Version 2 ****/
	$scope.reminderSelected =  function(reminder){
		$scope.currentReminderSelected = reminder; 
		$scope.openModal(6);
		console.log(reminder);
	};
	
	
	/*Iniciarlizar los modals*/
	$scope.onIncludeLoad = function() {
	    console.log("onIncludeLoad"); 
	 // Modal 4
	    $ionicModal.fromTemplateUrl('templates/modals/paid-modal4.html', {
	      id: '4', // We need to use and ID to identify the modal that is firing the event!
	      scope: $scope,
	      backdropClickToClose: false,
	      animation: 'slide-in-up'
	    }).then(function(modal) {
	      $scope.oModal4 = modal;
	    });
	    
	 // Modal 5
	    $ionicModal.fromTemplateUrl('templates/modals/archive-modal5.html', {
	    id: '5',
	      scope: $scope,
	      backdropClickToClose: false,
	      animation: 'slide-in-up'
	    }).then(function(modal) {
	      $scope.oModal5 = modal;
	    });
	    
	 // Modal 6
	    $ionicModal.fromTemplateUrl('templates/modals/reminder-modal6.html', {
	    id: '6', 
	      scope: $scope,
	      backdropClickToClose: false,
	      animation: 'slide-in-up'
	    }).then(function(modal) {
	      $scope.oModal6 = modal;
	    });
	    
	    // Modal 7
	    $ionicModal.fromTemplateUrl('templates/modals/payments-modal7.html', {
	    id: '7', 
	      scope: $scope,
	      backdropClickToClose: false,
	      animation: 'slide-in-up'
	    }).then(function(modal) {
	      $scope.oModal7 = modal;
	    });
	    
	  };
	
	
	$scope.openModal = function(index) {
		switch (index) {
		case 4:
			 $scope.oModal4.show();
			break;
		case 5:
			 $scope.oModal5.show();
			break;
		case 6:
			 $scope.oModal6.show();
			break;
		case 7:
			 $scope.oModal7.show();
			break;
		default:
			break;
		}
	};

    $scope.closeModal = function(index) {
    	switch (index) {
    	case 4:
			$scope.oModal4.hide();
			break;
		case 5:
			$scope.oModal5.hide();
			break;
		case 6:
			$scope.oModal6.hide();
			break;
		case 7:
			$scope.oModal7.hide();
			break;
		default:
			break;
		}
    };

	    /* Listen for broadcasted messages */

	    $scope.$on('modal.shown', function(event, modal) {
	      console.log('Modal ' + modal.id + ' is shown!');
	    });

	    $scope.$on('modal.hidden', function(event, modal) {
	      console.log('Modal ' + modal.id + ' is hidden!');
	    });

	    // Cleanup the modals when we're done with them (i.e: state change)
	    // Angular will broadcast a $destroy event just before tearing down a scope 
	    // and removing the scope from its parent.
	    $scope.$on('$destroy', function() {
	      console.log('Destroying modals...');
	      $scope.oModal4.remove();
	      $scope.oModal5.remove();
	      $scope.oModal6.remove();
	      $scope.oModal7.remove();
	    });
	
	$scope.init();
	$scope.onIncludeLoad ();
});
