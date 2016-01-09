var Sequelize = require('sequelize');

var sequelize = new Sequelize(undefined, undefined, undefined, {
	'dialect': 'sqlite',
	'storage': __dirname + '/basic-sqlite-database.sqlite'
});


var Todo = sequelize.define('todo', {
	description: {
		allowNull: false,
		type: Sequelize.STRING,
		validate: {
			len: [1, 250]
		}
	},
	completed: {
		type: Sequelize.BOOLEAN,
		allowNull: false,
		defaultValue: false
	}
});

var User = sequelize.define('user',{
	email: Sequelize.STRING
});


Todo.belongsTo(User);
User.hasMany(Todo);
// Creates foreign key in database
// in other table

sequelize.sync().then(function(){
		console.log('Everything is synced');

		// Creatinf todo using user

		// User.create({
		// 	email: 'sunny@gmail.com'
		// }).then(function(){

		// 	return Todo.create({
		// 		description: 'Clean yard'
		// 	});

		// }).then(function(todo){

		// 	User.findById(1).then(function(user){
		// 		user.addTodo(todo);
		// 	});
		// });

	
		// Finding all todos of User

		// User.findById(1).then(function(user){
		// 	user.getTodos().then(function(todos){

		// 		todos.forEach(function(todo){
		// 			console.log(todo.toJSON());
		// 		});
		// 	})
		// })


	// Filtering todos on the basis of true and flase

		User.findById(1).then(function(user){
			user.getTodos({
				where: {
					completed: false
				}
			}).then(function(todos){
					
				console.log(todos);
			});
		});

	});