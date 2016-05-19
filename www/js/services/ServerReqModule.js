angular.module('ServerReqModule', [])

.factory('ServerHttp', function($http,$httpParamSerializer,$ionicLoading,$q) {

  return {
	  jsonp:function(urlParam, params){
		var q = $q.defer();
		var url = urlParam + $httpParamSerializer(params);
		$http.jsonp(url).
        then(function successCallback(data, status, headers, config){
        	q.resolve(data);
        	$ionicLoading.hide();
            },function errorCallback(data, status, headers, config) {
                console.log("Error ServerHttp:",data);
                $ionicLoading.hide();
                q.reject(data);
        });
		return q.promise;
	},  
  }//End return
});