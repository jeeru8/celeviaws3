app.controller('landing', function($scope, $rootScope, $http, $state, $timeout) {

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Initialization
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++	
	$scope.property = {};

	$scope.select = {
		prices: [{
			label: "0-100,000",
			value: [0, 100000]
		},{
			label: "100,000-200,000",
			value: [100000, 200000]
		},{
			label: "200,000-300,000",
			value: [200000, 300000]
		},{
			label: "300,000-400,000",
			value: [300000, 400000]
		},{
			label: "400,000-500,000",
			value: [400000, 500000]
		},{
			label: "500,000-600,000",
			value: [600000, 600000]
		},{
			label: "600,000-700,000",
			value: [600000, 700000]
		},{
			label: "700,000-800,000",
			value: [700000, 800000]
		},{
			label: "800,000-900,000",
			value: [800000, 900000]
		},{
			label: "900,000-1,000,000",
			value: [900000, 1000000]
		},{
			label: "1,000,000-above",
			value: [1000000]
		}],
		floorAreas: [{
			label: "0sqft-500sqft",
			value: [0, 500]
		},{
			label: "500sqft-1,000sqft",
			value: [500, 1000]
		},{
			label: "1,000-sqft-1,500sqft",
			value: [1000, 1500]
		},{
			label: "1,500sqft-2,000sqft",
			value: [1500, 2000]
		},{
			label: "4,500sqft-5,000sqft",
			value: [4500, 5000]
		},{
			label: "5,000sqft-above",
			value: [5000]
		}], 
	}

	$timeout(function() {
        $('.selectpicker').selectpicker('refresh');
    });

	console.log('landing controller is running');
});
