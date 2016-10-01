lincedinApp.config(function($routeProvider){
	$routeProvider

	.when('/',{
		templateUrl : 'components/home/homeView.html'
		controller : 'homeController'
	})

	.otherwise({
		redirectTo : '/'
	})
});