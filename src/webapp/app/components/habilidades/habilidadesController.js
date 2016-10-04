appmodule.controller('habilidadesController', function($scope, $http, $mdDialog){
	$scope.title="Habilidades";
  $scope.isLoading = false;

	$scope.skills=[];
	getAllSkills();
	function getAllSkills() {
      $scope.isLoading = true;
    	$http.get('/skills')
        	.then(function (response) {
           	 	// just obtain the promise data
                console.log(response);
            	$scope.skills=response.data.skills;
              $scope.isLoading = false;
        	}, function (err) {
            	// error handling
                console.log(response);
            	console.log("Error on retrieving all skills");
              $scope.isLoading = false;
        	}
        );
    };

    function deleteSkill(category, name) {
        $scope.isLoading = true;
        $http.delete('/skills/categories/' + category + '/' + name)
            .then(
                function (response) {
                    // just obtain the promise data
                    console.log(response);
                    getAllSkills();
                }, function (err) {
                    // error handling
                    console.log(response);
                    console.log("Error on deleting skill " + name + " from category " + category);
                    $scope.isLoading = false;
                }
            );
    };

    $scope.showConfirmDeleteSkill = function(ev, skill) {
        // Appending dialog to document.body to cover sidenav in docs app
        var confirm = $mdDialog.confirm()
              .title('¿Estás seguro de querer borrar la habilidad?')
              .textContent('La habilidad será removida definitivamente de la base de datos.')
              .ariaLabel('Delete skill')
              .targetEvent(ev)
              .ok('Borrar')
              .cancel('Cancelar');

        $mdDialog.show(confirm).then(function() {
          console.log("The selected skill will be deleted! Skill: " + skill);
          deleteSkill(skill.category, skill.name);
        }, function() {
          console.log("The skill won't be deleted.");
        });
    };
});