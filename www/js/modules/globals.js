var Globals = angular.module("Globals",[]);
Globals.factory("Global",function(){
	obj = {
			//GOOGLE_API_KEY: "AIzaSyC-2Ts3mtKhDp95y4E62xcmF5x1fLNtNyM",
			/*MSG_ERRORS : {
			  LOCATION_NOT_AVAILABLE : 'No fue posible localizarte, Intenta nuevamente.'
			},*/
			
			//APP_PLACE_ID : "ChIJOwrrwJKJzYURV6jFn775_sI",
            /**
            * URLS IMPORTANTES: CAMBIAR LAS URLS POR LAS DEL SERVER Y LA DE FACEBOOK
            **/
			//getClientsWithProjectsAndRemindersForUser
            URL_CLIENTS_PROJECTS_AND_REMINDERS : 'http://getsir.mx/payme/ClientPaymeWebService.php?methodName=getClientsWithProjectsAndRemindersForUser&callback=JSON_CALLBACK&userid=',
            URL_LOGIN : 'http://getsir.mx/payme/PaymeWebService.php?methodName=getUser&callback=JSON_CALLBACK',//&email=osjobu@gmail.com&password=12345',
            URL_REQUEST_CHANGE_PASSWORD : 'http://getsir.mx/payme/PaymeWebService.php?methodName=requestChangePassword&callback=JSON_CALLBACK&email=',//osjobu@gmail.com'
            URL_CREATE_ACCOUNT : 'http://getsir.mx/payme/PaymeWebService.php?methodName=saveUser&callback=JSON_CALLBACK',//&email=osjobu@gmail.com&name=Oscar&lastname=Busio&password=12345'
            URL_CREATE_CLIENT_PROJECT_REMINDER : 'http://getsir.mx/payme/ClientPaymeWebService.php?methodName=saveClient&callback=JSON_CALLBACK', //&userid=50&email=ogascon@iasanet.com.mx&name=Oscar&lastname=Gascon&company=CASA&description=cargo&cost=739&dateReminder=2016-03-30 11:10:07&sendnow=false&idTemplates=1
            URL_CLIENTS_PROJECTS_AND_REMINDERS_DELETED : '', 
            URL_GET_REMINDERS_SENT_AND_ANSWERED : 'http://getsir.mx/payme/ClientPaymeWebService.php?methodName=getRemindersSentAndAnsweredByUserId&callback=JSON_CALLBACK&userid=',
            URL_SET_REMINDERS_AS_READ : 'http://getsir.mx/payme/ClientPaymeWebService.php?methodName=setReminderAsRead&callback=JSON_CALLBACK&idreminders=',
            URL_SET_REMINDERS_ANSWERED_AS_READ : 'http://getsir.mx/payme/ClientPaymeWebService.php?methodName=setReminderAnweredAsRead&callback=JSON_CALLBACK&idreminders=',
            URL_SET_PROJECT_AS_PAIDUP : 'http://getsir.mx/payme/ClientPaymeWebService.php?methodName=setProjectAsPaidup&callback=JSON_CALLBACK&idprojects=', //&idprojects=1 &idclient=1 &paid=1
            URL_SET_PROJECT_AS_ARCHIVED : 'http://getsir.mx/payme/ClientPaymeWebService.php?methodName=setProjectAsArchived&callback=JSON_CALLBACK&idprojects=', //&idprojects=1 &idclient=1 &deleted=1
            URL_UPDATE_USER : 'http://getsir.mx/payme/PaymeWebService.php?methodName=updateUserInfo&callback=JSON_CALLBACK', //&iduser=62&email=osjobu3@gmail.com&name=Mario&lastname=gonzales&password=123456&textAccount=mi texto de cuenta',
            ID_FACEBOOK_APP : '1522988117993830',
            //LOCAL STORAGE
            OBJECT_USER_INFO : "USER_INFO",
            OBJECT_CLIENT_LIST : "CLIENT_LIST",
            OBJECT_FIRST_TIME_APP: "OBJECT_FIRST_TIME_APP",
            
            CRETE_NEW_REMINDER : 1,
            UPDATE_REMINDER : 2,
            
	};
	return obj;
});