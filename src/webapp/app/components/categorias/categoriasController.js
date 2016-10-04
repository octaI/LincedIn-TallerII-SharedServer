appmodule.controller('categoriasController',function($scope,$http){
	$scope.title="Categorias";
	$scope.categories = [];
	$http({
		method: 'GET',
		url: '/categories'
	})
	.then(function(response){
		$scope.categories=response.data.categories;
	});
});