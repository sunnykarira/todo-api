var Sequelize = require('sequelize');

// Environment for node if run in heroku or computer
var env = process.env.NODE_ENV || 'development';

var sequelize;

if (env === 'production') {
	sequelize = new Sequelize(process.env.DATABASE_URL, {
		dialect: 'postgres'
	});
} else {
	var sequelize = new Sequelize(undefined, undefined, undefined, {

		dialect: 'sqlite',
		storage: __dirname + '/data/dev-todo-api.sqlite'
	});


}

var db = {};

// Lets you load models from external files
db.todo = sequelize.import(__dirname + '/models/todo.js');
// Takes in file path.
db.user = sequelize.import(__dirname + '/models/user.js');
db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.todo.belongsTo(db.user);
db.user.hasMany(db.todo);

module.exports = db;