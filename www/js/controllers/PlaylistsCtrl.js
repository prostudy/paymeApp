StarterModule.controller('PlaylistsCtrl', function($scope) {
	$scope.playlists = [
	                    { title: 'Reggae', id: 1 },
	                    { title: 'Chill', id: 2 },
	                    { title: 'Dubstep', id: 3 },
	                    { title: 'Indie', id: 4 },
	                    { title: 'Rap', id: 5 },
	                    { title: 'Cowbell', id: 6 }
	                  ];
	
	var currentTime = new Date();
	console.log('The local time zone is: GMT ' + ( -currentTime.getTimezoneOffset()/60));

});
