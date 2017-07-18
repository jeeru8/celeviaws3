module.exports = {
	port 			: process.env.PORT || 8080,
	//database 		: 'mongodb://localhost:27017/celevi',
	database 		: 'mongodb://admin:passw0rd@ds032340.mlab.com:32340/celevi',
	//domain			: 'localhost:8080//',
	domain  	 	: 'http://www.celevi.com',
	tokenKey 		: 'celevi-key',
	cryptoAlgorithm	: 'aes-256-ctr',
	cryptoPassword 	: 'd6F3Efeq',
	cryptometa		: 'utf8',
	emailAccount	: 'celeviemail@yahoo.com',
	emailPassword	: 'P@ssw0rdpassword'
}

// module.exports = {
// 	port 			: process.env.PORT || 8080,
// 	database 		: 'mongodb://127.0.0.1:27017/celevi-v2',
// 	domain 	 	  	: 'http://localhost:8080',
// 	tokenKey 		: 'celevi-key',
// 	cryptoAlgorithm	: 'aes-256-ctr',
// 	cryptoPassword 	: 'd6F3Efeq',
// 	cryptometa		: 'utf8',
// 	emailAccount	: 'celeviemail@gmail.com',
// 	emailPassword	: 'P@ssw0rdpassword'
// }