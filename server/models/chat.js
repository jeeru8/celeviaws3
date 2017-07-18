//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Dependencies
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
var mongoose 	= require('mongoose');

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Set moongose schema
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
var Schema 		= mongoose.Schema;

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Set image schema
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
var imageSchema = new mongoose.Schema({

	size			: {type: Number},
	path			: {type: String},
	filename 		: {type: String},
	destination		: {type: String},
	mimetype		: {type: String},
	encoding		: {type: String},
	originalname 	: {type: String},
	fieldname		: {type: String}

}, { _id : false });

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Set message schema
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
var messageSchema = new mongoose.Schema({
    
	string 	: {type: String, required: true},
	
	date 	: {type: Date, default: Date.now},
	
	user  	: {type: Schema.Types.ObjectId, ref: 'User', required: true},

	status 	: {type: String, required: true, default: "unread", enum: ['read', 'unread']},

	image 	: {type: imageSchema}

}, { _id : false });


//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Set chat schema
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
var chatSchema = new mongoose.Schema({

	// users 		: [{type: Schema.Types.ObjectId, ref: 'User'}], {type: [{type: Schema.Types.ObjectId, ref: 'User'}], required: true, unique: true},

    roomid      : {type: String, unique: true, required: true},

	users 		: {type: [{type: Schema.Types.ObjectId, ref: 'User'}], required: true},

	messages 	: [messageSchema]
});

module.exports = mongoose.model('Chat', chatSchema);










