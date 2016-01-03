// 12. Searching by todo description

var express = require('express');
var app = express();

var PORT = process.env.PORT || 3000;
var bodyParser = require('body-parser');
var _ = require('underscore');
var todos = [];
var todoNextId = 1;

app.use(bodyParser.json());

app.get('/', function(req, res){
	res.send('Todo API Root');
});

// Querying on completed tasks
// GET /todos/completed=true&q=work
// GET /todos/completed=false&q=work
app.get('/todos', function(req, res){

	var queryParams = req.query;
	// We will get back a string not a boolean in completed
	// in queryParams
	var filteredTodos = todos;

	// if hasOwnproperty && completed === true
	if(queryParams.hasOwnProperty('completed') && queryParams.completed === 'true'){
		filteredTodos = _.where(filteredTodos, {completed: true});
	}else if(queryParams.hasOwnProperty('completed') && queryParams.completed === 'false'){
		filteredTodos = _.where(filteredTodos, {completed: false});
	}

	//_.filter takes array and function (that returns true or false)
	// toLowerCase because w and W were not querying the same. 
	if(queryParams.hasOwnProperty('q') && queryParams.q.trim().length > 0){
		filteredTodos = _.filter(filteredTodos, function(todo) {
			return todo.description.toLowerCase().indexOf(queryParams.q.toLowerCase()) > -1;
		});
	}

	res.json(filteredTodos);
});

app.get('/todos/:id', function(req, res){
	var todoId = parseInt(req.params.id);
	var matchedTodo = _.findWhere(todos, {id: todoId});

	// todos.forEach(function(todo){
	// 	if(todoId = todo.id){
	// 		matchedTodo = todo;
	// 	}
	// });

	if(!matchedTodo){
		return res.status(404).send({"error" : "todo not found"});
	}

	res.json(matchedTodo);
});

app.delete('/todos/:id', function(req, res){

	var todoId = parseInt(req.params.id);
	var matchedTodo = _.findWhere(todos, {id: todoId});

	if(!matchedTodo){
		return res.status(404).send({"error": "todo not found"});
	}

	todos = _.without(todos, matchedTodo);
	res.json(todos);
});

app.post('/todos', function(req, res){
	
	var body  = _.pick(req.body, 'description', 'completed');

	if(!_.isString(body.description) && !_.isBoolean(body.completed) && body.description.trim().length === 0){
		return res.status(400).send({"error" : "invalid request"});
	} 

	body.description = body.description.trim();
	body.id = todoNextId++;
	todos.push(body);
	res.json(body);

});

app.put('/todos/:id', function(req, res){

	var todoId = parseInt(req.params.id);
	var matchedTodo = _.findWhere(todos, {id: todoId});

	var body = _.pick(req.body, 'completed');
	var validAttributes = {};

	if(_.isBoolean(body.completed) && body.hasOwnproperty(completed)){
		validAttributes.completed = body.completed;
	}else{
		return res.status(400);
	}

	
	_.extend(matchedTodo, validAttributes);
	res.json(matchedTodo);
});


app.listen(PORT, function(){
	console.log('Server Running at ' + PORT);
});