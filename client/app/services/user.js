app.factory('user', ['$http', '$q', '$timeout', 'Upload', function ($http, $q, $timeout, Upload) {

	var user = {};

	user.create = function (user) {

		return $http.post('user/create', user).then(function (response) {
			
			return $q.resolve(response);

		}).catch(function (response) {

			return $q.reject(response)
		});
	}

	user.read = function () {
		
		return $http.get('user').then(function (response) {

			return $q.resolve(response);

		}).catch(function (response) {

			return $q.reject(response);
		})
	}

	user.readAll = function () {
		
		return $http.get('users').then(function (response) {

			return $q.resolve(response);

		}).catch(function (response) {

			return $q.reject(response);
		})
	}

	user.update = function (user) {

		return $http.put('user/update', user).then(function (response) {

			return $q.resolve(response);

		}).catch(function (response) {

			return $q.reject(response);
		})
	}

	user.updatePassword = function (user) {

		return $http.put('user/update/password', user).then(function (response) {

			return $q.resolve(response);

		}).catch(function (response) {

			return $q.reject(response);
		})
	}

	user.updateConfirmation = function () {

		return $http.put('user/update/confirmation').then(function (response) {

			return $q.resolve(response);

		}).catch(function (response) {

			return $q.reject(response);
		})
	}

	user.updateImage = function (user) {

		return Upload.upload({url: 'user/update/image/', method: 'put', data: user}).then(function (response) {

			return $q.resolve(response);

		}).catch(function (response) {

			return $q.reject(response);
		})
	}

	user.delete = function (id) {
		
		return $http.delete('user/delete/'+ id +'').then(function (response) {

			return $q.resolve(response);

		}).catch(function (response) {

			return $q.reject(response);
		})
	}

	user.authenticate = function (user) {

		return $http.post('user/authenticate', user).then(function (response) {

			return $q.resolve(response);

		}).catch(function (response) {

			return $q.reject(response);
		})
	}

	user.forgotPassword = function (user) {

		return $http.post('user/forgot/password', user).then(function (response) {

			return $q.resolve(response);

		}).catch(function (response) {

			return $q.reject(response);
		})
	}

	user.resetPassword = function (user) {

		return $http.post('user/reset/password', user).then(function (response) {

			return $q.resolve(response);

		}).catch(function (response) {

			return $q.reject(response);
		})
	}
	
	return user;
}])

app.factory('authToken', ['$window', function ($window) {

	var authToken = {};

	authToken.get = function () {

		return $window.localStorage.getItem('token');
	}

	authToken.set = function (token) {

		if (token) {

			$window.localStorage.setItem('token', token)
		} 
		else {

			$window.localStorage.removeItem('token');
		}
	}

	return authToken;
}])

app.factory('authInterceptor', ['authToken', function (authToken) {

	var authInterceptor = {};

	authInterceptor.request = function (config) {

		var token = authToken.get()
		
		if (token) {
		
			config.headers.token = token;
		}

		return config;
	}

	return authInterceptor;
}])

app.factory('socket', ['socketFactory', function (socketFactory) {

	// var myIoSocket = io.connect('http://localhost:8080/#!/landing');

	// socket = socketFactory({
	// 	ioSocket: myIoSocket
	// });

	return socketFactory();
}])