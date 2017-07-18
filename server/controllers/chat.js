//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Dependencies
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
var nodemailer  = require('nodemailer');
var hogan 		= require('hogan.js')
var fs 			= require('fs');
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Get the configuration
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
var config = require('../../config');

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Get the user model
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
var Chat = require('../models/chat');

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Create user role asset
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
module.exports.create = function (request, response) {

	var q1 = request.body.users[0] + request.body.users[1];

	var q2 = request.body.users[1] + request.body.users[0];

	var query = Chat.findOne({ $or: [{roomid: q1}, {roomid: q2}] });

	query.exec(function (error, chat) {

		if (error) {
			return response.status(500).json({message: 'Something went wrong.'});
		}
			
		if (chat) {

			request.body.message = request.body.message || {};

			request.body.message.string = request.body.message.string || null;

			request.body.message.user = request.decode.id;

			chat.messages.push(request.body.message)

			chat.save(function (error, chat) {

				if (error) {

					return response.status(500).json({error: error, message: 'Something went wrong.'});
				}

				var template = fs.readFileSync('./public/static/property-email.html', 'utf-8');

				template = template.replace("#changeName", request.body.inquirer.firstName)

				template = template.replace("#changePropertyName", request.body.property.name)

				template = template.replace("#changePropertyAddress", ""+request.body.property.name+" "+request.body.property.address.street+" "+request.body.property.address.buildingName+"")

				template = template.replace("#changePropertyOwnerName", ""+request.body.property.owner.firstName+" "+request.body.property.owner.lastName+"")

				var compiledTemplate = hogan.compile(template);

				var transporter = nodemailer.createTransport({
		
				    service : 'yahoo',
				    auth : {
				 
				        user: config.emailAccount,
				        pass: config.emailPassword
				    }	
				});

				var mailOptions = {
				   
				    from 	: config.emailAccount,
				    to 		: request.body.inquirer.email,
				    subject : 'Property message',
				    text 	: 'Click to see inquiry',
				    html 	: compiledTemplate.render()
				};

				transporter.sendMail(mailOptions, function (error, info) {

					if (error) {

						return response.status(500).json({error: error, message: 'Cannot send email'});
				    }

					return response.status(200).json({message: 'Check your email for confirmation'});
				   	
				});

				chat.populate('messages.user', function(error, chat) {
					
		    		response.json({chatMessage: chat.messages[chat.messages.length - 1], message: 'Message has been sent.'});
				});
			})
			
			// return response.status(500).json({message: 'Something went wrong.'});
		}

		else {

			var chat = new Chat();

			chat.roomid = request.body.users[0] + request.body.users[1];

			chat.users = request.body.users;

			request.body.message = request.body.message || {};

			request.body.message.string = request.body.message.string || null;

			request.body.message.user = request.decode.id;

			chat.messages.push(request.body.message)

			chat.save(function (error, chat) {

				if (error) {
					return response.status(500).json({error: error, message: 'Something went wrong.'});
				}
				else {

					var template = fs.readFileSync('./public/static/property-email.html', 'utf-8');

					template = template.replace("#changeName", request.body.inquirer.firstName)

					template = template.replace("#changePropertyName", request.body.property.name)

					template = template.replace("#changePropertyAddress", ""+request.body.property.name+" "+request.body.property.address.street+" "+request.body.property.address.buildingName+"")

					template = template.replace("#changePropertyOwnerName", ""+request.body.property.owner.firstName+" "+request.body.property.owner.lastName+"")

					var compiledTemplate = hogan.compile(template);

					var transporter = nodemailer.createTransport({
			
					    service : 'yahoo',
					    auth : {
					 
					        user: config.emailAccount,
					        pass: config.emailPassword
					    }	
					});

					var mailOptions = {
					   
					    from 	: config.emailAccount,
					    to 		: request.body.inquirer.email,
					    subject : 'Property message',
					    text 	: 'Click to see inquiry',
					    html 	: compiledTemplate.render()
					};

					transporter.sendMail(mailOptions, function (error, info) {

						if (error) {

							return response.status(500).json({error: error, message: 'Cannot send email'});
					    }

						return response.status(200).json({message: 'Check your email for confirmation'});
					   	
					});
				    
				    response.json({chat: chat, message: 'Message has been sent.'});
				}

			})
		}

	})
};

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Read a chat
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
module.exports.read = function (request, response) {
	
	var query = Chat.findOne({_id: request.params.id, users: request.decode.id}).populate('users', '_id lastName firstName email contactNumber').populate('messages.user', '_id lastName firstName email contactNumber');

	query.exec(function (error, chat) {
		
		if (error) {
		
			return response.status(500).json({error: error, message: 'Something went wrong.'});
		}

		if (!chat) {
		
			return response.status(500).json({message: 'Chat doesnt exists'});
		}

//must update the unread status *******************************************
		chat.messages.forEach(function(convos){
				if(!convos.user._id.equals(request.decode.id)){
					convos.status = "read";
				}
		});

		chat.save(chat);

		return response.status(200).json({chat: chat, message: 'Successfully fetched the chat'});
	});
};

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Read all chat by user
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
module.exports.readByUser = function (request, response) {
	// {messages: {$slice: -1}}
	var query = Chat.find({users: request.decode.id}).populate('users', '_id lastName firstName email contactNumber').populate('messages.user', '_id lastName firstName email contactNumber');

	query.exec(function (error, chats) {

		if (error) {
		
			return response.status(500).json({error: error, message: 'Something went wrong.'});
		}

		if (chats.length == 0) {
		
			return response.status(500).json({message: 'No chat registered'});
		}

		collection = chats;//toObject();

		var collect = []; 

		for(var room = 0; room < chats.length; room++){

			var unread = 0;

			for(var messages = 0; messages < chats[room].messages.length; messages++){
				if(chats[room].messages[messages].status.toString() === "unread" && 
					!(chats[room].messages[messages].user._id.toString() === request.decode.id)){
					unread++;
				}
			}

			//console.log(room, ' chat room: ', chats[room]._id,  'total messages: ',  chats[room].messages.length,  ' , unread: ', unread);
			


			var coldata = {'_id' : chats[room]._id, 
							'roomid' : chats[room].roomid,
							'messages' : chats[room].messages,
							'users' : chats[room].users,
							'unreadmessages' : unread};

			collect.push(coldata);
			
			unread = 0;

		}
			//console.log('collect data: ', collect);

		return response.status(200).json({chats: collect, message: 'Successfully fetched all chats with new collection.'});
	});
};

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Read all chat
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
module.exports.readAll = function (request, response) {
	
	var query = Chat.find({}).populate('users', '_id lastname firstName email contactNumber');

	query.exec(function (error, chats) {
		
		if (error) {
		
			return response.status(500).json({error: error, message: 'Something went wrong.'});
		}

		if (chats.length == 0) {
		
			return response.status(500).json({message: 'No chat registered'});
		}

		return response.status(200).json({chats: chats, message: 'Successfully fetched all chats.'});
	});
};

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Append a list of users
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
module.exports.appendUsers = function (request, response) {

	var query = Chat.findByIdAndUpdate({_id: request.params.id}, {

		$addToSet: { users: { $each: request.body.users } } 

	}, {new: true}).populate('users');

	query.exec(function (error, chat) {
	    
	    if (error) {
		
			return response.status(500).json({error: error, message: 'Something went wrong'});
		}

	    response.json({message: 'User has been added'});

  	});
};

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Append a message
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
module.exports.appendMessage = function (request, response) {

	var query = Chat.findOne({_id: request.params.id, users: request.decode.id}).populate('users', '_id lastName firstName email contactNumber').populate('messages.user');

	query.exec(function (error, chat) {
	    
	    if (error) {
		
			return response.status(500).json({error: error, message: 'Something went wrong'});
		}

		if (!chat) {

			return response.status(500).json({message: 'Chat doesnt exists'});
		}

		request.body.message = request.body.message || {};

		request.body.message.string = request.body.message.string || null;

		request.body.message.user = request.decode.id;

		chat.messages.push(request.body.message)

		chat.save(function (error, chat) {

			if (error) {

				return response.status(500).json({error: error, message: 'Something went wrong'});
			}

			chat.populate('messages.user', function(error, chat) {
				
	    		response.json({chatMessage: chat.messages[chat.messages.length - 1], message: 'Message has been added'});
			});
		})
  	});
};

// //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// // Append a message
// //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// module.exports.appendMessage = function (request, response) {

// 	request.body.message = request.body.message || {};

// 	request.body.message.string = request.body.message.string || null;

// 	var query = Chat.findOneAndUpdate({_id: request.params.id, users: request.decode.id}, {

// 		$push: { messages: {string: request.body.message.string, user: request.body.message.user} } 

// 	}, {new: true}).populate('users');

// 	query.exec(function (error, chat) {
	    
// 	    if (error) {
		
// 			return response.status(500).json({error: error, message: 'Something went wrong'});
// 		}

// 	    response.json({chat: chat, message: 'Message has been added'});

//   	});
// };