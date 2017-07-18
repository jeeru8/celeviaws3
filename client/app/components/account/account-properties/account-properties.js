app.controller('account-properties', function($scope, $rootScope, $http, $state, property) {

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Initialization
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++	
	$scope.properties = [];

	console.log('account-properties controller is running');

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Read all properties by owner
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++		
	$scope.readByOwner = function () {
		
		property.readByOwner().then(function (response) {

			$scope.properties = response.data.properties;

			toastr.success(response.data.message);

			//console.log(response);

		}).catch(function (response) {

			toastr.error(response.data.message);
			
			//console.log(response);
		})
	}

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Delete a property
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++		
	$scope.delete = function (id) {
		
		bootbox.confirm("Delete property?", function (result) {

			if (result) {

				property.delete(id).then(function (response) {

					$scope.readByOwner();

					toastr.success(response.data.message);
					
					//console.log(response);

				}).catch(function (response) {
					
					toastr.error(response.data.message);

					//console.log(response);
				})
			}
		})
	}

	$scope.readByOwner();
});