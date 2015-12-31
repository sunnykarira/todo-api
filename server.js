 /* Basic Express Server */
// var express = require('express');
// var app = express();

// var PORT = process.env.PORT || 3000;

// app.get('/', function(req, res){
// 	res.send('Todo API Root');
// });

// app.listen(PORT, function(){
// 	console.log('Express listening on port ' + PORT + '!');
// });


/* Getting all todos */

// var express = require('express');
// var app = express();
// var PORT = process.env.PORT || 3000;
// // All the todos will have description and completed.
// // Multiple todo item is called todo collection.
// var todos = [{
// 	description: 'Meet for lunch',
// 	completed: false,
// 	id: 1
// }, {
// 	description: 'Go to market',
// 	id: 2,
// 	completed: false
// }];

// app.get('/', function(req, res){
// 	res.send('Todo API Root');
// });

// // GET request /todos

// app.get('/todos', function(req, res){
// 	// res.json converts to json automatically
// 	// no need of json.stringify
// 	res.json(todos);
// });

// //GET individual todos  /todos/:id


// app.listen(PORT, function(){
// 	console.log('Express server listening at ' + PORT);
// });

// Challenge
var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;
var todos =  [{
	id: 1,
	description: 'yoyo 1',
	completed:  false
}, {
	id: 2,
	description: 'yoyo 2',
	completed: false
},{
	id: 3,
	description: 'yoyo 3',
	completed: true
}];


app.get('/', function(req, res){
	res.send('Todo API Root');
});

// GET /todos
app.get('/todos', function(req, res){
	res.json(todos);
});

//GET /todos/:id
app.get('/todos/:id', function(req, res){
	//res.send('Asking for todo with id of ' + req.params.id);

	// Now searching for id and then sending the json data
	// id is string, params are always string
	var todoId = parseInt(req.params.id, 10);
	// converts string to number with base
	var mathchedTodo;

	todos.forEach(function(todo){
		if(todoId === todo.id){
			mathchedTodo = todo;
		}
	});

	if(mathchedTodo){
		res.json(mathchedTodo);
	}else{
		res.status(404).send();
	}
});

app.listen(PORT, function(){
	console.log('Server running!');
});