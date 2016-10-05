appmodule.controller('categoriasController',function($scope,$http,$mdDialog,$route){
	$scope.title="Categorias";
	$scope.categories = [];	
	$scope.isLoading=true;
	getAllCategories();

	function getAllCategories(){
		$http({
		method: 'GET',
		url: '/categories'
	})
	.then(function(response){
		$scope.categories=response.data.categories;
		$scope.isLoading=false;
	},function handleError(response){
		$scope.isLoading=false;
		alert("An error has occured while handling the request");
	});
	};

	
	$scope.submitCategory = function(ev){
		$mdDialog.show({
			controller: dialogController,
      		template: '<md-dialog aria-label="Mango (Fruit)"> <md-content class="md-padding"> <form name="categoryForm"> <div layout="column" layout-sm="column"> <md-input-container flex> <label>Categoria</label> <input ng-model="category.categoryname" md-maxlength="50" maxlength="50" placeholder="Ingrese el nombre de la categoria"> </md-input-container>  <md-input-container flex> <label>Descripcion de la categoria</label> <textarea ng-model="category.categorydescription" columns="1" md-maxlength="150" maxlength="150"></textarea> </md-input-container> </form> </md-content> <div class="md-actions" layout="row"> <span flex></span> <md-button ng-click="answer(\'not useful\')" class="md-accent"> Cancelar </md-button> <md-button ng-click="addCategory(category)" class="md-primary"> Guardar </md-button> </div></md-dialog>',
			targetEvent: ev,
		})
		.then(function(category){
			var data = {
				name : category.categoryname,
				description: category.categorydescription
			};
			
			$http.post('/categories',data)
			.then(function(response){
				console.log("Category submitted");
			},function(error){
				console.log("user canceled the input");
			})
		},function(){
			$scope.alert="An error occured";
		});
		
			getAllCategories();
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
              	console.log("Pasó");
                getAllCategories();
              }, function (err) {
              	$scope.isLoading=false;
              	console.log(err.data);
              }
          );
  };

	$scope.showConfirmDeleteCategory = function(ev, category) {
      // Appending dialog to document.body to cover sidenav in docs app
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