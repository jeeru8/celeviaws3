app.controller('account-messages', function($scope, $rootScope, $http, $state, $filter, user, chat, socket) {

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Initialization
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++	
	$scope.chats = [];

	$scope.chat = {}

	$scope.message = {};

	// forward to avoid duplication of event
	socket.forward('messageTransmit', $scope);

	console.log('account-messages controller is running');

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Read all chats
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	$scope.readByUser = function () {

		chat.readByUser().then(function (response) {

			$scope.chats = response.data.chats;

			$scope.chats.forEach(function (value, index, array) {

				// console.log(value.messages.length);

				$scope.chats[index].receivers = [];

				$scope.chats[index].messagesLength = value.messages.length - 1;

				$filter('filter')(value.users, function (val, ind, arr) {
					
					if (val._id != $rootScope.account._id) {

						$scope.chats[index].receivers.push(val);
					}
				});

			    socket.emit('join', value._id);
			});

			//console.log($scope.chats);

			$scope.read($scope.chats[0]._id);

			toastr.success(response.data.message);

			//console.log(response);

		}).catch(function (response) {

			toastr.error(response.data.message);
			
			//console.log(response);
		})
	}

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Read a chat
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	$scope.read = function (id) {

		chat.read(id).then(function (response) {

			$scope.chat = response.data.chat;

			$scope.chat.receivers = [];

			$filter('filter')($scope.chat.users, function (val, ind, arr) {
					
				if (val._id != $rootScope.account._id) {

					$scope.chat.receivers.push(val);
				}
			});

			$scope.chat.messages.forEach(function (value, index, array) {

				if ($scope.chat.messages[index].user._id == $rootScope.account._id) {

					$scope.chat.messages[index].role = "sender";

					$scope.chat.messages[index].sender = true;
				}
				else {
					$scope.chat.messages[index].role = "receiver";
					$scope.chat.messages[index].sender = false;
				}
			});

			// toastr.success(response.data.message);

			//console.log(response);

		}).catch(function (response) {

			// toastr.error(response.data.message);
			
			//console.log(response);
		})
	}

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Append a message
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	$scope.appendMessage = function () {

		chat.appendMessage($scope.chat._id, $scope.message).then(function (response) {

			$scope.message.string = null;

			socket.emit( 'messageTransmit', {id: $scope.chat._id, message: response.data.chatMessage});

			// toastr.success(response.data.message);

			//console.log(response);

		}).catch(function (response) {

			// toastr.error(response.data.message);
			
			//console.log(response);
		})
	}


	$scope.refreshNotif = function(index){
		var id = 'Account_UM_ID'+index;
		
		var notif = document.getElementById(id);
		
		if(notif != null){
			var notifUMval = document.getElementById('Header_UM_ID').innerHTML;
			var unreadVal = document.getElementById(id).innerHTML;

			var x = notifUMval - unreadVal;

			document.getElementById('Header_UM_ID').innerHTML = x ;
			document.getElementById(id).style.display = "none";

			var newNotif = document.getElementById('Header_UM_ID').innerHTML;
			
			if(newNotif == 0){
				document.getElementById('Header_UM_ID').style.display = "none";
			}

		}
		
	}



	$scope.readByUser();

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Message event listener
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	$scope.$on('socket:messageTransmit', function (event, data) {

		if (data.message.user._id == $rootScope.account._id) {

			data.message.role = "sender";

			data.message.sender = true;
		}
		else {
			data.message.role = "receiver";

			data.message.sender = false;
		}

		$scope.chat.messages.push(data.message);
	});
});