var bcrypt = require('bcrypt');
var _ = require('underscore');

module.exports = function(sequelize, DataTypes) {

	return sequelize.define('user', {
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true, // Makes sure there is no other value in
			// database with same email.
			validate: {
				isEmail: true
					// Checks for Email stuff
			}
		},
		salt: {
			type: DataTypes.STRING
				// If two people passwords are same then it 
				// save collisions.
		},
		password_hash: {
			type: DataTypes.STRING
		},
		password: {
			type: DataTypes.VIRTUAL,
			// VIRTUAL doesn't get strored in database 
			// but it is accessible.
			allowNull: false,
			validate: {
				len: [7, 100] // See validate RE (document)
			},
			// Set is called with password value
			set: function(value) {
				var salt = bcrypt.genSaltSync(10);
				// Takes in no. of characters for salt
				var hashedPassword = bcrypt.hashSync(value, salt);
				// Takes 2 arguments actual value and salt(characters added)

				// Logging user in using password
				this.setDataValue('password', value);
				this.setDataValue('salt', salt);
				this.setDataValue('password_hash', hashedPassword);
			}
		}
	}, {

		hooks: {
			beforeValidate: function(user, options) {

				if (typeof user.email === 'string') {
					user.email = user.email.toLowerCase();
				}
			}
		},

		// Sequelize Hooks
		// It lets you run a code before or after an event has happened.
		// Just like triggers.
		instanceMethods: {
			toPublicJSON: function() {
				var json = this.toJSON();
				return _.pick(json, 'id', 'email', 'updatedAt', 'createdAt');
			}
		}
	});

};