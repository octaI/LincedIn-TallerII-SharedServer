var appmodule = angular.module('lincedinapp',['ngRoute']);

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