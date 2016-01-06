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
 });

};