appmodule.controller('habilidadesController', function($scope, $http){
	$scope.title="Habilidades";

	$scope.skills=[];
	getAllSkills();

	function getAllSkills() {
    	$http.get('/skills')
        	.then(function (data) {
           	 	// just obtain the promise data
            	$scope.skills=data.skills;
        	}, function (err) {
            	// error handling
            	console.log("Error on retrieving skills");
        	}
        );
    };
});