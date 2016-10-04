var appmodule = angular.module('lincedinapp',['ngMaterial']);

appmodule.config(function ($mdThemingProvider) {
  $mdThemingProvider
    .theme('default')
    .primaryPalette('indigo')
    .accentPalette('pink')
    .warnPalette('red')
    .backgroundPalette('orange');
});