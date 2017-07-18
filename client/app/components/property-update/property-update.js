app.controller('property-update', function($scope, $rootScope, $http, $state, property) {

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Initialization
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++		
	$scope.property = {
		types: [],
		useClasses: [],
		uniqueFeatures: []
	};

	$scope.propertyType = {

		offices: [
			{name: "Private Office"}, 
			{name: "Private Desk"}, 
			{name: "Shared Desk"}
		],
		retails: [
			{name: "Shop House"}, 
			{name: "Push Cart"}, 
			{name: "Popup Space"}, 
			{name: "Hawker"}
		],
		industrials: [
			{name: "B1 Office"}, 
			{name: "B2 Industrial"}, 
			{name: "Industrial"}
		],
	};

	$scope.propertyUseClasses = [
		{name: "Class 1 - Shop"}, 
		{name: "Class 2 - Office"}, 
		{name: "Class 3 - Restaurant"}, 
		{name: "Class 4 - Amusement Centre"}, 
		{name: "Class 5 - Motor Vehicle Showroom"}, 
		{name: "Class 6 - Theatre"}, 
		{name: "Class 7 - Light and Industrial Building"}, 
		{name: "Class 8 - General Industrial Building"}, 
		{name: "Class 9 - Special Industrial Building"}, 
		{name: "Class 10 - WareHouse"}, 
		{name: "Class 11 - Convalescent House"}, 
		{name: "Class 12 - Child Care Centre"}, 
		{name: "Class 13 - Community Building"}, 
		{name: "Class 14 - Sports and Recreational Building"}, 
		{name: "Class 15 - Nightclub"}, 
		{name: "Class 16 - Pet Shop"}, 
		{name: "Class 17 - Community Sports and Fitness Building"}, 
		{name: "Class 18 - Commercial School"}
	];

	$scope.propertyTypeSelection = {};

	$scope.propertyLeaseToggle = function () {
		
		if ($scope.property.category == 'For lease') {

			$scope.property.lease = true;
		}
		else {
			$scope.property.lease = false;
		}
	}

	console.log('property-create controller is running');

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Reset
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++	
	$scope.reset = function () {
		
		$scope.property = {
			types: [],
			useClasses: [],
			uniqueFeatures: []
		};

		$scope.resetForm($scope.createForm);
	}

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Reset form validation
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++	
	$scope.resetForm = function (form) {

	    form.autoValidateFormOptions.resetForm();
	}

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Read a property
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++		
	$scope.read = function () {
		
		property.read($state.params.id).then(function (response) {

			$scope.property = response.data.property;

			initMap();

			if ($scope.property.dateAvailable) {
			
				$scope.property.dateAvailable = new Date($scope.property.dateAvailable);
			}
			
			if ($scope.property.tenure) {
			
				$scope.property.tenure = new Date($scope.property.tenure);
			}
			
			if ($scope.property.leaseTerm) {
			
				$scope.property.leaseTerm = new Date($scope.property.leaseTerm);
			}

			toastr.success(response.data.message);

			console.log(response);

		}).catch(function (response) {

			$state.go('properties');

			toastr.error(response.data.message);
			
			//console.log(response);
		})
	}

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Update a property
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++		
	$scope.update = function () {
		
		$('#updateSubmit').button('loading');
		
		property.update($scope.property._id, $scope.property).then(function (response) {

			$('#updateSubmit').button('reset');

			$state.go('account.properties');

			toastr.success(response.data.message);

			//console.log(response);

		}).catch(function (response) {

			$('#updateSubmit').button('reset');

			toastr.error(response.data.message);
			
			//console.log(response);
		})
	}

	$scope.read();

	$scope.propertyLeaseToggle();

	var map;

	var marker;

	var geocoder = new google.maps.Geocoder();

	function initMap() {
		
		var center = {lat:  14.6760413, lng: 121.0437003};

		if ($scope.property.coordinates) {

			center = {lat:  $scope.property.coordinates.latitude, lng: $scope.property.coordinates.longitude};
		}
		
		map = new google.maps.Map(document.getElementById('map'), {
			zoom: 14,
			center: center
		});

		if ($scope.property.coordinates) {
		
			marker = new google.maps.Marker({
				position: center,
				map: map
			});

		}

		map.addListener('click', function(event) {
			$scope.property.address.street = 'Loading....';

			$scope.property.coordinates.latitude = 'Loading....';

			$scope.property.coordinates.longitude = 'Loading....';

			$scope.$apply();
			placeMarker(event.latLng);
			getLocation(event.latLng);
		});
	}

	function getLocation(location) {

		geocoder.geocode({
			
			'latLng': location

		}, function(results, status) {
			
			if (status == google.maps.GeocoderStatus.OK) {
			
				if (results[0]) {
		
					$scope.property.address.street = results[0].formatted_address;

					$scope.property.coordinates.latitude = results[0].geometry.location.lat();

					$scope.property.coordinates.longitude = results[0].geometry.location.lng();

					$scope.$apply();

				}
			}
		});
	}

	function placeMarker(location) {

		if (marker) {clearMarker();}
    	
    	marker = new google.maps.Marker({
    		position: location,
    		map: map
		});
  	}

  	function clearMarker() {
  	
  		marker.setMap(null)
	}
});