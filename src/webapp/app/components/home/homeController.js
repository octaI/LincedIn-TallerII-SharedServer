angular.module('lincedinapp')
.controller('homeController',homeController);

homeController.$inject = ['$scope', '$http'];

function homeController($scope){
	$scope.message = "Esto funciona";
}