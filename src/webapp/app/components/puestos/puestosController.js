appmodule.controller('puestosController', function($scope, $http, $mdDialog) {
	$scope.title="Puestos";
  	$scope.isLoading = false;

	$scope.jobPositions=[];
	getAllJobPositions();

  	$scope.categories = [];
  	getAllCategories();

	function getAllJobPositions() {
      $scope.isLoading = true;
    	$http.get('/job_positions')
        	.then(function (response) {
            $scope.jobPositions=response.data.job_positions;
            $scope.isLoading = false;
        	}, function (err) {
            $scope.isLoading = false;
        	}
        );
  };

  function getAllCategories() {
      $scope.isLoading = true;
      $http.get('/categories')
          .then(function (response) {
            $scope.categories=response.data.categories;
            $scope.isLoading = false;
          }, function (err) {
            $scope.isLoading = false;
          }
        );
  };

  function addJobPosition(jobPosition, category) {
    $scope.isLoading = true;
    $http.post('/job_positions/categories/' + category, jobPosition)
      .then(function (response) {
          $scope.jobPositions.push(jobPosition);
          getAllJobPositions();
        }, function (err) {
          $scope.isLoading = false;
        }
      );
  };

  function editJobPosition(jobPosition, category, name) {
    $scope.isLoading = true;
    $http.put('/job_positions/categories/' + category + '/' + name, jobPosition)
      .then(function (response) {
          $scope.jobPositions.push(jobPosition);
          getAllJobPositions();
        }, function (err) {
          $scope.isLoading = false;
        }
      );
  };

  function deleteJobPosition(name, category) {
      $scope.isLoading = true;
      $http.delete('/job_positions/categories/' + category + '/' + name)
          .then(
              function (response) {
                  getAllJobPositions();
              }, function (err) {
                $scope.isLoading = false;
              }
          );
  };

  $scope.showConfirmDeleteJobPosition = function(ev, jobPosition) {
      var confirm = $mdDialog.confirm()
            .title('¿Estás seguro de querer borrar el puesto de trabajo?')
            .textContent('El puesto será removido definitivamente de la base de datos.')
            .ariaLabel('Delete job position')
            .targetEvent(ev)
            .ok('Borrar')
            .cancel('Cancelar');

        $mdDialog.show(confirm).then(function() {
            deleteJobPosition(jobPosition.name, jobPosition.category);
        }, function() {
        });
  };

  $scope.showAddJobPositionDialog = function(ev) {
    $mdDialog.show({
      controller: AddJobPositionDialogController,
      template: '<md-dialog aria-label="Add job position"> <div class="md-padding"> <form name="jobPositionForm"> <div layout="column" layout-sm="column"> <md-input-container flex> <label>Puesto</label> <input ng-model="jobPosition.name" md-maxlength="50" maxlength="50" placeholder="Nombre del puesto"> </md-input-container>  <md-input-container flex> <label>Categoría</label> <input ng-model="jobPosition.category" placeholder="Categoría del puesto"> </md-input-container>  <md-input-container flex> <label>Descripción</label> <textarea ng-model="jobPosition.description" columns="1" md-maxlength="150" maxlength="150" placeholder="Descripción del puesto"></textarea> </md-input-container> </form> </div> <md-dialog-actions layout="row"> <md-button ng-click="answer(\'not useful\')" class="md-primary"> Cancelar </md-button> <md-button ng-click="answer(jobPosition)" class="md-primary"> Guardar </md-button> </md-dialog-actions></md-dialog>',
      targetEvent: ev,
      clickOutsideToClose: true
    })
    .then(function(answer) {
      if (answer !== 'not useful') {
        jobPosition = {'name': answer.name, 'description': answer.description};
        addJobPosition(jobPosition, answer.category);
      }
    },function(){
    });
  };

  $scope.showEditJobPositionDialog = function(ev, jobPositionToEdit) {
    $scope.selectedJobPosition = jobPositionToEdit;
    $mdDialog.show({
      locals: {
        jobPositionToEdit: $scope.selectedJobPosition
      },
      controllerAs: 'ctrl',
      controller: EditJobPositionDialogController,
      template: '<md-dialog aria-label="Add job position"> <div class="md-padding"> <form name="jobPositionForm"> <div layout="column" layout-sm="column"> <md-input-container flex> <label>Puesto</label> <input ng-model="jobPosition.name" md-maxlength="50" maxlength="50" placeholder={{ctrl.jobPosition.name}}> </md-input-container>  <md-input-container flex> <label>Categoría</label> <input ng-model="jobPosition.category" placeholder={{ctrl.jobPosition.category}}> </md-input-container>  <md-input-container flex> <label>Descripción</label> <textarea ng-model="jobPosition.description" columns="1" md-maxlength="150" maxlength="150" placeholder={{ctrl.jobPosition.description}}></textarea> </md-input-container> </form> </div> <md-dialog-actions layout="row"> <md-button ng-click="answer(\'not useful\')" class="md-primary"> Cancelar </md-button> <md-button ng-click="answer(jobPosition)" class="md-primary"> Guardar </md-button> </md-dialog-actions></md-dialog>',
      targetEvent: ev,
      clickOutsideToClose: true
    })
    .then(function(answer) {
      if (answer !== 'not useful') {
        jobPosition = {'name': answer.name, 'category': answer.category, 'description': answer.description};
        editSkill(jobPosition, jobPositionToEdit.category, jobPositionToEdit.name);
      }
    },function(){
    });
  };

});

function AddJobPositionDialogController($scope, $mdDialog){
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

function EditJobPositionDialogController($scope, $mdDialog, jobPositionToEdit) {
    $scope.jobPosition = jobPositionToEdit;
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