'use strict';

var config = require('./src/config/config.json');

//Log
var log4js = require('log4js');
log4js.configure('./src/config/log.conf.json');
var logger = log4js.getLogger();

var express = require("express");
var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var http = require('http');
var massive = require("massive");
var connectionString = "postgres://"+config.postgres.user+":"+config.postgres.password+"@"+config.postgres.host+"/"+config.postgres.db;
var massiveInstance = massive.connectSync({connectionString : connectionString}) 


app.set('db', massiveInstance);

http.createServer(app).listen(8080);

logger.debug('SharedServer start'); 

var db = app.get('db');

var api = require('./src/api/api.js');
api.setdb(db);

app.get('/', function (req, res) {
	res.send("HOLA MANOLA, nada por aqui! :(");
});



//Metodos get de la api rest

//listados de puestos de trabajo
app.get('/job_positions', api.jobPositions);

//listado de puestos de trabajo por categoria
app.get('/job_positions/categories/:category', api.findJobPositionsByCategory);

//alta de puestos
app.post('/job_positions/categories/:category', api.addJobPosition);

//baja de puesto
app.delete('/job_positions/categories/:category/:name',api.deleteJobPosition);

//update de puesto
app.put('/job_positions/categories/:category/:name',api.updateJobPosition);

//listado de skills
app.get('/skills', api.skills);

//listado de skills por categoria
app.get('/skills/categories/:category', api.findSkillsByCategory);

//alta de skill
app.post('/skill/categories/:category',api.addSkill);

//baja de skill
app.delete('/skills/categories/:category/:name',api.deleteSkill);

//update de skill
app.put('/skills/categories/:category/:name',api.updateSkill);

//listado de categorias
app.get('/categories', api.categories);

//alta de categoria
app.post('/categories',api.addCategory);

//baja de categoria
app.delete('/categories/:category',api.deleteCategory);

//update de categoria
app.post('/categories/:category',api.updateCategory);