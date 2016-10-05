appmodule.controller('habilidadesController', function($scope, $http, $mdDialog) {
	$scope.title="Habilidades";
  $scope.isLoading = true;

	$scope.skills=[];
	getAllSkills();

	function getAllSkills() {
    	$http.get('/skills')
        	.then(function (response) {
            $scope.skills=response.data.skills;
            $scope.isLoading = false;
        	}, function (err) {
            $scope.isLoading = false;
        	}
        );
  };

  function deleteSkill(category, name) {
      $scope.isLoading = true;
      $http.delete('/skills/categories/' + category + '/' + name)
          .then(
              function (response) {
                  getAllSkills();
              }, function (err) {
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
            deleteSkill(skill.category, skill.name);
        }, function() {
        });
  };
});