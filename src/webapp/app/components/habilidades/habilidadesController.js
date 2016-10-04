appmodule.controller('habilidadesController', function($scope, $http){
	$scope.title="Habilidades";

	$scope.skills=[];
	getAllSkills();

	function getAllSkills() {
    	$http.get('/skills')
        	.then(function (response) {
           	 	// just obtain the promise data
                console.log(response);
            	$scope.skills=response.data.skills;
        	}, function (err) {
            	// error handling
            	console.log("Error on retrieving skills");
        	}
        );
    };
});