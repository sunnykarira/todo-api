// Creating new todos

var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1;


app.get('/', function (req, res) {
	res.send('Todo API Root');
});

app.get('/todos', function (req, res){
	res.send(todos);
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

app.listen(PORT, function(){
	console.log('Server Running!');
})