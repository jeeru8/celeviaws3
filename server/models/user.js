//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Dependencies
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
var mongoose 	= require('mongoose');
var bcrypt 		= require('bcrypt-nodejs');

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//Set moongose schema
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
// Set company schema
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
var companySchema = new mongoose.Schema({

	name			: {type: String},
	unitNumber		: {type: Number},
	zipcode 		: {type: Number}

}, { _id : false });

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Set user schema
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
var userSchema = new mongoose.Schema({

  	email 				: {type: String, unique: true, required: true},
	
	firstName 			: {type: String, required: true},
	lastName 			: {type: String, required: true},
	password 			: {type: String, required: true},

    contactNumber 		: [{type: Number}],

    ceaNumber			: {type: String},
    licenseNumber		: {type: String},
    newsSubscription	: {type: String},
    billingInfo 		: {type: String},
    
    agent				: {type: Boolean, default: false},
    confirmation		: {type: Boolean, default: false},

	role				: {type: String, required: true, enum: ['admin', 'asset']},

    company				: {type: companySchema},
    image				: {type: imageSchema}
});

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Compare password to the hash
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
userSchema.methods.comparePassword = function (password) {

	if (password == null || password == "") {

		return false;
	}
	
	var user = this;
	
	return bcrypt.compareSync(password, user.password);
}

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Hash password
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
userSchema.methods.hashPassword = function (password) {

	if (password == null || password == "") {

		return null;
	}

	return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
}

module.exports = mongoose.model('User', userSchema);