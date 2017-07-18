app.controller('property', function($scope, $rootScope, $http, $state, property, chat) {

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Initialization
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++	
	$scope.property = {};

	$scope.chat = {users: [], message: {}, property: {}};

	console.log('property controller is running');

	//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Read a property
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++		
	$scope.read = function () {
		
		property.read($state.params.id).then(function (response) {

			$scope.property = response.data.property;

			$scope.chat.message.string = "Hi "+$scope.property.owner.firstName+" "+$scope.property.owner.lastName+"! Would like to check the availability for "+$scope.property.name+", "+$scope.property.address.street+", "+$scope.property.address.buildingName+". Please acknowledge. Thank you!"

			$scope.chat.inquirer = $rootScope.account;

			$scope.chat.property = $scope.property;

			initMap();

			toastr.success(response.data.message);

			//console.log(response);

		}).catch(function (response) {

			toastr.error(response.data.message);
			
			//console.log(response);
		})

		if ($scope.authentication) {

			property.updateViews($state.params.id).then(function (response) {

				//console.log(response);

			}).catch(function (response) {
				
				//console.log(response);
			})

			property.updateInquiries($state.params.id).then(function (response) {

				//console.log(response);

			}).catch(function (response) {
				
				//console.log(response);
			})
		}
	}
	$scope.createChat = function () {

		if ($scope.authentication) {

			$('#createSubmit').button('loading');

			$scope.chat.users.push($rootScope.account._id, $scope.property.owner._id);
		
			chat.create($scope.chat).then(function (response) {

				$('#createSubmit').button('reset');

				toastr.success(response.data.message);

				//console.log(response);

			}).catch(function (response) {

				$('#createSubmit').button('reset');

				toastr.error(response.data.message);
				
				//console.log(response);
			})
		}

		else {

			toastr.error("Need to login first");
		}

		

		// property.updateViews($state.params.id).then(function (response) {

		// 	console.log(response);

		// }).catch(function (response) {
			
		// 	console.log(response);
		// })
	}

	$scope.read();

	var map;

	var marker;

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
	
	}
});
