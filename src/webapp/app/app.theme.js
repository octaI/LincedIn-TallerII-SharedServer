appmodule.config(function($mdThemingProvider){
	$mdThemingProvider.theme('default')
		.primaryPalette('orange', {
      		'default': '600',
      		'hue-1': '200',
      		'hue-2': '800'
    	})
		.accentPalette('green', {
      		'default': 'A400'
    	})
		.warnPalette('deep-orange');
});