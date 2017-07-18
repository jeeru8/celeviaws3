app.controller('users', function($scope, $rootScope, $http, $state, user) {

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Initialization
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++	
	$scope.users = [];

	console.log('users controller is running');

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Read all users
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	$scope.readAll = function () {

		user.readAll().then(function (response) {

			$scope.users = response.data.users;

			toastr.success(response.data.message);

			//console.log(response);

		}).catch(function (response) {

			toastr.error(response.data.message);
			
			//console.log(response);
		})
	}

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Delete a user
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	$scope.delete = function (id) {
		
		bootbox.confirm("Delete user?", function (result) {

			if (result) {

				user.delete(id).then(function (response) {

					$scope.readAll();

					toastr.success(response.data.message);
					
					//console.log(response);

				}).catch(function (response) {
					
					toastr.error(response.data.message);

					//console.log(response);
				})
			}
		})
	}

	$scope.readAll();

});