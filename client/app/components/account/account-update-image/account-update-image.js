app.controller('account-update-image', function($scope, $rootScope, $http, $state, user) {

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Initialization
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++	
	console.log('account-update-image controller is running');

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// user update image
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	$scope.updateImage = function () {

		user.updateImage($scope.account).then(function (response) {

			$rootScope.account = response.data.user;

			$state.go('account');

			toastr.success(response.data.message);

			//console.log(response);

		}).catch(function (response) {

			toastr.error(response.data.message);
			
			//console.log(response);
		})
	}

});