app.controller('forgot-password', function($scope, $rootScope, $http, $state, user) {

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Initialization
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++	
	$scope.user = {};

	console.log('header controller is running');

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Reset
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++	
	$scope.reset = function () {
		
		$scope.user = {};

		$scope.resetForm($scope.forgotPasswordForm);
	}

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Reset form validation
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++	
	$scope.resetForm = function (form) {

	    form.autoValidateFormOptions.resetForm();
	}

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// User forgot password
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	$scope.forgotPassword = function () {

		$('#forgotPasswordSubmit').button('loading');

		user.forgotPassword($scope.user).then(function (response) {

			$state.go('landing');

			$('#forgotPasswordSubmit').button('reset');

			$scope.reset();

			toastr.success(response.data.message);
		
			//console.log(response);

		}).catch(function (response) {

			$('#forgotPasswordSubmit').button('reset');

			$scope.reset();

			toastr.error(response.data.message);
			
			//console.log(response);
		})
	}

});