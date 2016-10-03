var appmodule = angular.module('lincedinapp', ['ngRoute']);

appmodule.config(function($routeProvider){
	$routeProvider

	.when('/',{
		templateUrl : 'app/components/home/homeView.html',
		controller : 'homeController'
	})

	.when('/habilidades',{
		templateUrl : 'app/components/habilidades/habilidadesView.html',
		controller : 'habilidadesController'
	});


});


appmodule.controller('homeController',function($scope){
	$scope.message = "Este es el home";
});

appmodule.controller('habilidadesController',function($scope){
	$scope.message = "Esta es la pagina de Habilidades";
});