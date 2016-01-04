var Sequelize = require('sequelize');

// Instance of the database
var sequelize = new Sequelize(undefined, undefined, undefined, {
	//Which database
	// Where to store
	'dialect': 'sqlite',

	// Saving into playground folder
	'storage': __dirname + '/basic-sqlite-database.sqlite'
});

//Model of todo
var Todo = sequelize.define('todo', {
	description: {
		type: Sequelize.STRING,
		// user can't create todo with no description
		allowNull: false,
		validate: {
			// Prevent empty string from entering from
			// valid todos
			// notEmpty: true

			// See sequelize docs on user/Validate for len
			len: [1, 250]
		}
	},
	completed: {
		type: Sequelize.BOOLEAN,
		allowNull: false,
		defaultValue: false
	}
});


//sequlize.sync() returns a promise 
// Manage our data as JS objects and arrays and
//	convert into sqlite calls to database
// Works across multiple databases.
// force: true deletes all tables in the database
// recreate them
// sequelize.sync({force: true}).then(function(){
// 	console.log('Everything is synced');

// 	// Creating new Todo item
// 	// Returns a promise
// 	Todo.create({
// 		description: "Walk the dog",
// 		completed: false
// 	}).then(function(todo){
// 		return Todo.create({
// 			description: 'yoyo honey singh'
// 		}).then(function(){

// 			return Todo.findById(2);
// 		}).then(function(todo){

// 			if(todo){
// 				console.log(todo.toJSON());
// 			}else{
// 				console.log('No todo Found');
// 			}
// 		});
// 	}).catch(function(e){
// 		console.log(e);
// 	});
// });

// Another way to fetch items

// sequelize.sync({force: true}).then(function() {
// 	console.log('Everything is synced');

// 	Todo.create({
// 		description: 'yoyo1'
// 	}).then(function(todo) {
// 		return Todo.create({
// 			description: 'yoyo2'
// 		}).then(function() {
// 			//return Todo.findById(2);

// 			return Todo.findAll({
// 				where: {
// 					completed: false,

// 					//Checking for word yo in description
// 					description: {
// 						$like : "%yo%"
// 						// Capitalization is not important
// 					}
// 				}
// 			});

// 		}).then(function(todos) {

// 			if (todos) {

// 				todos.forEach(function(todo){
// 					console.log(todo.toJSON());
// 				});

// 			} else {
// 				console.log('No todo found');
// 			}
// 		});
// 	}).catch(function(e) {
// 		console.log(e);
// 	});
// });

// Challenge
// Fetch todo item by its id
console.log('Challenge');

sequelize.sync({force: true}).then(function(){
	console.log('Everything is synced');

	return Todo.create({
		description: 'yoyo1'
	}).then(function(todo){
		return Todo.create({
			description: 'yoyo2'
		}).then(function(){

			// one todo
			return Todo.findById(1);

			
		}).then(function(todo){

			if(todo){
				console.log(todo.toJSON());
			}else{
				console.log('Todo not found');
			}
		});
	})
});
