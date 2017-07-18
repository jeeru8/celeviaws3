app.controller('signup', function($scope, $rootScope, $http, $state, user) {

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Initialization
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++	
	$scope.user = {};

	console.log('signup controller is running');

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Reset
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++	
	$scope.reset = function () {
		
		$scope.user = {};

		$scope.resetForm($scope.createForm);
	}

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Reset form validation
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++	
	$scope.resetForm = function (form) {

	    form.autoValidateFormOptions.resetForm();
	}

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// user authenticate
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	$scope.create = function () {

		$('#createSubmit').button('loading');

		user.create($scope.user).then(function (response) {

			$('#createSubmit').button('reset');

			$scope.reset();

			toastr.success(response.data.message);

			//console.log(response);

		}).catch(function (response) {

			$('#createSubmit').button('reset');

			$scope.reset();

			toastr.error(response.data.message)
	
			//console.log(response);
		})
	}

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// user authenticate
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	// $scope.create = function () {

	// 	user.create($scope.user).then(function (response) {

	// 		$rootScope.account = response.data.user;

	// 		user.authenticate($scope.user).then(function (response) {
				
	// 			$rootScope.login(response.data);

	// 			$scope.reset();

	// 			toastr.success(response.data.message);

	// 			console.log(response);

	// 		}).catch(function (response) {

	// 			$rootScope.logout();

	// 			$scope.reset();

	// 			toastr.error(response.data.message);
				
	// 			console.log(response);
	// 		})

	// 	}).catch(function (response) {

	// 		$rootScope.logout();

	// 		$scope.reset();

	// 		toastr.error(response.data.message)
	
	// 		console.log(response);
	// 	})
	// }
});