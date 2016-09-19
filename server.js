'use strict';
//configuración de base de datos. Esto varía si es heroku o docker
var config = require('./src/config/configdb.js');

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
var api = require('./src/api/api.js');
var path = require('path')
var massiveInstance;

var configDB = config.jsonConfigDB();
/*
var configDB = {
	    	"name"		  : "PC",
	        "db"          : "lincedinsharedserver",
	        "user"        : "lince",
	        "password"    : "tallerii",
	        "host"        : "localhost",
	        "timeToWaitDB": 0,
	        "addons"      : ""
	    };
*/

logger.debug('SharedServer configurado para utilizar base de datos de ' + configDB.name); 

var configApi = {};
configApi.logger = logger;

function configureMassive(){
	var connectionString = "postgres://"+configDB.user+":"+configDB.password+"@"+configDB.host+"/"+configDB.db+configDB.addons;
	massiveInstance = massive.connectSync({connectionString : connectionString}) 
	app.set('db', massiveInstance);

	http.createServer(app).listen(process.env.PORT || 8080);

	logger.debug('SharedServer start'); 

	var db = app.get('db');

	configApi.db = db;
	
	api.config(configApi);
}

setTimeout(configureMassive,configDB.timeToWaitDB);


app.get('/', function (req, res) {
	res.sendFile(path.join(__dirname + '/src/index.html'));
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
app.post('/skills/categories/:category',api.addSkill);

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
app.put('/categories/:category',api.updateCategory);
