module.exports = function (sequelize, DataTypes) {
	
 return sequelize.define('user', {
 	email: {
 		type: DataTypes.STRING,
 		allowNull: false,
 		unique: true,  // Makes sure there is no other value in
 		// database with same email.
 		validate: {
 			isEmail: true
 			// Checks for Email stuff
 		}
 	},
 	password: {
 		type: DataTypes.STRING,
 		allowNull: false,
 		validate: {
 			len: [7, 100] // See validate RE (document)
 		}
 	}
 }, {

 	hooks: {
 		beforeValidate: function(user, options){

 			if(typeof user.email === 'string'){
 				user.email = user.email.toLowerCase();
 			}
 		}
 	}
 });

};



// Sequelize Hooks
// It lets you run a code before or after an event has happened.
// Just like triggers.