appmodule.config(function($routeProvider){
	$routeProvider

	.when('/',{
		templateUrl : 'app/components/home/homeView.html',
		controller : 'homeController'
	})

	.when('/categorias',{
		templateUrl : 'app/components/categorias/categoriasView.html',
		controller : 'categoriasController'
	})

	.when('/habilidades',{
		templateUrl : 'app/components/habilidades/habilidadesView.html',
		controller : 'habilidadesController'
	})

	.when('/puestos',{
		templateUrl : 'app/components/puestos/puestosView.html',
		controller : 'puestosController'
	});

});