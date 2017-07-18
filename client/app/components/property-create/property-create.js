app.controller('property-create', function($scope, $rootScope, $http, $state, property) {

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Initialization
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++		
	$scope.property = {
		types: [],
		useClasses: [],
		uniqueFeatures: [],
		address: {},
		coordinates: {}
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

		//console.log("asd");
		
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
			uniqueFeatures: [],
			address: {},
			coordinates: {}
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
// Create a property
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++		
	$scope.create = function () {

		//console.log($scope.property);

		$('#createSubmit').button('loading');
		
		property.create($scope.property).then(function (response) {

			$state.go('account.properties');

			$('#createSubmit').button('reset');

			$scope.reset();

			toastr.success(response.data.message);

			//console.log(response);

		}).catch(function (response) {

			$('#createSubmit').button('reset');

			toastr.error(response.data.message);
			
			//console.log(response);
		})
	}

	var map;

	var marker;

	var geocoder = new google.maps.Geocoder();

	function initMap() {
		
		var center = {lat:  1.359803, lng: 103.81958199999997};
		
		map = new google.maps.Map(document.getElementById('map'), {
			zoom: 11,
			center: center
		});

		//console.log("sad");
        // Create the search box and link it to the UI element.
        var input = document.getElementById('pac-input');
        var searchBox = new google.maps.places.SearchBox(input);

        map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

        // Bias the SearchBox results towards current map's viewport.
        map.addListener('bounds_changed', function() {
        	console.log("asd");
			searchBox.setBounds(map.getBounds());
        });

        var markers = [];
        // Listen for the event fired when the user selects a prediction and retrieve
        // more details for that place.
        searchBox.addListener('places_changed', function() {
			var places = searchBox.getPlaces();

			if (places.length == 0) {
				return;
			}

			// Clear out the old markers.
			markers.forEach(function(marker) {
				marker.setMap(null);
			});
			
			markers = [];

			// For each place, get the icon, name and location.
			var bounds = new google.maps.LatLngBounds();
			
			places.forEach(function(place) {
			
			if (!place.geometry) {
				console.log("Returned place contains no geometry");
				return;
			}
			
			var icon = {
				url: place.icon,
				size: new google.maps.Size(71, 71),
				origin: new google.maps.Point(0, 0),
				anchor: new google.maps.Point(17, 34),
				scaledSize: new google.maps.Size(25, 25)
			};

			// Create a marker for each place.
			markers.push(new google.maps.Marker({
				map: map,
				icon: icon,
				title: place.name,
				position: place.geometry.location
			}));

			if (place.geometry.viewport) {
				// Only geocodes have viewport.
				bounds.union(place.geometry.viewport);
			} else {
				bounds.extend(place.geometry.location);
			}

			});
			map.fitBounds(bounds);
        });

		// marker = new google.maps.Marker({
		// 	position: center,
		// 	map: map
		// });

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

	initMap();
});