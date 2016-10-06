appmodule.controller('categoriasController',function($scope,$http,$mdDialog,$mdToast,$window,$location){
	$scope.title="Categorias";
	
	$scope.isLoading=true;

	$scope.categories=[];	

	getAllCategories();



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

	


	$scope.showAddCategoryDialog = function(ev) {
    $mdDialog.show({
      controller: dialogController,
      template: '<md-dialog aria-label="Add skill"> <div class="md-padding"> <form name="categoryForm"> <div layout="column" layout-sm="column"> <md-input-container flex> <label>Categoria</label> <input ng-model="category.name" md-maxlength="50" maxlength="50" placeholder="Nombre de la Categoria"> </md-input-container>    <md-input-container flex> <label>Descripción</label> <textarea ng-model="category.description" columns="1" md-maxlength="150" maxlength="150" placeholder="Descripción de la categoría"></textarea> </md-input-container> </form> </div> <md-dialog-actions layout="row"> <md-button ng-click="answer(\'not useful\')" class="md-warn"> Cancelar </md-button> <md-button ng-click="answer(category)" class="md-primary"> Guardar </md-button> </md-dialog-actions></md-dialog>',
      targetEvent: ev,
      clickOutsideToClose: true
    })
    .then(function(answer) {
      if (answer !== 'not useful') {
        category = {'name': answer.name, 'description': answer.description};
        addCategory(category);
      }
    },function(){
    });
  };

	$scope.showEditCategoryDialogue = function(ev, category) {
		
		$mdDialog.show({
			locals:{name : category.name,description: category.description},
			controller: dialogController2,
			template: '<md-dialog aria-label="Add Category"> <md-content class="md-padding"> <form name="categoryForm"> <div layout="column" layout-sm="column"> <md-input-container flex> <label>Categoria</label> <input ng-model="category.categoryname"  md-maxlength="50" maxlength="50" > </md-input-container>  <md-input-container flex> <label>Descripcion de la categoria</label> <textarea ng-model="category.categorydescription" value="category.description" columns="1" md-maxlength="150" maxlength="150"></textarea> </md-input-container> </form> </md-content> <div class="md-actions" layout="row"> <span flex></span> <md-button ng-click="answer(\'not useful\')" class="md-warn"> Cancelar </md-button> <md-button ng-click="answer(category)" class="md-primary"> Guardar </md-button> </div></md-dialog>',
			targetEvent:ev,
			clickOutsideToClose:true
		})
		.then(function(answer){
			if(answer !== 'not useful'){
				editedcategory = {'name':answer.categoryname,'description':answer.categorydescription };
				editCategory(editedcategory,category.name);
			}
		},function(){

		});
	}

	function editCategory(category,oldcategoryname){
		$scope.isLoading=true;
		console.log(oldcategoryname);
		$http.put('/categories/' + oldcategoryname,category)
		.then(function(response){
			showSimpleToast("La categoria "+oldcategoryname+" ha sido editada con éxito");
			getAllCategories();
		},function(err){
			console.log(err);
			$scope.isLoading=false;
		
		});
	};



  	function addCategory(category) {
	    $scope.isLoading = true;
	    $http.post('/categories', category)
	      .then(function (response) {
	      	 $scope.categories.push(response.data);
	      	 getAllCategories();
	      	 $location.path();
        	 showSimpleToast("La categoria fue agregada correctamente a la base de datos.");
	        }, function (err) {
	          $scope.isLoading = false;
	          showSimpleToast("Ha ocurrido un error. La categoria no pudo ser agregada a la base de datos.");
	        }
	      );
	     
  };

	function deleteCategory(name,$http) {
	 	$scope.isLoading=true;
	 	console.log('categories/'+name);
      	$http({
      		method : "DELETE",
      		url:'/categories/'+name
      	})
        	.then(
              function (response) {
              	$scope.isLoading=false;
              	showSimpleToast("La categoría "+name+" ha sido eliminada con éxito");
                getAllCategories();
              }, function (err) {
              	$scope.isLoading=false;
              	console.log(err.data);
              }
          );
  };

	$scope.showConfirmDeleteCategory = function(ev, category) {
      var confirm = $mdDialog.confirm()
            .title('¿Estás seguro de querer borrar la Categoria?')
            .textContent('La categoria será removida definitivamente de la base de datos.')
            .ariaLabel('Delete category')
            .targetEvent(ev)
            .ok('Borrar')
            .cancel('Cancelar');

        $mdDialog.show(confirm).then(function() {
            deleteCategory(category.name,$http);
        }, function() {
        });
  };
	

  function showSimpleToast(message) {
      	var toast = $mdToast.simple()
			.textContent(message)
			.action("OK")
			.highlightAction(true)
			.position("top right end");
			$mdToast.show(toast)
			.then(function(response){

			})
  };



});


function dialogController($scope,$mdDialog){
		
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

function dialogController2($scope,$mdDialog,name,description){
		console.log(name);
		$scope.category = {categoryname: name, categorydescription: description};

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