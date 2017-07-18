//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Dependencies
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Get the configuration
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
var config = require('../../config');

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Get the property model
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
var Property = require('../models/property');

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Create property
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
module.exports.create = function (request, response) {
	
	var property = new Property();

    property.types 			= request.body.types;
	property.useClasses 	= request.body.useClasses;
    property.uniqueFeatures = request.body.uniqueFeatures;

    property.name			= request.body.name;
    property.condition		= request.body.condition;
    property.description 	= request.body.description;

    property.price			= request.body.price;
    property.area			= request.body.area;
    property.completeness 	= request.body.completeness;

    property.sale 			= request.body.sale;
    property.lease 			= request.body.lease;
    property.category 		= request.body.category;

    property.dateAvailable	= request.body.dateAvailable;
    property.tenure			= request.body.tenure;
    property.leaseTerm		= request.body.leaseTerm;

    property.coordinates 	= request.body.coordinates;
    property.address 		= request.body.address;

    property.images 		= request.files;

    property.owner 			= request.decode.id;

    if (request.body.category == 'For sale') {

    	property.sale = true;
    }
    else if (request.body.category == 'For lease') {

    	property.lease = true;
    }

	property.save(function (error, property) {
    
        if (error) {
			
			return response.status(500).json({error: error, message: 'Something went wrong.'});
		}

        return response.status(200).json({property: property, message: 'Successfully created property.'});
    });
};

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Read property individually
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
module.exports.read = function (request, response) {
	
	var query = Property.findById({_id: request.params.id}).populate('owner');

	query.exec(function (error, property) {
		
		if (error){
			return response.status(500).json({error: error, message: 'Something went wrong.'});
		}

		if (!property) {
		
			return response.status(500).json({message: 'Property not found in the database.'});
		}
		else{
			//this is function is to check if the viewer is not the owner
			//then itirate the numberOfViewsSincePost and numberOfViewsPerWeek
			//otherwise do nothing
			//if(property.owner != ){
				property.numberOfViewsPerWeek = property.numberOfViewsPerWeek + 1 ;
				property.numberOfViewsSincePost = property.numberOfViewsSincePost + 1;

				property.save(property);
			//}

			return response.status(200).json({property: property, message: 'Successfully fetched property.'});
		}

	});
};

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Read all properties
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
module.exports.readAll = function (request, response) {
	
	var query = Property.find({}).populate('owner', 'id role lastName firstName email confirmation agent contactNumber');

	query.exec(function (error, properties) {
		
		if (error) {
		
			return response.status(500).json({error: error, message: 'Something went wrong.'});
		}

		if (properties.length == 0) {
		
			return response.status(500).json({message: 'No property registered'});
		}

		response.json({properties: properties, message: 'Successfully fetched all properties.'});
	});
};

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Read all properties by owner
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
module.exports.readByOwner = function (request, response) {
	
	var query = Property.find({owner: request.decode.id});

	query.exec(function (error, properties) {
		
		if (error) {
		
			return response.status(500).json({error: error, message: 'Something went wrong.'});
		}

		if (properties.length == 0) {
		
			return response.status(500).json({message: 'No property registered.'});
		}

		//console.log(properties);

		return response.status(200).json({properties: properties, message: 'Successfully fetched all properties.'});
	});
};

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Read all properties by category
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
module.exports.readByCategory = function (request, response) {

	var search = { $and: [], $or: [] };

	if (request.body.keywords) {

		var keywords = request.body.keywords

		search.$or.push({ 
    		
			name: {'$regex' : keywords, '$options' : 'i'}
		},{ 
    		
			description: {'$regex' : keywords, '$options' : 'i'}
		},{ 
    		
			condition: {'$regex' : keywords, '$options' : 'i'}
		},{ 
    		
			'address.street': {'$regex' : keywords, '$options' : 'i'}
		},{ 
    		
			'address.buildingName': {'$regex' : keywords, '$options' : 'i'}
		},{ 
    		
			'address.unitNumber': {'$regex' : keywords, '$options' : 'i'}
		},{ 
    		
			'address.district': {'$regex' : keywords, '$options' : 'i'}
		});	

		if (Number(keywords)) {

			search.$or.push({ 
	    		
				'address.zipcode': Number(keywords)
			});	
		}

	}

	if (request.body.category) {

		search.$and.push({ 
    		
			category: request.body.category
		});	
	}

	if (request.body.price) {

		if (request.body.price.length == 1) {

			search.$and.push({ 
    		
	    		price: {$gte: request.body.price[0]}
			});

		}
		else {

			search.$and.push({ 
    		
	    		price: {$gte: request.body.price[0], $lte: request.body.price[1]}
			});
		}
	}

	if (request.body.area) {

		if (request.body.area.length == 1) {

			search.$and.push({ 
    		
				area: {$gte: request.body.area[0]}	
			});
		}
		else {

			search.$and.push({ 
    		
				area: {$gte: request.body.area[0], $lte: request.body.area[1]}	
			});
		}
	}

	if (request.body.types) {

		if (Object.keys(request.body.types).length != 0) {

			search.$and.push({ 
    		
	    		types: {$in: request.body.types}
			});
		}
	}

	//console.log(search);

	if (search.$and.length == 0) {

		delete search.$and;
	}

	if (search.$or.length == 0) {

		delete search.$or;
	}

	var query = Property.find(search).populate('owner');

	query.exec(function (error, properties) {
		
		if (error) {
		
			return response.status(500).json({error: error, message: 'Something went wrong.'});
		}

		if (properties.length == 0) {
		
			return response.status(500).json({message: 'No property registered.'});
			
		}

		return response.status(200).json({properties: properties, message: 'Successfully fetched all properties.'});
	});
};

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Update property basic information
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
module.exports.update = function (request, response) {

	var query = Property.findOne({_id: request.params.id, owner: request.decode.id});

	query.exec(function (error, property) {

		if (error) {
			return response.status(500).send({error: error, message: 'Something went wrong'});
		}

		if (!property) {
			return response.status(500).send({message: 'Something went wrong'});
		}

	    property.types 			= request.body.types 			|| property.types;
		property.useClasses 	= request.body.useClasses 		|| property.useClasses;
	    property.uniqueFeatures = request.body.uniqueFeatures 	|| property.uniqueFeatures;

	    property.name			= request.body.name 			|| property.name;
	    property.condition		= request.body.condition 		|| property.condition;
	    property.description 	= request.body.description 		|| property.description;
		 
	    property.price			= request.body.price 			|| property.price;
	    property.area			= request.body.area 			|| property.area;
	    property.completeness 	= request.body.completeness		|| property.completeness;

	    property.sale 			= request.body.sale 			|| property.sale;
	    property.lease 			= request.body.lease 			|| property.lease;
	    property.category 		= request.body.category 		|| property.category;

	    property.dateAvailable	= request.body.dateAvailable 	|| property.dateAvailable;
	    property.tenure			= request.body.tenure 			|| property.tenure;
	    property.leaseTerm		= request.body.leaseTerm 		|| property.leaseTerm;

	    property.coordinates 	= request.body.coordinates 		|| property.coordinates;
	    property.address 		= request.body.address 			|| property.address;

	    property.images.push(request.files);

	    if (request.body.category == 'For sale') {
	    	property.sale = true;
	    }
	    else if (request.body.category == 'For lease') {
	    	property.lease = true;
	    }
    	
	    // property.images 		= request.files 				|| property.images;

	    property.save(function (error, property) {
    
	        if (error) {
				
				return response.status(500).json({error: error, message: 'Something went wrong.'});
			}

	        return response.status(200).json({property: property, message: 'Property has been updated.'});
	    });
	});
};



//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Update property views
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
/*module.exports.updateViews = function (request, response) {

	var query = Property.findOne({_id: request.params.id});

	query.exec(function (error, property) {

		if (error) {
		
			return response.status(500).send({error: error, message: 'Something went wrong'});
		}

		if (!property) {
		
			return response.status(500).send({message: 'Something went wrong'});
		}

		var picked = property.views.find(function (element, ind, array) {
				
			if (String(element.user) == String(request.decode.id)) {

				console.log((Date.now()-element.date)/604800000);

				if ((Date.now()-element.date) >= 604800000) {

					element.date = Date.now();

					element.number = element.number + 1;

					property.numberOfViews = property.numberOfViews + 1;
				}

				return element;
			}
		});

		if (!picked) {

			property.numberOfViews = property.numberOfViews + 1;

			property.views.push({user: request.decode.id});
		}

	    property.save(function (error, property) {
    
	        if (error) {
				
				return response.status(500).json({error: error, message: 'Something went wrong.'});
			}

	        return response.status(200).json({message: 'Property has been updated.'});
	    });
	});
};*/

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Update property inquiries
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
/*module.exports.updateInquiries = function (request, response) {

	var query = Property.findOne({_id: request.params.id});

	query.exec(function (error, property) {

		if (error) {
		
			return response.status(500).send({error: error, message: 'Something went wrong'});
		}

		if (!property) {
		
			return response.status(500).send({message: 'Something went wrong'});
		}

		property.inquiries.push({user: request.decode.id});

	    property.save(function (error, property) {
    
	        if (error) {
				
				return response.status(500).json({error: error, message: 'Something went wrong.'});
			}

	        return response.status(200).json({message: 'Property has been updated.'});
	    });
	});
};*/



//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Delete property
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
module.exports.delete = function (request, response) {

	var query = Property.findOneAndRemove({_id: request.params.id, owner: request.decode.id});

	query.exec(function (error, property) {
		
		if (error) {
		
			return response.status(500).json({error: error, message: 'Something went wrong.'});
		}

		if (!property) {

			return response.status(500).json({message: 'Something went wrong.'});
		}

		return response.status(200).json({message: 'Property has been removed.'});
	});
};


//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// reset to 0 all views this week in all property
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
module.exports.resetView = function() {

	Property.update({}, {'$set': {'numberOfViewsPerWeek' : 0}}, {multi: true}, function(error, properties){

		if(error){
			console.log(error);
		}

		if(!properties){
			console.log('Something went wrong');
		}

		console.log('success update view');
	});
 

}
