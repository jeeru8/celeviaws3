app.factory('property', ['$http', '$q', '$timeout', 'Upload', function ($http, $q, $timeout, Upload) {

	var property = {};

	property.create = function (property) {

		return Upload.upload({url: 'property/create', method: 'post', data: property}).then(function (response) {

			return $q.resolve(response);

		}).catch(function (response) {

			return $q.reject(response);
		})
	}

	property.read = function (id) {
		
		return $http.get('property/'+ id +'').then(function (response) {

			return $q.resolve(response);

		}).catch(function (response) {

			return $q.reject(response);
		})
	}

	property.readAll = function () {
		
		return $http.get('properties').then(function (response) {

			return $q.resolve(response);

		}).catch(function (response) {

			return $q.reject(response);
		})
	}

	property.readByOwner = function () {
		
		return $http.get('properties/owner').then(function (response) {

			return $q.resolve(response);

		}).catch(function (response) {

			return $q.reject(response);
		})
	}

	property.readByCategory = function (category) {
		
		return $http.post('properties/category', category).then(function (response) {

			return $q.resolve(response);

		}).catch(function (response) {

			return $q.reject(response);
		})
	}

	property.update = function (id, property) {

		return Upload.upload({url: 'property/update/'+ id +'', method: 'put', data: property}).then(function (response) {

			return $q.resolve(response);

		}).catch(function (response) {

			return $q.reject(response);
		})
	}

	property.updateViews = function (id) {

		return $http.put('property/updateViews/'+id+'').then(function (response) {

			return $q.resolve(response);

		}).catch(function (response) {

			return $q.reject(response);
		})
	}

	property.updateInquiries = function (id) {

		return $http.put('property/updateInquiries/'+id+'').then(function (response) {

			return $q.resolve(response);

		}).catch(function (response) {

			return $q.reject(response);
		})
	}

	property.delete = function (id) {
		
		return $http.delete('property/delete/'+ id +'').then(function (response) {

			return $q.resolve(response);

		}).catch(function (response) {

			return $q.reject(response);
		})
	}
	
	return property;
}])