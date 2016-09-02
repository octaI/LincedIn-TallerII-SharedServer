'use strict';

var config = require('./config.json');
var express = require("express");
var app = express();
var http = require('http');
var massive = require("massive");
var connectionString = "postgres://"+config.postgres.user+":"+config.postgres.password+"@"+config.postgres.host+"/"+config.postgres.db;

var massiveInstance = massive.connectSync({connectionString : connectionString}) 

app.set('db', massiveInstance);
http.createServer(app).listen(8080);

var db = app.get('db');

var common = require('./src/common.js');
common.setdb(db);

app.get('/', function (req, res) {
	res.send("HOLA MANOLA");
});

//Metdos posta del TP
app.get('/job_positions', function (req, res) {

	//var positions = db.job_positions.findSync({"delete_date =": null},{columns: ["name", "id_category", "description"]});
	//var categories = db.categories.findSync({"delete_date =": null},{columns: ["name", "id"]});

	db.run("SELECT job_positions.name, categories.name as category, job_positions.description FROM job_positions INNER JOIN categories ON (job_positions.id_category = categories.id)", function(err, positions){
 		if (err){
 			common.handleError(res,{code:0,message:"Error al seleccionar los puestos de trabajo"},500);
 		}
		res.send(common.prepareResponse("job_positions",positions));
  	});
});

app.get('/fme', function (req, res) {
	var send = "REQ => \n{ ";

	for (var query in req.query) {
		send += req.query[query] + ' : ' + query + ', ';
	}

	send += '}';

	res.send(send);
});