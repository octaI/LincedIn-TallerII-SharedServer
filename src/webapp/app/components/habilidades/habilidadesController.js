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
                console.log(response);
            	console.log("Error on retrieving all skills");
        	}
        );
    };

    $scope.deleteSkill = function(category, name) {
        $http.delete('/skills/categories/' + category + '/' + name)
            .then(function (response) {
                // just obtain the promise data
                console.log(response);
                getAllSkills();
            }, function (err) {
                // error handling
                console.log(response);
                console.log("Error on deleting skill " + name + " from category " + category);
            }
        );
    };
});