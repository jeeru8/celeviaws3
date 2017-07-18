app.controller('account', function($scope, $rootScope, $http, $state, user) {

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Initialization
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++	
	console.log('account controller is running');
	
// //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// // user authenticate
// //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// 	$scope.update = function () {

// 		user.update($scope.account).then(function (response) {

// 			$rootScope.account = response.data.user;

// 			$state.go('account');

// 			toastr.success(response.data.message);

// 			console.log(response);

// 		}).catch(function (response) {

// 			toastr.error(response.data.message);
			
// 			console.log(response);
// 		})
// 	}

// //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// // user authenticate
// //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// 	$scope.updateImage = function () {

// 		user.updateImage($scope.account).then(function (response) {

// 			$rootScope.account = response.data.user;

// 			$state.go('account');

// 			toastr.success(response.data.message);

// 			console.log(response);

// 		}).catch(function (response) {

// 			toastr.error(response.data.message);
			
// 			console.log(response);
// 		})
// 	}

// //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// // user reset password
// //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// 	$scope.updatePassword = function () {
		

// 		if ($state.params.token != "") {

// 			$scope.user.token = $state.params.token;

// 		}

// 		user.updatePassword($scope.user).then(function (response) {

// 			$scope.user = {};

// 			$state.go('landing');

// 			toastr.success(response.data.message);

// 			console.log(response);

// 		}).catch(function (response) {

// 			toastr.error(response.data.message);
			
// 			console.log(response);
// 		})
// 	}

// //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// // Send email
// //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// 	$scope.sendEmail = function () {

// 		$('#loadingButton').button('loading');

// 		user.sendEmail($scope.user).then(function (response) {

// 			toastr.success(response.data.message);

// 			$state.go('landing');
			
// 			$('#loadingButton').button('reset');

// 			console.log(response);

// 		}).catch(function (response) {

// 			toastr.error(response.data.message);
			
// 			$('#loadingButton').button('reset');

// 			console.log(response);
// 		})
// 	}

});