var Globals = angular.module("Globals",[]);
Globals.factory("Global",function(){
	obj = {
			//GOOGLE_API_KEY: "AIzaSyC-2Ts3mtKhDp95y4E62xcmF5x1fLNtNyM",
			/*MSG_ERRORS : {
			  LOCATION_NOT_AVAILABLE : 'No fue posible localizarte, Intenta nuevamente.'
			},*/
			
			//APP_PLACE_ID : "ChIJOwrrwJKJzYURV6jFn775_sI",
            /**
            * URLS IMPORTANTES
            **/
			//getClientsWithProjectsAndRemindersForUser
            URL_CLIENTS_PROJECTS_AND_REMINDERS : 'http://getsir.mx/payme/ClientPaymeWebService.php?methodName=getClientsWithProjectsAndRemindersForUser&callback=JSON_CALLBACK&userid=',
            URL_LOGIN : 'http://getsir.mx/payme/PaymeWebService.php?methodName=getUser&callback=JSON_CALLBACK',//&email=osjobu@gmail.com&password=12345',
            URL_REQUEST_CHANGE_PASSWORD : 'http://getsir.mx/payme/PaymeWebService.php?methodName=requestChangePassword&callback=JSON_CALLBACK&email=',//osjobu@gmail.com'
            URL_CREATE_ACCOUNT : 'http://getsir.mx/payme/PaymeWebService.php?methodName=saveUser&callback=JSON_CALLBACK',//&email=osjobu@gmail.com&name=Oscar&lastname=Busio&password=12345'
            URL_CREATE_CLIENT_PROJECT_REMINDER : 'http://getsir.mx/payme/ClientPaymeWebService.php?methodName=saveClient&callback=JSON_CALLBACK', //&userid=50&email=ogascon@iasanet.com.mx&name=Oscar&lastname=Gascon&company=CASA&description=cargo&cost=739&dateReminder=2016-03-30 11:10:07&sendnow=false&idTemplates=1            
            //LOCAL STORAGE
            OBJECT_USER_INFO : "USER_INFO",
	};
	return obj;
});