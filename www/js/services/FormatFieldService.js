angular.module('payme.services', [])

.factory('FormatFieldService', function($http,Global,$localstorage) {

  return {
	emptyField:function(field){
		if(field){
			if(field.trim().length > 0){
				return false;
			}else{
				return true;
			}
		}else{
			return true;
		}
	},  
	
	readUserInfoFromLocal : function(){
		if($localstorage.getObject(Global.OBJECT_USER_INFO)){
			return $localstorage.getObject(Global.OBJECT_USER_INFO);
		}else{
			return false;
		}
	},
	
	invalidEmail:function(email){
		var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	    return !re.test(email);
	},
	
	/**
	 * VAlidacion para el formulario de login
	 * */
	validLoginFields:function(email,password){
		if(email && password){
			if(this.emptyField(email) && this.emptyField(password)){
				console.log("Los campos estan vacios");
				return false;
			}else if(this.invalidEmail(email)){
				console.log("Error en el formato del correo");
				return false;
			}else{
				return true;
			}
		}else{
			return false;
		}
	},
	
	/**
	 * Validacion para el formulario de crear cuenta
	 * */
	validCreateAccountFields:function(name,lastname,email,password){
		if(name && lastname && email && password){
			if(this.emptyField(name) && this.emptyField(lastname) && this.emptyField(email) && this.emptyField(password)){
				console.log("Los campos estan vacios");
				return false;
			}else if(this.invalidEmail(email)){
				console.log("Error en el formato del correo");
				return false;
			}else{
				return true;
			}
		}else{
			return false;
		}
	},
	
	
	/**
	 * Validacion para el formulario de actualizar un usuario
	 * */
	validUpdateAccountFields:function(name,lastname,email){
		if(name && lastname && email){
			if(this.emptyField(name) && this.emptyField(lastname) && this.emptyField(email)){
				console.log("Los campos estan vacios");
				return false;
			}else if(this.invalidEmail(email)){
				console.log("Error en el formato del correo");
				return false;
			}else{
				return true;
			}
		}else{
			return false;
		}
	},
	
	
	validFields:function(email,name,lastname,company,description,cost,reminders,dateMin,mode){
		if(mode == Global.CRETE_NEW_REMINDER){
			return this.validReminderFields(email,name,lastname,company,description,cost,reminders,dateMin);
		}
		
		if(mode == Global.UPDATE_REMINDER){
			return this.validReminderFieldsForUpdate(email,name,lastname,company,description,cost,reminders,dateMin);
		}
		return true;
	},
	

	/**
	 * Validación para el formulario de crear recordatorio
	 * */
	validReminderFields:function(email,name,lastname,company,description,cost,reminders,dateMin){
		if(name && lastname && email && description && cost && reminders){
			if(  this.emptyField(name) && this.emptyField(lastname) && this.emptyField(email) && this.emptyField(description) &&  this.emptyField(cost)){
				console.log("Los campos estan vacios");
				return false;
			}else if(this.invalidEmail(email)){
				console.log("Error en el formato del correo");
				return false;
			}else if(this.validReminders(reminders,dateMin)){
				return false;
			}else{
				return true;
			}
		}else{
			return false;
		}
	},
	
	validReminders:function(reminders,dateMin){
		var remindersValid = true;
		for(i=0;i< reminders.length; i++) {				
			if( reminders[i].day == undefined || dateMin > reminders[i].day ){
				return true;
			}else{
				remindersValid = false;
			}
		}
		return remindersValid;
	},
	
	
	
	validReminderFieldsForUpdate:function(email,name,lastname,company,description,cost,reminders,dateMin){
		if(name && lastname && email && description && cost && reminders){
			if(  this.emptyField(name) && this.emptyField(lastname) && this.emptyField(email) && this.emptyField(description) &&  this.emptyField(cost)){
				console.log("Los campos estan vacios");
				return false;
			}else if(this.invalidEmail(email)){
				console.log("Error en el formato del correo");
				return false;
			}else if(this.validRemindersUpdate(reminders,dateMin)){
				return false;
			}else{
				return true;
			}
		}else{
			return false;
		}
	},
	
	
	validRemindersUpdate:function(reminders,dateMin){
		var remindersValid = true;
		for(i=0;i< reminders.length; i++) {				
			if( (reminders[i].action.localeCompare("create") == 0 || reminders[i].action.localeCompare("update") == 0)){
				if(reminders[i].day == undefined || dateMin > reminders[i].day){
					return true;	
				}else{
					return false;
				} 
			}else{
				remindersValid = false;
			}
		}
		return remindersValid;
	},
	
	/*validReminders:function(reminders){
		var remindersValid = 0;
		for(i=0;i< reminders.length; i++) {				
			if( reminders[i].invalidDate ){
				return true;
			}else{
				remindersValid++;
			}
		}
		return remindersValid;
	},*/
	
	
	validReminderFieldsForSendNow:function(email,name,lastname,company,description,cost){
		if(name && lastname && email && description && cost){
			if(this.emptyField(name) && this.emptyField(lastname) && this.emptyField(email) && this.emptyField(description) &&  this.emptyField(cost) ){
				console.log("Los campos estan vacios");
				return false;
			}else if(this.invalidEmail(email)){
				console.log("Error en el formato del correo");
				return false;
			}else{
				return true;
			}
		}else{
			return false;
		}
	},
	
  }
})


.factory('ConnectivityMonitor', function($rootScope, $cordovaNetwork,$q){
	/*var asyncGetConnection = function () {
	    var q = $q.defer();

	    	 if(ionic.Platform.isWebView()){
	    		 q.resolve('listos para coenctar');
		          $rootScope.$on('$cordovaNetwork:online', function(event, networkState){
		            console.log("went online");
		            q.resolve('listos para coenctar');
		          });
		 
		          $rootScope.$on('$cordovaNetwork:offline', function(event, networkState){
		            console.log("went offline");
		            q.reject('navigator.connection is not defined');
		          });
		 
		        }
		        else {
		        	q.resolve('listos para coenctar');
		          window.addEventListener("online", function(e) {
		            console.log("went online");
		            q.resolve('listos para coenctar');
		          }, false);    
		 
		          window.addEventListener("offline", function(e) {
		            console.log("went offline");
		            q.reject('navigator.connection is not defined');
		          }, false);  
		        }
	    
	    return q.promise;
	  };

	  return {
		  isOnline: function(){
		      if(ionic.Platform.isWebView()){
		        return $cordovaNetwork.isOnline();    
		      } else {
		        return navigator.onLine;
		      }
		    },
		    
		    startWatching: function () {
		      return asyncGetConnection().then(function(networkConnection) {
		    	  console.log("Listo para verificar");
		    	  return networkConnection;
		      });
		    }
		  };*/

	  return {
	    isOnline: function(){
	      if(ionic.Platform.isWebView()){
	        return $cordovaNetwork.isOnline();    
	      } else {
	        return navigator.onLine;
	      }
	    },
	    isOffline: function(){
	      if(ionic.Platform.isWebView()){
	        return !$cordovaNetwork.isOnline();    
	      } else {
	        return !navigator.onLine;
	      }
	    },
	    startWatching: function(){
	        if(ionic.Platform.isWebView()){
	 
	          $rootScope.$on('$cordovaNetwork:online', function(event, networkState){
	            console.log("went online");
	          });
	 
	          $rootScope.$on('$cordovaNetwork:offline', function(event, networkState){
	            console.log("went offline");
	          });
	 
	        }
	        else {
	 
	          window.addEventListener("online", function(e) {
	            console.log("went online");
	          }, false);    
	 
	          window.addEventListener("offline", function(e) {
	            console.log("went offline");
	          }, false);  
	        }       
	    }
	  }
	});