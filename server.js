var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;

var _ = require('underscore');
var bodyParser = require('body-parser');
var todos = [];
var todoNextId = 1;

app.use(bodyParser.json());

app.get('/todos', function (req, res) {
		res.json(todos);
});

app.get('/todos/:id', function (req, res){

	var todoId = parseInt(req.parseInt.id);
	var matchedId = _.findWhere(todos, {id: todoId});

	if(!matchedId){
		return res.status(404).json({"error":"No todo found at that id"});
	}

	res.json(matchedId);
});

app.post('/todos', function (req, res){

	var body = _.pick(req.body, 'description', 'completed');

	if(!_.isBoolean  (body.completed) || !_.isString (body.description)  || body.description.trim().length  === 0){
		return res.status(400);
	}

	body.description = body.description.trim();
	body.id = todoNextId++;
	todos.push(body);
	res.json(body);
});

app.delete('/todos/:id', function (req, res){
	var todoId = parseInt(req.params.id, 10);
	var matchedId = _.findWhere(todos, {id: todoId});

	if(!matchedId){
		return res.status(404).json({"error": "No todo found at that id"});
	}

	todos = _.without(todos, matchedId);
	res.json(matchedId);
});

// PUT (UPDATE) /todos/:id

app.put('todos/:id', function (req, res){

	var body = _.pick(req.body, 'description', 'completed');
	var todoId = parseInt(req.params.id, 10);
	var matchedTodo = _.findWhere(todos, {id: todoId});
	
	// Object to store valid attributes.
	var validAttributes = {};

	if(!matchedTodo){
		return res.status(404).send();
	}

	// This return true or false if it present or not
	//body.hasOwnProperty('completed');

	if(body.hasOwnProperty('completed') && _.isBoolean(body.completed)){
		validAttributes.completed = body.completed;
	} else if(body.hasOwnProperty('completed')){
			// Bad request
			return res.status(400).send();
	}

	if(body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0){
		validAttributes.description = body.description;

	}else if(body.hasOwnProperty('description')){

		return res.status(400).send();
	}

	// HERE things went right
	// body = validAttributes;
	// body.id = parseInt(req.params.id, 10);

	// _.extent overwrite the properties.
	//Objects are passed by reference not by value
	_.extend(matchedTodo, validAttributes);		
	res.json(matchedTodo);

});

app.listen(PORT, function(){
	console.log("Server Running!");
});