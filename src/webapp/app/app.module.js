angular.module('lincedinapp', ['ngMaterial'])
	.config(function($mdThemingProvider) {
  		$mdThemingProvider.theme('default')
    	.primaryPalette(‘orange’, {
      		'default': '500',
      		'hue-1': '200',
      		'hue-2': '800'
    	})
    	.accentPalette('deep-orange')
    	.warnPalette('brown');
	}
);