// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
var StarterModule = angular.module('StarterModule', ['ionic','ngCordova','tmh.dynamicLocale','pascalprecht.translate'])

StarterModule.run(function($ionicPlatform,$translate) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
    
    if(typeof navigator.globalization !== "undefined") {
        navigator.globalization.getPreferredLanguage(function(language) {
            $translate.use((language.value).split("-")[0]).then(function(data) {
                console.log("SUCCESS -> " + data);
            }, function(error) {
                console.log("ERROR -> " + error);
            });
        }, null);
    }
  });
})

StarterModule.config(function($stateProvider, $urlRouterProvider,  $translateProvider) {
	 /*$translateProvider.translations('en', {
         hello_message: "Howdy",
         goodbye_message: "Goodbye"
     });
     $translateProvider.translations('es', {
         hello_message: "Hola",
         goodbye_message: "Adios"
     });*/
	//COnfiguración del idioma 
	//http://robferguson.org/2015/07/22/internationalisation-i18n-and-localisation-l10n-for-ionic-apps/
	//https://angular-translate.github.io/docs/#/guide/00_installation
     $translateProvider.useStaticFilesLoader({
       prefix: 'i18n/',
       suffix: '.json'
     })
     .registerAvailableLanguageKeys(['en', 'es'], {
       'en' : 'en', 'en_GB': 'en', 'en_US': 'en',
       'es' : 'es', 'es_MX': 'es', 'es_US': 'es'
     });
     $translateProvider.preferredLanguage("en");
     $translateProvider.fallbackLanguage("en");

  $stateProvider
    /*.state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })*/

  .state('search', {
	  url: '/search',
	  templateUrl: 'templates/search.html'  
  })

  .state('browse', {
	  url: '/browse',
      templateUrl: 'templates/browse.html'
   })
    
   .state('playlists', {
	  url: '/playlists',
      templateUrl: 'templates/playlists.html',
      controller: 'PlaylistsCtrl'   
    })

   .state('single', {
	   url: '/playlists/:playlistId',
	   templateUrl: 'templates/playlist.html',
	   controller: 'PlaylistCtrl' 
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/playlists');
});
