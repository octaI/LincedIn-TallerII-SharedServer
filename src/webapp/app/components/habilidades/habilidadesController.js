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

  function addSkill(skill, category) {
    $scope.isLoading = true;
    $http.post('/skills/categories/' + category, skill)
      .then(function (response) {
          $scope.skills.push(skill);
          getAllSkills();
        }, function (err) {
          $scope.isLoading = false;
        }
      );
  };

  function editSkill(skill, category, name) {
    $scope.isLoading = true;
    $http.put('/skills/categories/' + category + '/' + name, skill)
      .then(function (response) {
          $scope.skills.push(skill);
          getAllSkills();
        }, function (err) {
          $scope.isLoading = false;
        }
      );
  };

  function deleteSkill(name, category) {
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
      var confirm = $mdDialog.confirm()
            .title('¿Estás seguro de querer borrar la habilidad?')
            .textContent('La habilidad será removida definitivamente de la base de datos.')
            .ariaLabel('Delete skill')
            .targetEvent(ev)
            .ok('Borrar')
            .cancel('Cancelar');

        $mdDialog.show(confirm).then(function() {
            deleteSkill(skill.name, skill.category);
        }, function() {
        });
  };

  $scope.showAddSkillDialog = function(ev) {
    $mdDialog.show({
      controller: dialogController,
      template: '<md-dialog aria-label="Add skill"> <div class="md-padding"> <form name="skillForm"> <div layout="column" layout-sm="column"> <md-input-container flex> <label>Habilidad</label> <input ng-model="skill.name" placeholder="Nombre de la habilidad"> </md-input-container>  <md-input-container flex> <label>Categoría</label> <input ng-model="skill.category" placeholder="Categoría de la habilidad"> </md-input-container>  <md-input-container flex> <label>Descripción</label> <textarea ng-model="skill.description" columns="1" md-maxlength="150" placeholder="Descripción de la habilidad"></textarea> </md-input-container> </form> </div> <md-dialog-actions layout="row"> <md-button ng-click="answer(\'not useful\')" class="md-primary"> Cancelar </md-button> <md-button ng-click="answer(skill)" class="md-primary"> Guardar </md-button> </md-dialog-actions></md-dialog>',
      targetEvent: ev,
      clickOutsideToClose: true
    })
    .then(function(answer) {
      if (answer !== 'not useful') {
        skill = {'name': answer.name, 'description': answer.description};
        addSkill(skill, answer.category);
      }
    },function(){
    });
  };

  $scope.showEditSkillDialog = function(ev, skillToEdit) {
    $mdDialog.show({
      controller: dialogController,
      template: '<md-dialog aria-label="Add skill"> <div class="md-padding"> <form name="skillForm"> <div layout="column" layout-sm="column"> <md-input-container flex> <label>Habilidad</label> <input ng-model="skill.name" placeholder="Nombre de la habilidad"> </md-input-container>  <md-input-container flex> <label>Categoría</label> <input ng-model="skill.category" placeholder="Categoría de la habilidad"> </md-input-container>  <md-input-container flex> <label>Descripción</label> <textarea ng-model="skill.description" columns="1" md-maxlength="150" placeholder="Descripción de la habilidad"></textarea> </md-input-container> </form> </div> <md-dialog-actions layout="row"> <md-button ng-click="answer(\'not useful\')" class="md-primary"> Cancelar </md-button> <md-button ng-click="answer(skill)" class="md-primary"> Guardar </md-button> </md-dialog-actions></md-dialog>',
      targetEvent: ev,
      clickOutsideToClose: true
    })
    .then(function(answer) {
      if (answer !== 'not useful') {
        skill = {'name': answer.name, 'category': answer.category, 'description': answer.description};
        editSkill(skill, skillToEdit.category, skillToEdit.name);
      }
    },function(){
    });
  };

});

function dialogController($scope, $mdDialog){
    $scope.hide = function(){
      $mdDialog.hide();
    };
    $scope.cancel = function(){
      $mdDialog.cancel();
    };
    $scope.answer = function(answer){
      $mdDialog.hide(answer);
    };
  };