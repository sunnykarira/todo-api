var cryptojs= require('crypto-js');
module.exports = function(db){
	//We need configuration data

	return {
		requireAuthentication: function(req, res, next){

			// If req.get('Auth') doesn't exist then we can
			// set it to empty string so the db.token.findOne
			// cannot return anything from database
			var token = req.get('Auth') || "";

			db.token.findOne({
				where: {
					tokenHash: cryptojs.MD5(token).toString()
				}
			}).then(function(tokenInstance){
				if(!tokenInstance){
					throw new Error();
				}

				req.token = tokenInstance;
				return db.user.findByToken(token)
				.then(function(user){
					req.user = user;
					next();
				});
			}).catch(function(){
				res.status(401).send();
			});

			// db.user.findByToken(token).then(function(user){

			// 	req.user = user;
			// 	next();
			// }, function(){
			// 	res.status(401).send();
			// });
		}
	};
};