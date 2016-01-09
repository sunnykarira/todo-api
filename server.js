var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var db = require('./db.js');
var middleware = require('./middleware.js')(db);
// Because we need to pass in database
var bcrypt = require('bcrypt');

var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1;

app.use(bodyParser.json());

app.get('/', function(req, res) {
	res.send('Todo API Root');
});

// Querying on completed tasks
// GET /todos/completed=true&q=work
// GET /todos/completed=false&q=work
app.get('/todos', middleware.requireAuthentication ,function(req, res) {

	var query = req.query;
	var where = {}; //req.user.get('id');

	if (query.hasOwnProperty('completed') && query.completed === 'true') {
		where.completed = true;
	} else if (query.hasOwnProperty('completed') && query.completed === 'false') {
		where.completed = false;
	}

	if (query.hasOwnProperty('q') && query.q.length > 0) {
		where.description = {
			$like: "%" + query.q + "%"
		}
	}

	where.userId = req.user.get('id');

	db.todo.findAll({
		where: where
	}).then(function(todos) {

		res.json(todos);
	}).catch(function(e) {
		res.status(500).send();
	});
});

app.get('/todos/:id', middleware.requireAuthentication, function(req, res) {
	var todoId = parseInt(req.params.id);

	// Query via db
	db.todo.findOne({
		where: {
			id: todoId,
			userId: req.user.get('id')
		}
	}).then(function(todo) {
		// Converting an object to true or false
		if (!!todo) {
			res.json(todo.toJSON());
		} else {
			res.status(400).json({
				"error": "No todo found at this id"
			});
		}
	}).catch(function(e) {
		// Internal sever error
		res.send(500).send();
	});

});

app.delete('/todos/:id', middleware.requireAuthentication, function(req, res) {

	var todoId = parseInt(req.params.id);
	db.todo.destroy({
		where: {
			id: todoId,
			userId: req.user.get('id')
		}
	}).then(function(rowsDeleted) {
		if (rowsDeleted === 0) {
			res.status(404).json({
				"error": "todo not found with id"
			});
		} else {
			// Everything went well and nothing  (data) is coming back
			res.status(204).send();
		}

	});

});

app.post('/todos', middleware.requireAuthentication, function(req, res) {

	var body = _.pick(req.body, 'description', 'completed');

	// call create on db.todo
	// respond to api caller 
	// e

	db.todo.create(body).then(function(todo) {
		//res.json(todo.toJSON());
		req.user.addTodo(todo).then(function(){

			// This updates the todo which is on req
			//and put it in database
			return todo.reload();
		}).then(function(todo){
			res.json(todo.toJSON());
		});

	}).catch(function(e) {
		res.status(400).json(e);
	});

});

app.put('/todos/:id', middleware.requireAuthentication, function(req, res) {

	var todoId = parseInt(req.params.id);
	var body = _.pick(req.body, 'completed', 'description');
	var attributes = {};

	if (body.hasOwnProperty('completed')) {
		attributes.completed = body.completed;
	}

	if (body.hasOwnProperty('description')) {
		attributes.description = body.description;
	}

	// Instance method is put on model methods
	// So first we need to fetch data and then update it

	db.todo.findOne({
		where: {
			id: todoId,
			userId: req.user.get('id')
		}
	}).then(function(todo) {

		if (todo) {
			todo.update(attributes).then(function(todo) {

				res.json(todo.toJSON());
			}, function(e) {
				res.status(400).json(e);
			});
		} else {
			return res.status(404).send();
		}
	}, function() {
		res.status(500).send();
	});

});

// Generate a post request for USER creation
app.post('/users', function(req, res){

	var body = _.pick(req.body, 'email', 'password');

	db.user.create({
		email: body.email,
		password: body.password
	}).then(function(user) {

		res.json(user.toPublicJSON());
	}).catch(function(e) {
		res.status(400).json(e);
	});
});


// POST /users/login

app.post('/users/login', function(req, res) {
	var body = _.pick(req.body, 'email', 'password');


	// Converting long route into autheticate function
	db.user.authenticate(body).then(function(user) {

		var token = user.generateToken('authentication');

		if (token) {
			// header takes key and value (generateToken(type))
			res.header('Auth', token).json(user.toPublicJSON());
		} else {
			res.status(401).send();

		}
	}, function() {

		res.status(401).send();
	});

	// if(typeof body.email === 'string' && typeof body.password === 'string'){

	// 	db.user.findOne({
	// 		where: {
	// 			email: body.email
	// 		}
	// 	}).then(function (user) {
	// 		if(!user || !bcrypt.compareSync(body.password, user.get('password_hash'))){
	// 			// 401 Authentivation exist but fail
	// 			return res.status(401).send();
	// 		}

	// 		// Password Validation in callback now
	// 		// compareSync takes two arguments.
	// 		// Passed in password and hash

	// 		res.json(user.toPublicJSON());

	// 	}, function(e){
	// 		res.status(500).send();
	// 	});

	// }else{
	// 	return res.status(400).send();
	// }
});

db.sequelize.sync().then(function() {

	// Server will start in db
	// after db starts server will start
	app.listen(PORT, function() {
		console.log('Server Running at ' + PORT);
	});
});