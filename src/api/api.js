//API methods


//HTTP codes
const CODE_ERROR_INEXISTENTE = 404;
const CODE_ERROR_UNEXPECTED  = 500;
const CODE_ERROR_INCLUMPLIMIENTO = 400;
const CODE_LIST_OK = 200;
const CODE_ADD_OK = 201;
const CODE_DELETE_OK = 214;
const CODE_UPDATE_OK = 200;

//Error codes API
const ERROR_QUERY_DB = 00;
const ERROR_INSERT_DB = 01;
const ERROR_DESTROY_DATA_DB = 02;
const ERROR_UPDATE_DB = 03;
const ERROR_FIND_DATA_DB = 04;
const ERROR_PARAMETER_MISSING = 10;
const ERROR_PARAMETER_INVALID = 11;
const ERROR_DATA_IN_USE = 22;

var db;
var logger;
var common = require('../utils/common.js');

exports.config = function(config){
	db = config.db;
	logger = config.logger;

	logger.debug('API configured'); 
	common.config(config);
};

exports.jobPositions = function (req, res) {
	db.run("SELECT job_positions.name, categories.name as category, job_positions.description FROM job_positions INNER JOIN categories ON job_positions.delete_date is null and(job_positions.id_category = categories.id)", function(err, positions){
 		if (err){
 			logger.error('Error on list job_positions: ' + err.message);
 			return common.handleError(res,{code:ERROR_QUERY_DB,message:"Error on list job positions."},CODE_ERROR_UNEXPECTED);
 		}
 		res.status(CODE_LIST_OK).send(common.prepareResponse("job_positions",positions));
  	});
};

exports.findJobPositionsByCategory = function (req, res) {
	var category = req.params.category;
	
	db.run("SELECT job_positions.name, categories.name as category, job_positions.description FROM job_positions INNER JOIN categories ON job_positions.delete_date is null and (job_positions.id_category = categories.id) and categories.name = $1",[category], function(err, positions){
 		if (err){
 			logger.error('Error on list job_positions: ' + err.message);
 			return common.handleError(res,{code:ERROR_QUERY_DB,message:"Error on list job positions by category."},CODE_ERROR_UNEXPECTED);
 		}
 		
		res.send(common.prepareResponse("job_positions",positions));
  	});
};

exports.addJobPosition = function (req, res) {
	var category = req.params.category;
	var name = req.body.name;
	var description = req.body.description;

	if (! common.checkDefinedParameters([name,description],"agregar un puesto de trabajo")){
		return common.handleError(res,{code:ERROR_PARAMETER_MISSING,message:"Breach of preconditios (missing parameters)"},CODE_ERROR_INCLUMPLIMIENTO);
	}

	var id_category = common.findIdCategory(category);
	if (id_category < 0){
		logger.error('Error al agregar un puesto de trabajo, categoría inexistente: ' + category);
		return common.handleError(res,{code:ERROR_PARAMETER_INVALID,message:"Nonexistent category: "+ category},CODE_ERROR_INEXISTENTE);
	}

	
	var new_position = {};
	new_position["name"] = name;
	new_position["description"] = description;
	new_position["id_category"] = id_category;


	var job = db.job_positions.findOneSync(new_position);
	
	if (!common.JobPositionDefined(job)){

		db.job_positions.insert(new_position, function(err, job_position){
			if (err){
				logger.error('Error al agregar un puesto de trabajo en la base de datos: ' + err.message);
	 			return common.handleError(res,{code:ERROR_INSERT_DB,message:"Error on add job position"},CODE_ERROR_UNEXPECTED);
	 		}

	 		var result = {};
	 		result["name"] = job_position.name;
	 		result["description"] = job_position.description;
	 		result["category"] = category;

	 		res.status(CODE_ADD_OK).send(result);
		});	
	} else {
		logger.error('Error al agregar un puesto de trabajo en la base de datos, ya existe la entrada: ' + name + ' para la categoria: ' + category);
		return common.handleError(res,{code:ERROR_INSERT_DB,message:"Error on add job position, it already exists."},CODE_ERROR_UNEXPECTED);
	}

};

exports.deleteJobPosition = function (req, res) {
	var category = req.params.category;
	var name = req.params.name;

	var id_category = common.findIdCategory(category);
	if (id_category < 0){
		logger.error('Error al borrar un puesto de trabajo, categoría inexistente: ' + category);
		return common.handleError(res,{code:ERROR_PARAMETER_INVALID,message:"Nonexistent category: "+ category},CODE_ERROR_INEXISTENTE);
	}

	var job = db.job_positions.findOneSync({"name":name,"id_category":id_category,"delete_date =":null});

	if (!common.JobPositionDefined(job)){
		logger.error('Error al borrar un puesto de trabajo, es inexistente: ' + name);
		return common.handleError(res,{code:ERROR_FIND_DATA_DB,message:"The required resource doesn't exist."},CODE_ERROR_INEXISTENTE);
	}
	
	db.job_positions.destroy({"id":job.id}, function(err, job_position){
		if (err){
			logger.error('Error al borrar un puesto de trabajo: ' + err.message);
 			return common.handleError(res,{code:ERROR_DESTROY_DATA_DB,message:"Error on delete job position"},CODE_ERROR_UNEXPECTED);
 		}

 		//res.status(CODE_DELETE_OK).send();
 		res.writeHead(CODE_DELETE_OK, "No Content");
 		res.send().end();
	});

};

exports.updateJobPosition =  function (req, res) {
	var old_category = req.params.category;
	var old_name = req.params.name;

	var new_name = req.body.name;
	var new_description = req.body.description;
	var new_category = req.body.category;

	
	if ( ! common.checkDefinedParameters([new_name,new_description,new_category],"modificar un puesto de trabajo")){
		return common.handleError(res,{code:ERROR_PARAMETER_MISSING,message:"Breach of preconditios (missing parameters)"},CODE_ERROR_INCLUMPLIMIENTO);
	}

	var id_old_category = common.findIdCategory(old_category);
	if (id_old_category < 0){
		logger.error('Error al modificar un puesto de trabajo, categoría inexistente: ' + old_category);
		return common.handleError(res,{code:ERROR_PARAMETER_INVALID,message:"The required resource doesn't exist: "+ old_category},CODE_ERROR_INEXISTENTE);
	}

	var job = db.job_positions.findOneSync({"name":old_name,"id_category":id_old_category,"delete_date =":null});

	if (!common.JobPositionDefined(job)){
		logger.error('Error al modificar un puesto de trabajo, es inexistente: ' + new_name);
		return common.handleError(res,{code:ERROR_FIND_DATA_DB,message:"The required resource doesn't exist: '" + old_name + "' para la categoria " + old_category},CODE_ERROR_INEXISTENTE);
	}

	var id_new_category =  common.findIdCategory(new_category);

	if (id_new_category < 0){
		logger.error('Error al modificar un puesto de trabajo, categoría inexistente: ' + new_category);
		return common.handleError(res,{code:ERROR_PARAMETER_INVALID,message:"The required resource doesn't exist: "+ new_category},CODE_ERROR_INEXISTENTE);
	}

	var update_job_position = {};
	update_job_position["id"] = job.id;
	update_job_position["name"] = new_name;
	update_job_position["description"] = new_description;
	update_job_position["id_category"] = id_new_category;

	db.job_positions.update(update_job_position, function(err, job_position){
		if (err){
			logger.error('Error al modificar un puesto de trabajo: ' + err.message);
 			return common.handleError(res,{code:ERROR_UPDATE_DB,message:"Error on modify job position."},CODE_ERROR_UNEXPECTED);
 		}

 		var result = {};
 		result["name"] = job_position.name;
 		result["description"] = job_position.description;
 		result["category"] = new_category;

 		res.status(CODE_UPDATE_OK).send(result);
	});
};

exports.skills = function (req, res) {

	db.run("SELECT skills.name, categories.name as category, skills.description FROM skills INNER JOIN categories ON skills.delete_date is null and (skills.id_category = categories.id)", function(err, skills){
 		if (err){
 			logger.error('Error al listar skills: ' + err.message);
 			return common.handleError(res,{code:ERROR_QUERY_DB,message:"Error on list skills"},CODE_ERROR_UNEXPECTED);
 		}
		res.send(common.prepareResponse("skills",skills));
  	});
};

exports.findSkillsByCategory = function (req, res) {
	var category = req.params.category;
	
	db.run("SELECT skills.name, categories.name as category, skills.description FROM skills INNER JOIN categories ON skills.delete_date is null and (skills.id_category = categories.id) and categories.name = $1",[category], function(err, positions){
 		if (err){
 			logger.error('Error al listar skills por categoria: ' + err.message);
 			return common.handleError(res,{code:ERROR_QUERY_DB,message:"Error on list skills by category."},CODE_ERROR_UNEXPECTED);
 		}
		res.send(common.prepareResponse("skills",positions));
  	});
};

exports.addSkill = function (req, res) {
	var category = req.params.category;

	var name = req.body.name;
	var description = req.body.description;

	if (! common.checkDefinedParameters([name,description],"agregar una skill")){
		return common.handleError(res,{code:ERROR_PARAMETER_MISSING,message:"Breach of preconditios (missing parameters)"},CODE_ERROR_INCLUMPLIMIENTO);
	}

	var id_category = common.findIdCategory(category);
	if (id_category < 0){
		logger.error('Error al agregar una skill cateforía inexistente: '+ category);
		return common.handleError(res,{code:ERROR_PARAMETER_INVALID,message:"Nonexistent category: "+ category},CODE_ERROR_INEXISTENTE);
	}

	var new_skill = {};
	new_skill["name"] = name;
	new_skill["description"] = description;
	new_skill["id_category"] = id_category;

	db.skills.insert(new_skill, function(err, skill){
		if (err){
			logger.error('Error al agregar una skill: ' + err.message);
 			return common.handleError(res,{code:ERROR_INSERT_DB,message:"Error on add skill."},CODE_ERROR_UNEXPECTED);
 		}

 		var result = {};
 		result["name"] = skill.name;
 		result["description"] = skill.description;
 		result["category"] = category;

 		res.status(CODE_ADD_OK).send(result);
	});

};

exports.deleteSkill = function (req, res) {
	var category = req.params.category;
	var name = req.params.name;

	var id_category = common.findIdCategory(category);

	if (id_category < 0){
		logger.error('Error al borrar una skill, categoría inexistente: ' + category);
		return common.handleError(res,{code:ERROR_PARAMETER_INVALID,message:"Categoría inexistente: "+ category},CODE_ERROR_INEXISTENTE);
	}

	var skill = db.skills.findOneSync({"name":name,"id_category":id_category,"delete_date =":null});

	if (!common.SkillDefined(skill)){
		logger.error('Error al borrar una skill, no existe: ' + name);
		return common.handleError(res,{code:ERROR_FIND_DATA_DB,message:"The required resource doesn't exist."},CODE_ERROR_INEXISTENTE);
	}
	
	db.skills.destroy({"id":skill.id}, function(err, skill){
		if (err){
			logger.error('Error al borrar una skill: ' + err.message);
 			return common.handleError(res,{code:ERROR_DESTROY_DATA_DB,message:"Error on delete skill"},CODE_ERROR_UNEXPECTED);
 		}

 		//res.status(CODE_DELETE_OK).send();
 		res.writeHead(CODE_DELETE_OK, "No Content");
 		res.send().end();
	});

};

exports.updateSkill = function (req, res) {
	var old_category = req.params.category;
	var old_name = req.params.name;

	var new_name = req.body.name;
	var new_description = req.body.description;
	var new_category = req.body.category;

	if(! common.checkDefinedParameters([new_name,new_description,new_category],"modificar una skill")){
		return common.handleError(res,{code:ERROR_PARAMETER_MISSING,message:"Breach of preconditios (missing parameters)"},CODE_ERROR_INCLUMPLIMIENTO);
	}

	var id_old_category = common.findIdCategory(old_category);
	if (id_old_category < 0){
		logger.error('Error al modificar una skill, no existe la categoría: ' + old_category);
		return common.handleError(res,{code:ERROR_PARAMETER_INVALID,message:"The required resource doesn't exist: "+ old_category},CODE_ERROR_INEXISTENTE);
	}

	var skill = db.skills.findOneSync({"name":old_name,"id_category":id_old_category,"delete_date =":null});

	if (!common.SkillDefined(skill)){
		logger.error('Error al modificar una skill, no existe: -> name ' + old_name + " category " + old_category);
		return common.handleError(res,{code:ERROR_FIND_DATA_DB,message:"The required resource doesn't exist: " + old_name},CODE_ERROR_INEXISTENTE);
	}

	var id_new_category = common.findIdCategory(new_category);
	if (id_new_category < 0){
		logger.error('Error al modificar una skill, no existe la categoría nueva: ' + new_category);
		return common.handleError(res,{code:ERROR_FIND_DATA_DB,message:"The required resource doesn't exist: "+ new_category},CODE_ERROR_INEXISTENTE);
	}

	var update_skill = {};
	update_skill["id"] = skill.id;
	update_skill["name"] = new_name;
	update_skill["description"] = new_description;
	update_skill["id_category"] = id_new_category;

	db.skills.update(update_skill, function(err, skill){
		if (err){
			logger.error('Error al modificar la skill: ' + err.message);
 			return common.handleError(res,{code:ERROR_UPDATE_DB,message:"Error on modify skill."},CODE_ERROR_UNEXPECTED);
 		}

 		var result = {};
 		result["name"] = skill.name;
 		result["description"] = skill.description;
 		result["category"] = new_category;

 		res.status(CODE_UPDATE_OK).send(result);
	});
};

exports.categories = function (req, res) {

	db.categories.find({"delete_date =":null},{columns: ["name","description"]}, function(err, categories){
 		if (err){
 			logger.error('Error al listar las categorías: ' + err.message);
 			return common.handleError(res,{code:ERROR_QUERY_DB,message:"Error on list categories."},CODE_ERROR_UNEXPECTED);
 		}
		res.send(common.prepareResponse("categories",categories));
  	});
};

exports.addCategory = function (req, res) {
	
	var name = req.body.name;
	var description = req.body.description;

	if (! common.checkDefinedParameters([name,description],"agregar una categoría")){
		return common.handleError(res,{code:ERROR_PARAMETER_MISSING,message:"Breach of preconditios (missing parameters)"},CODE_ERROR_INCLUMPLIMIENTO);
	}
	
	var id_category = common.findIdCategory(name);

	if (id_category > 0){
		logger.error('Error al agregar una categoría, ya existe -> name: '+ name);
		return common.handleError(res,{code:2,message:"Category already exist."},CODE_ERROR_UNEXPECTED);
	}

	var new_category = {};
	new_category["name"] = name;
	new_category["description"] = description;

	db.categories.insert(new_category, function(err, category){
		if (err){
			logger.error('Error al agregar la categoría: ' + err.message);
 			return common.handleError(res,{code:ERROR_INSERT_DB,message:"Error on add category."},CODE_ERROR_UNEXPECTED);
 		}

 		var result = {};
 		result["name"] = category.name;
 		result["description"] = category.description;

 		res.status(CODE_ADD_OK).send(result);
	});	

};

exports.deleteCategory = function (req, res) {
	var category = req.params.category;

	var id_category =  common.findIdCategory(category);

	if (id_category < 0){
		logger.error('Error al borrar categoría, no existe: ' + category);
		return common.handleError(res,{code:ERROR_PARAMETER_INVALID,message:"The required resource doesn't exist. "},CODE_ERROR_INEXISTENTE);
	}

	if (common.categoryInUse(id_category)){
		logger.error('Error al agregar la categoría. Se encuentra en uso.');
		return common.handleError(res,{code:22,message:"Error on add category, already in use." },CODE_ERROR_UNEXPECTED);	
	}

	//TODO: ver si es mejor borrar por completo de la db o setear la fecha de baja y mantener los datos
	db.categories.destroy({"id":id_category}, function(err, category){
		if (err){
			logger.error('Error al borrar categoría: ' + err.message);
 			return common.handleError(res,{code:ERROR_DESTROY_DATA_DB_DB,message:"Error on delete category."},CODE_ERROR_UNEXPECTED);
 		}

 		//res.status(CODE_DELETE_OK).send();
 		res.writeHead(CODE_DELETE_OK, "No Content");
 		res.send().end();
	});

};

exports.updateCategory = function (req, res) {
	var category = req.params.category;
	
	var name = req.body.name;
	var description = req.body.description;

	if (! common.checkDefinedParameters([name,description],"modificar una categoría")){
		return common.handleError(res,{code:ERROR_PARAMETER_MISSING,message:"Breach of preconditios (missing parameters)"},CODE_ERROR_INCLUMPLIMIENTO);
	}

	var id_category = common.findIdCategory(category);

	if (id_category < 0){
		logger.error('Error al modificar la categoría: no existe.');
		return common.handleError(res,{code:ERROR_PARAMETER_INVALID,message:"The required resource doesn't exist. "},CODE_ERROR_INEXISTENTE);
	}

	
	if (common.categoryInUse(id_category)){
		logger.error('Error al modificar la categoría. Se encuentra en uso.');
		return common.handleError(res,{code:ERROR_DATA_IN_USE,message:"Error on modify category, already in use." },CODE_ERROR_UNEXPECTED);	
	}

	db.categories.update({"id":id_category,"name":name,"description":description}, function(err, category){
		if (err){
			logger.error('Error al modificar la categoría: ' + err.message);
 			return common.handleError(res,{code:ERROR_UPDATE_DB,message:"Error on modify category."},CODE_ERROR_UNEXPECTED);
 		}

 		var result = {};
 		result["name"] = category.name;
 		result["description"] = category.description;

 		res.status(CODE_UPDATE_OK).send(result);
	});

};
