//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Dependencies
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
var nodemailer  = require('nodemailer');
var hogan 		= require('hogan.js')
var jwt 		= require('jsonwebtoken');
var fs 			= require('fs');

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Get the configuration
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
var config = require('../../config');

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Get the user model
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
var User = require('../models/user');
var Chat = require('../models/chat');

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Create user role asset
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
module.exports.create = function (request, response) {

	var user = new User();

    user.email		= request.body.email;
    user.firstName 	= request.body.firstName;
    user.lastName 	= request.body.lastName;

    // role asset
    user.role		= 'asset';
   
  	// password hash
  	user.password 	= user.hashPassword(request.body.password);

	user.save(function (error, user) {
    
        if (error) {
			
			return response.status(500).json({error: error, message: 'Something went wrong.'});
		}

		else {

			var token = jwt.sign({id: user.id, role: user.role}, config.tokenKey, {expiresIn: 4000});

			var template = fs.readFileSync('./public/static/confirm-email.html', 'utf-8');
			
			var changeTemplate = template.replace("#changeRef", ""+config.domain+"/#!/account/update/confirmation/"+token+"")
			
			var compiledTemplate = hogan.compile(changeTemplate);

			var transporter = nodemailer.createTransport({
	
			    service : 'yahoo',
			    auth : {
			 
			        user: config.emailAccount,
			        pass: config.emailPassword
			    }	
			});

			var mailOptions = {
			   
			    from 	: config.emailAccount,
			    to 		: request.body.email,
			    subject : 'Email Confirmation',
			    text 	: 'Click to confirm email',
			    html 	: compiledTemplate.render()
			};

			transporter.sendMail(mailOptions, function (error, info) {

				if (error) {

					return response.status(500).json({error: error, message: 'Cannot send email'});
			    }

				return response.status(200).json({message: 'Check your email for confirmation'});
			   	
			});
		}
    });
};

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Create user role admin
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
module.exports.createAdmin = function (request, response) {

	var user = new User();

    user.email		= request.body.email;
    user.firstName 	= request.body.firstName;
    user.lastName 	= request.body.lastName;

    // role admin
    user.role		= 'admin';
   
  	// password hash
  	user.password 	= user.hashPassword(request.body.password);

	user.save(function (error, user) {
    
        if (error) {
			
			return response.status(500).json({error: error, message: 'Something went wrong.'});
		}

		else {

			var template = fs.readFileSync('./public/static/confirm-email.html', 'utf-8');
			
			var changeTemplate = template.replace("#changeRef", ""+config.domain+"/#!/account/update/confirmation/"+user.email+"")
			
			var compiledTemplate = hogan.compile(changeTemplate);
			
			var transporter = nodemailer.createTransport({
	
			    service : 'yahoo',
			    auth : {
			 
			        user: config.emailAccount,
			        pass: config.emailPassword
			    }	
			});

			var mailOptions = {
			   
			    from 	: config.emailAccount,
			    to 		: request.body.email,
			    subject : 'Email Confirmation',
			    text 	: 'Click to confirm email',
			    html 	: compiledTemplate.render()
			};

			transporter.sendMail(mailOptions, function (error, info) {

				if (error) {

					return response.status(500).json({error: error, message: 'Cannot send email'});
			    }

				return response.status(200).json({message: 'Check your email for confirmation'});
			   	
			});
		}
    });
};

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Read user
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
module.exports.read = function (request, response) {
	
	var query = User.findById({_id: request.decode.id});

	query.exec(function (error, user) {
		
		if (error) {
		
			return response.status(500).json({error: error, message: 'Something went wrong.'});
		}

		if (!user) {
		
			return response.status(500).json({message: 'User not found in the database.'});
		}

		var newUser = user.toObject();
		delete newUser["password"];
					//viovicentejerome.nodejs@yahoo.com

		Chat.find({
					$and: [
							{"users": request.decode.id},
							/*{"messages.user": { "$ne" : request.decode.id }},*/
					        {"messages.status": "unread"}
					      ]
					  })
					.exec(function (error, data){
						

						//console.log('user Id: ', request.decode.id);

						var unread = 0;

						//console.log('total room: ', data.length);

						for(var room = 0; room < data.length ; room++){

							//var unreadmessages = 0;

							for(var messages = 0; messages < data[room].messages.length ; messages++){


								if( data[room].messages[messages].status.toString() === "unread" && 
									!(data[room].messages[messages].user.toString() === request.decode.id) )
								{

									//console.log(room, ' user id: ', data[room].messages[messages].user.toString(), ', decoded: ', request.decode.id );

									unread++;
									//unreadmessages++;
								}
							}

							//console.log('unread per room: ', unread);
							//console.log(room, ' user room: ', data[room].roomid, ',  messages:', data[room].messages.length, ', unread: ',  unreadmessages);

							//unreadmessages = 0;
						}

						newUser.messageUnread = unread;
						
						//console.log('user total unread: ', unread);

						return response.status(200).json({user: newUser, message: 'Successfully fetched user.'});
					});
	});
};

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Read all user
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
module.exports.readAll = function (request, response) {
	
	var query = User.find({});

	query.exec(function (error, users) {
		
		if (error) {
		
			return response.status(500).json({error: error, message: 'Something went wrong.'});
		}

		if (users.length == 0) {
		
			return response.status(500).json({message: 'No user registered'});
		}

		return response.status(200).json({users: users, message: 'Successfully fetched all users.'});
	});
};

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Update user basic information
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
module.exports.update = function (request, response) {

	var query = User.findById({_id: request.decode.id});

	query.exec(function (error, user) {

		if (error) {
		
			return response.status(500).json({error: error, message: 'Something went wrong'});
		}

		if (!user) {
		
			return response.status(500).json({message: 'Something went wrong'});
		}

	    // user.email				= request.body.email 								|| user.email;

	    user.agent				= request.body.agent;
		
		user.firstName			= request.body.firstName 							|| user.firstName;
		user.lastName			= request.body.lastName 							|| user.lastName;
		user.contactNumber 		= request.body.contactNumber 						|| user.contactNumber;
	    user.ceaNumber			= (!user.agent) ? null : request.body.ceaNumber 	|| user.ceaNumber;
	    user.licenseNumber		= (!user.agent) ? null : request.body.licenseNumber || user.licenseNumber;
	    user.newsSubscription	= request.body.newsSubscription 					|| user.newsSubscription;
	    user.billingInfo 		= request.body.billingInfo 							|| user.billingInfo;
	    user.company			= request.body.company 								|| user.company;
	    
	    user.save(function (error, user) {
    
	        if (error) {
				
				return response.status(500).json({error: error, message: 'Something went wrong.'});
			}

	        return response.status(200).json({user: user, message: 'User has been updated.'});
	    });
	});
};

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Update user password
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
module.exports.updatePassword = function (request, response) {

	var query = User.findById({_id: request.decode.id});

	query.exec(function (error, user) {

		if (error) {
		
			return response.status(500).json({error: error, message: 'Something went wrong'});
		}

		if (!user) {
		
			return response.status(500).json({message: 'Something went wrong'});
		}

		else {
			
			var validPassword = user.comparePassword(request.body.oldPassword);

			if (!validPassword) {
				
				return response.status(500).json({message: 'Invalid Old password'});
			} 
			else {
				
				// password hash
				user.password 	= user.hashPassword(request.body.password);
			    
			    user.save(function (error, user) {

			        if (error) {
						
						return response.status(500).json({error: error, message: 'Something went wrong.'});
					}

			        return response.status(200).json({message: 'Password has been updated.'});
			    });
			}
		}

	});
};

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Update user image
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
module.exports.updateImage = function (request, response) {

	var query = User.findByIdAndUpdate({_id: request.decode.id}, {image: request.file}, {new: true});
	
	query.exec(function (error, user) {
	    
	    if (error) {
		
			return response.status(500).json({error: error, message: 'Something went wrong'});
		}

		if (!user) {
		
			return response.status(500).json({message: 'Something went wrong'});
		}

	  	return response.status(200).json({user: user, message: 'Image has been updated' });
	    
  	});
};

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Update user image
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
module.exports.updateConfirmation = function (request, response) {

	var query = User.findById({_id: request.decode.id});
	
	query.exec(function (error, user) {
	    
	    if (error) {
		
			return response.status(500).json({error: error, message: 'Something went wrong'});
		}

		if (!user) {
		
			return response.status(500).json({message: 'Something went wrong'});
		}

		else {

			if (user.confirmation) {

				return response.status(500).json({message: 'Email already confirmed'});
			}

			user.confirmation = true;

			user.save(function (error, user) {
				
				if (error) {

					return response.status(500).json({error: error, message: 'Something went wrong'});
				}

	  			return response.status(200).json({message: 'Confirmation success' });
			})
		}	    
  	});
};

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Delete user
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
module.exports.delete = function (request, response) {

	var query = User.findById({_id: request.params.id});

	query.exec(function (error, user) {
		
		if (error) {
		
			return response.status(500).json({error: error, message: 'Something went wrong.'});
		}

		if (!user) {

			return response.status(500).json({message: 'Something went wrong.'});
		}

		else {

			if (user.role == "admin") {

				return response.status(500).json({message: 'Cannot delete an admin.'});
			}

			User.remove({_id: user._id}, function (error, user) {
				
				if (error) {
		
					return response.status(500).json({error: error, message: 'Something went wrong.'});
				}

				return response.status(200).json({message: 'User has been removed.'});
			})
		}

	});
};

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Authenticate user
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
module.exports.authenticate = function (request, response) {
	
	var query = User.findOne({email: request.body.email});

	query.exec(function (error, user) {
		
		if (error) {
			
			return response.status(500).json({error: error, message: 'Something went wrong'});
		}
		
		if (!user) {
			
			return response.status(500).json({message: 'User does not exist'});
		} 
		else {

			if (!user.confirmation) {

				return response.status(500).json({message: 'Email not confirmed.'});
			}

			else {

				var validPassword = user.comparePassword(request.body.password);

				if (!validPassword) {
					
					return response.status(500).json({message: 'Invalid password'});
				} 
				else {
					
					var token = jwt.sign({id: user.id, role: user.role}, config.tokenKey, {expiresIn: 4000});

					var newUser = user.toObject();
					delete newUser["password"];

	        		return response.status(200).json({user: newUser, token: token, message: 'Authentication successful'});
				}
			}
		}
	});
};

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Forgot password
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
module.exports.forgotPassword = function (request, response) {

	var query = User.findOne({email: request.body.email});

	query.exec(function (error, user) {

		if (error) {
			
			return response.status(500).json({error: error, message: 'Something went wrong'});
		}
		
		if (!user) {
			
			return response.status(500).json({message: 'User does not exist'});
		}

		else {
				
			var token = jwt.sign({id: user.id, role: user.role, function: 'password-reset'}, config.tokenKey, {expiresIn: 4000});

			var template = fs.readFileSync('./public/static/reset-password.html', 'utf-8');
			
			var changeTemplate = template.replace("#changeRef", ""+config.domain+"/#!/reset/password/"+token+"")
			
			var compiledTemplate = hogan.compile(changeTemplate);

			var transporter = nodemailer.createTransport({
	
			    service : 'yahoo',
			    auth : {
			 
			        user: config.emailAccount,
			        pass: config.emailPassword
			    }	
			});

			var mailOptions = {
			   
			    from 	: config.emailAccount,
			    to 		: request.body.email,
			    subject : 'Password Reset',
			    text 	: 'Click to reset password',
			    html 	: compiledTemplate.render()
			};		

			transporter.sendMail(mailOptions, function (error, info) {

				if (error) {

					return response.status(500).json({error: error, message: 'Cannot send email'});
			    }

				return response.status(200).json({message: 'Email has been sent'});
			   	
			});

		}

	});
}

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Reset user password
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
module.exports.resetPassword = function (request, response) {

	var query = User.findById({_id: request.decode.id});

	query.exec(function (error, user) {

		if (error) {
		
			return response.status(500).json({error: error, message: 'Something went wrong'});
		}

		if (!user) {
		
			return response.status(500).json({message: 'Something went wrong'});
		}
		
		else {

			var validPassword = user.comparePassword(request.body.password);

			if (validPassword) {
				
				return response.status(500).json({message: 'New password must not be same as old one.'});
			} 

			else {

				// password hash
				user.password 	= user.hashPassword(request.body.password);
			    
			    user.save(function (error, user) {

			        if (error) {
						
						return response.status(500).json({error: error, message: 'Something went wrong.'});
					}

			        return response.status(200).json({message: 'Password has been updated.'});
			    });

			}
		}
	});
};

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Authorization middleware
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Check if token is valid
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
module.exports.checkForToken = function (request, response, next) {

	var token = request.body.token || request.params.token || request.headers['token'] || undefined;

	jwt.verify(token, config.tokenKey, function (error, decode) {
		
		if (error) {

			return response.status(401).json({message: 'Unauthorized'});
		} 
		else {
			
			request.decode = decode;
			
			next();
		}
	});
};

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Check if user is an admin
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
module.exports.checkIfAdmin = function (request, response, next) {

	if (request.decode.role == 'admin') {

		next();
	} 
	else {

		return response.status(401).json({message: 'Unauthorized'});
	}
};

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Check if user is an asset
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
module.exports.checkIfAsset = function (request, response, next) {

	if (request.decode.role == 'asset') {

		next();
	} 
	else {

		return response.status(401).json({message: 'Unauthorized'});
	}
};

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Check if token is valid
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
module.exports.checkForTokenPasswordReset = function (request, response, next) {

	if (request.decode.function == 'password-reset') {

		next();
	} 
	else {

		return response.status(401).json({message: 'Unauthorized'});
	}
};