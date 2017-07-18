app.controller('reset-password', function($scope, $rootScope, $http, $state, authToken, user) {

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Initialization
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++	
	$scope.user = {};

	console.log('reset-password controller is running');

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Reset
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++	
	$scope.reset = function () {
		
		$scope.user = {};

		authToken.set();

		$scope.resetForm($scope.resetPasswordForm);
	}

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Reset form validation
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++	
	$scope.resetForm = function (form) {

	    form.autoValidateFormOptions.resetForm();
	}

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// User reset password
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	$scope.resetPassword = function () {

		authToken.set($state.params.token);

		user.resetPassword($scope.user).then(function (response) {

			$state.go('landing');

			$scope.reset();

			toastr.success(response.data.message);

			//console.log(response);

		}).catch(function (response) {

			$scope.reset();

			toastr.error(response.data.message);
			
			//console.log(response);
		})
	}

});