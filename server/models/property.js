var mongoose 	= require('mongoose');
var Schema 		= mongoose.Schema;

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//Set image schema
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
//Set address schema
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
var addressSchema = new mongoose.Schema({

	street			: {type: String},
	buildingName	: {type: String},
	unitNumber 		: {type: String},
	zipcode		 	: {type: Number},
	district		: {type: String}

} ,{ _id : false });

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//Set coordinates schema
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
var coordinatesSchema = new mongoose.Schema({

	latitude	: {type: Number},
	longitude	: {type: Number}

}, { _id : false });

var propertyType = [

	'Private Office', 
	'Private Desk', 
	'Shared Desk', 
	'Shop House', 
	'Push Cart', 
	'Popup Space', 
	'Hawker', 
	'B1 Office', 
	'Industrial'
];

var propertyUseClasses = [
					
	'Class 1 - Shop', 
	'Class 2 - Office', 
	'Class 3 - Restaurant', 
	'Class 4 - Amusement Centre', 
	'Class 5 - Motor Vehicle Showroom', 
	'Class 6 - Theatre', 
	'Class 7 - Light and Industrial Building', 
	'Class 8 - General Industrial Building', 
	'Class 9 - Special Industrial Building', 
	'Class 10 - Warehouse', 
	'Class 11 - Convalescent House', 
	'Class 12 - Child Care Centre', 
	'Class 13 - Community Building', 
	'Class 14 - Sports and Recreational Building', 
	'Class 15 - Nightclub',
	'Class 16 - Pet Shop', 
	'Class 17 - Community Sports and Fitness Building',
	'Class 18 - Commercial School'
];

var propertyUniqueFeatures = [

	'Private Office', 
	'Private Desk', 
	'Shared Desk', 
	'Shop House', 
	'Push Cart', 
	'Popup Space', 
	'Hawker', 
	'B1 Office', 
	'Industrial'
];

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//Set property schema
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
var propertySchema = new mongoose.Schema({

	types 			: [{type: String, required: true, enum: propertyType}],
	useClasses 		: [{type: String, required: true, enum: propertyUseClasses}],
    uniqueFeatures 	: [{type: String, required: true, enum: propertyUniqueFeatures}],

    name			: {type: String, required: true},

    condition		: {type: String},
    description 	: {type: String},

    price			: {type: Number},
    area			: {type: Number},
    completeness 	: {type: Number},

    sale			: {type: Boolean, default: false},
    lease			: {type: Boolean, default: false},

    category 		: {type: String, enum: ['For sale', 'For lease']},
    
    dateAvailable	: {type: Date},
    tenure			: {type: Date},
    leaseTerm		: {type: Date},

    numberOfViewsPerWeek	: {type: Number, default: 0},
    numberOfViewsSincePost 	: {type: Number, default: 0},

    
	
    coordinates		: {type: coordinatesSchema},
    address 		: {type: addressSchema},
    images			: [imageSchema],

    owner			: {type: Schema.Types.ObjectId, ref: 'User', required: true},
  	
});

module.exports = mongoose.model('Property', propertySchema);

//numberOfViews	: {type: Number, default: 0},
    //numberOfInquiries : {type: Number, default: 0},
    //views			: [{user: {type: Schema.Types.ObjectId, ref: 'User'}, date: {type: Date, default: Date.now}, number: {type: Number, default: 1}}],
    //inquiries		: [{user: {type: Schema.Types.ObjectId, ref: 'User'}, date: {type: Date, default: Date.now}, number: {type: Number, default: 1}}],
    