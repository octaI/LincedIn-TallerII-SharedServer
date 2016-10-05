appmodule.controller('categoriasController',function($scope,$http,$mdDialog,$route){
	$scope.title="Categorias";
	$scope.categories = [];	
	$scope.initFirst=function(){
	
	$http({
		method: 'GET',
		url: '/categories'
	})
	.then(function(response){
		$scope.categories=response.data.categories;
	},function handleError(response){
		alert("An error has occured while handling the request");
	});
	}
	$scope.submitCategory = function(ev){
		$mdDialog.show({
			controller: dialogController,
      		template: '<md-dialog aria-label="Mango (Fruit)"> <md-content class="md-padding"> <form name="categoryForm"> <div layout="column" layout-sm="column"> <md-input-container flex> <label>Categoria</label> <input ng-model="category.categoryname" placeholder="Ingrese el nombre de la categoria"> </md-input-container>  <md-input-container flex> <label>Descripcion de la categoria</label> <textarea ng-model="category.categorydescription" columns="1" md-maxlength="150"></textarea> </md-input-container> </form> </md-content> <div class="md-actions" layout="row"> <span flex></span> <md-button ng-click="answer(\'not useful\')" class="md-accent"> Cancelar </md-button> <md-button ng-click="answer(category)" class="md-primary"> Guardar </md-button> </div></md-dialog>',
			targetEvent: ev,
		})
		.then(function(category){
			var data = {
				name : category.categoryname,
				description: category.categorydescription
			};
			
			$http.post('/categories',data)
			.success(function(data,status,headers,config){

				$scope.categories.push({
					name:data.name,
					description:data.description
				});

				$route.reload(); //BEST SOLUTION I FOUND. MAYBE SOMETHING BETTER?
			})
			.error(function(data,status,headers,config){
				console.log(data);
			});
			$scope.initFirst();
		},function(){
			$scope.alert="An error occured";
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