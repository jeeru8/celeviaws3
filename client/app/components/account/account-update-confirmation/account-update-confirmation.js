app.controller('account-update-confirmation', function($scope, $rootScope, $http, $state, authToken, user) {

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Initialization
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++	
	console.log('account-update-confirmation controller is running');

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// user update confirmation
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	$scope.updateConfirmation = function () {

		authToken.set($state.params.token);

		user.updateConfirmation().then(function (response) {

			$state.go('landing');

			toastr.success(response.data.message);

			//console.log(response);

		}).catch(function (response) {

			$state.go('landing');

			toastr.error(response.data.message);
			
			//console.log(response);
		})
	}

	$scope.updateConfirmation();

});