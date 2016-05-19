angular.module('ModalsModule', [])

.factory('ModalService', function($ionicModal,$rootScope,$q) {
	  return {
		  initModal:function(tpl,id, scope){
			  $scope = scope || $rootScope.$new();
			  var q = $q.defer();
			  
			  $ionicModal.fromTemplateUrl(tpl, {
				  id: id,  
					scope: $scope,
					backdropClickToClose: false,
					 animation: 'slide-in-up'
				    }).then(function(modal) {
				      $scope.modal = modal;
				      q.resolve(modal);
				      return modal;
				    });
			  
			  $scope.openModal = function() {
				  $scope.modal.show();
			  };

			  $scope.closeModal = function(index) {
			    	$scope.modal.hide();
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
			      $scope.modal.remove();
			    });
			
			return q.promise;
		},  
	  }//End return
});