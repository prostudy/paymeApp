angular.module('payme.services', [])

.factory('FormatFieldService', function($http,Global) {

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
	
  }
});