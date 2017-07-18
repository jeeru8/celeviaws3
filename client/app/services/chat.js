app.factory('chat', ['$http', '$q', '$timeout', 'Upload', function ($http, $q, $timeout, Upload) {

	var chat = {};

	chat.create = function (chat) {
		
		return $http.post('chat/create', chat).then(function (response) {

			return $q.resolve(response);

		}).catch(function (response) {

			return $q.reject(response);
		})
	}

	chat.read = function (id) {
		
		return $http.get('chat/'+id+'').then(function (response) {

			return $q.resolve(response);

		}).catch(function (response) {

			return $q.reject(response);
		})
	}

	chat.readByUser = function () {
		
		return $http.get('chats/user').then(function (response) {

			return $q.resolve(response);

		}).catch(function (response) {

			return $q.reject(response);
		})
	}

	chat.readAll = function () {
		
		return $http.get('chats').then(function (response) {

			return $q.resolve(response);

		}).catch(function (response) {

			return $q.reject(response);
		})
	}

	chat.appendMessage = function (id, message) {

		//console.log(message);

		return $http.put('chat/append/message/'+id+'', {message: message}).then(function (response) {

			return $q.resolve(response);

		}).catch(function (response) {

			return $q.reject(response);
		})
	}
	
	return chat;
}])