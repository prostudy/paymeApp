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
	};
	return obj;
});