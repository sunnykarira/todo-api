var express = require('express');
var app = express();

var bodyParser = require('body-parser');
var PORT = process.env.PORT || 3000;
var _ = require('underscore');
var todos = [];
var todoNextId = 1;

app.use(bodyParser.json());

app.get('/', function (req, res){
	res.send('Todo API Root');
});

app.get('/todos', function (req, res){

	res.json(todos);
});

app.get('/todos/:id', function (req, res){

	var todoId = parseInt(req.params.id);
	var matchedTodo = _.findWhere(todos, {id: todoId});

	res.json(matchedTodo);

});

app.post('/todos', function(req, res){

	// Use _.pick to only pick description and completed
	// and leave all extra data
	var body = _.pick(req.body, 'description', 'completed');

	if(!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0){
		return res.status(400).send();
	}

	// set body.description to trimmed value
	body.description = body.description.trim();

	body.id = todoNextId++;
	todos.push(body);
	res.json(body);
});

// DELETE /todos/:id

app.delete('/todos/:id', function(req, res){
	var todoId = parseInt(req.params.id, 10);
	var matchedTodo = _.findWhere(todos, {id: todoId});

	if(!matchedTodo){
		return res.status(404).json({"error": "No todo found with that id"});
	}

	// delete the matched item from todos array
	todos = _.without(todos, matchedTodo);
	res.json(matchedTodo);
});

app.listen(PORT, function(){
	console.log('Server running! ');
});