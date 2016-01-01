// Creating new todos

var express = require('express');

// It is an express middleware
var bodyParser = require('body-parser');

var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1; 

// It is a middleware and we are using it
app.use(bodyParser.json());


app.get('/', function (req, res) {
	res.send('Todo API Root');
});

app.get('/todos', function (req, res){
	res.json(todos);
});

app.get('/todos/:id', function (req, res){

	var todoId = parseInt(req.params.id);
	var matchedTodo;

	todos.forEach(function(todo){
		if(todo.id === todoId){
			matchedTodo = todo;
		}
	});

	if(matchedTodo){
		res.json(matchedTodo);
	}else{
		res.status(404).send();
	}

});

// POST /todos
// post can take data with the request
// npm install body-parser@1.13.3 --save
app.post('/todos', function (req, res){

	var body = req.body;
	body.id = todoNextId;
	todoNextId++;
	todos.push(body);
	res.json(body);
});

app.listen(PORT, function(){
	console.log('Server Running!');
});