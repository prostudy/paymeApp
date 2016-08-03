StarterModule.controller('ClientProjectCtrl', function($state,$scope,$ionicHistory ,$stateParams,$ionicLoading,Global,$localstorage,$rootScope,$http,$timeout,$ionicModal) {
	$scope.init = function(){
		console.log("ClientProjectCtrl");
		$scope.resetData();
	};
	
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
	
	
	
	
/****** Version 2 ****/
	
	/*Iniciarlizar los modals*/
	$scope.onIncludeLoad = function() {
	    console.log("onIncludeLoad"); 
	    // Modal 5
	    $ionicModal.fromTemplateUrl('templates/modals/archive-modal5.html', {
	      id: '5', // We need to use and ID to identify the modal that is firing the event!
	      scope: $scope,
	      backdropClickToClose: false,
	      animation: 'slide-in-up'
	    }).then(function(modal) {
	      $scope.oModal5 = modal;
	    });
	    
	 // Modal 4
	    $ionicModal.fromTemplateUrl('templates/modals/paid-modal4.html', {
	      id: '4', // We need to use and ID to identify the modal that is firing the event!
	      scope: $scope,
	      backdropClickToClose: false,
	      animation: 'slide-in-up'
	    }).then(function(modal) {
	      $scope.oModal4 = modal;
	    });
	    
	  };
	
	
	$scope.openModal = function(index) {
		switch (index) {
		case 5:
			 $scope.oModal5.show();
			break;
		case 4:
			 $scope.oModal4.show();
			break;
		default:
			break;
		}
	};

    $scope.closeModal = function(index) {
    	switch (index) {
		case 5:
			$scope.oModal5.hide();
			break;
		case 4:
			$scope.oModal4.hide();
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
	    });
	
	$scope.init();
	$scope.onIncludeLoad ();
});
