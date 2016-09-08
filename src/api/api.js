//API methods

const CODE_ERROR_INEXISTENTE = 404;
const CODE_ERROR_UNEXPECTED  = 500;
const CODE_ERROR_INCLUMPLIMIENTO = 400;
const CODE_LIST_OK = 200;
const CODE_ADD_OK = 201;
const CODE_DELETE_OK = 204;
const CODE_UPDATE_OK = 200;

var db = null;
var common = require('../utils/common.js');


exports.setdb = function(_db){
	db = _db;
	common.setdb(db);
};

exports.jobPositions = function (req, res) {

	db.run("SELECT job_positions.name, categories.name as category, job_positions.description FROM job_positions INNER JOIN categories ON job_positions.delete_date is null and(job_positions.id_category = categories.id)", function(err, positions){
 		if (err){
 			return common.handleError(res,{code:0,message:"Error al seleccionar los puestos de trabajo"},CODE_ERROR_UNEXPECTED);
 		}
		res.send(CODE_LIST_OK,common.prepareResponse("job_positions",positions));
  	});
};

exports.findJobPositionsByCategory = function (req, res) {
	var category = req.params.category;
	
	db.run("SELECT job_positions.name, categories.name as category, job_positions.description FROM job_positions INNER JOIN categories ON job_positions.delete_date is null and (job_positions.id_category = categories.id) and categories.name = $1",[category], function(err, positions){
 		if (err){
 			console.log(err);
 			return common.handleError(res,{code:0,message:"Error al seleccionar los puestos de trabajo"},CODE_ERROR_UNEXPECTED);
 		}
 		if (positions.length == 0){
 			return common.handleError(res,{code:0,message:"Ningún dato para la categoria: " + category},CODE_ERROR_INEXISTENTE);	
 		}
		res.send(common.prepareResponse("job_positions",positions));
  	});
};

exports.addJobPosition = function (req, res) {
	var category = req.params.category;
	var name = req.body.name;
	var description = req.body.description;

	if ((typeof name === "undefined") || (typeof description === "undefined")){
		return common.handleError(res,{code:0,message:"Incumplimiento de precondiciones (parámetros faltantes)"},CODE_ERROR_INCLUMPLIMIENTO);
	}

	var id_category = db.categories.findOneSync({"name":category,"delete_date =":null});

	if (typeof id_category === "undefined"){
		return common.handleError(res,{code:0,message:"Categoría inexistente: "+ category},CODE_ERROR_INEXISTENTE);
	}

	id_category = id_category.id;

	var new_position = {};
	new_position["name"] = name;
	new_position["description"] = description;
	new_position["id_category"] = id_category;

	db.job_positions.insert(new_position, function(err, job_position){
		if (err){
			console.log(err);
 			return common.handleError(res,{code:0,message:"Error al agregar la posición"},CODE_ERROR_UNEXPECTED);
 		}

 		var result = {};
 		result["name"] = job_position.name;
 		result["description"] = job_position.description;
 		result["category"] = category;

 		res.send(CODE_ADD_OK,result);
	});

};

exports.deleteJobPosition = function (req, res) {
	var category = req.params.category;
	var name = req.params.name;

	var id_category = db.categories.findOneSync({"name":category,"delete_date =":null});

	if (typeof id_category === "undefined"){
		return common.handleError(res,{code:0,message:"Categoría inexistente: "+ category},CODE_ERROR_INEXISTENTE);
	}

	id_category = id_category.id;

	var job = db.job_positions.findOneSync({"name":name,"id_category":id_category,"delete_date =":null});

	if (typeof job === "undefined"){
		return common.handleError(res,{code:0,message:"No existe el recurso solicitado."},CODE_ERROR_INEXISTENTE);
	}
	
	//TODO: ver si es mejor borrar por completo de la db o setear la fecha de baja y mantener los datos
	db.job_positions.destroy({"id":job.id}, function(err, job_position){
		if (err){
			console.log(err);
 			return common.handleError(res,{code:0,message:"Error al eliminar la posición"},CODE_ERROR_UNEXPECTED);
 		}

 		res.send(CODE_DELETE_OK);
	});

};

exports.updateJobPosition =  function (req, res) {
	var old_category = req.params.category;
	var old_name = req.params.name;

	var new_name = req.body.name;
	var new_description = req.body.description;
	var new_category = req.body.category;

	if ((typeof new_name === "undefined") || (typeof new_description === "undefined") || (typeof new_category === "undefined")){
		return common.handleError(res,{code:0,message:"Incumplimiento de precondiciones (parámetros faltantes)"},CODE_ERROR_INCLUMPLIMIENTO);
	}

	var id_old_category = db.categories.findOneSync({"name":old_category,"delete_date =":null});

	if (typeof id_old_category === "undefined"){
		return common.handleError(res,{code:0,message:"No existe el recurso solicitado: "+ old_category},CODE_ERROR_INEXISTENTE);
	}

	id_old_category = id_old_category.id;

	var job = db.job_positions.findOneSync({"name":old_name,"id_category":id_old_category,"delete_date =":null});

	if (typeof job === "undefined"){
		return common.handleError(res,{code:0,message:"No existe el recurso solicitado " + old_name},CODE_ERROR_INEXISTENTE);
	}

	var id_new_category =  db.categories.findOneSync({"name":new_category,"delete_date =":null});

	if (typeof id_new_category === "undefined"){
		return common.handleError(res,{code:0,message:"No existe el recurso solicitado: "+ new_category},CODE_ERROR_INEXISTENTE);
	}

	var new_job_position = {};
	new_position["name"] = new_name;
	new_position["description"] = new_description;
	new_position["id_category"] = id_new_category;

	db.job_positions.insert(new_position, function(err, job_position){
		if (err){
			console.log(err);
 			return common.handleError(res,{code:0,message:"Error al modificar la posición"},CODE_ERROR_UNEXPECTED);
 		}

 		var result = {};
 		result["name"] = job_position.name;
 		result["description"] = job_position.description;
 		result["category"] = new_category;

 		res.send(CODE_UPDATE_OK,result);
	});
};

exports.skills = function (req, res) {

	db.run("SELECT skills.name, categories.name as category, skills.description FROM skills INNER JOIN categories ON skills.delete_date is null and (skills.id_category = categories.id)", function(err, skills){
 		if (err){
 			return common.handleError(res,{code:0,message:"Error al seleccionar las habilidades"},CODE_ERROR_UNEXPECTED);
 		}
		res.send(common.prepareResponse("skills",skills));
  	});
};

exports.findSkillsByCategory = function (req, res) {
	var category = req.params.category;
	
	db.run("SELECT skills.name, categories.name as category, skills.description FROM skills INNER JOIN categories ON skills.delete_date is null and (skills.id_category = categories.id) and categories.name = $1",[category], function(err, positions){
 		if (err){
 			console.log(err);
 			return common.handleError(res,{code:0,message:"Error al seleccionar las habilidades"},CODE_ERROR_UNEXPECTED);
 		}
 		if (positions.length == 0){
 			return common.handleError(res,{code:0,message:"Ningún dato para la categoria: " + category},CODE_ERROR_INEXISTENTE);	
 		}
		res.send(common.prepareResponse("skills",positions));
  	});
};

exports.addSkill = function (req, res) {
	var category = req.params.category;

	var name = req.body.name;
	var description = req.body.description;

	if ((typeof name === "undefined") || (typeof description === "undefined")){
		return common.handleError(res,{code:0,message:"Incumplimiento de precondiciones (parámetros faltantes)"},CODE_ERROR_INCLUMPLIMIENTO);
	}

	var id_category = db.categories.findOneSync({"name":category,"delete_date =":null});

	if (typeof id_category === "undefined"){
		return common.handleError(res,{code:0,message:"Categoría inexistente: "+ category},CODE_ERROR_INEXISTENTE);
	}

	id_category = id_category.id;

	var new_skill = {};
	new_skill["name"] = name;
	new_skill["description"] = description;
	new_skill["id_category"] = id_category;

	db.skills.insert(new_skill, function(err, skill){
		if (err){
			console.log(err);
 			return common.handleError(res,{code:0,message:"Error al agregar la habilidad"},CODE_ERROR_UNEXPECTED);
 		}

 		var result = {};
 		result["name"] = skill.name;
 		result["description"] = skill.description;
 		result["category"] = category;

 		res.send(CODE_ADD_OK,result);
	});

};

exports.deleteSkill = function (req, res) {
	var category = req.params.category;
	var name = req.params.name;

	var id_category = db.categories.findOneSync({"name":category,"delete_date =":null});

	if (typeof id_category === "undefined"){
		return common.handleError(res,{code:0,message:"Categoría inexistente: "+ category},CODE_ERROR_INEXISTENTE);
	}

	id_category = id_category.id;

	var skill = db.skills.findOneSync({"name":name,"id_category":id_category,"delete_date =":null});

	if (typeof skill === "undefined"){
		return common.handleError(res,{code:0,message:"No existe el recurso solicitado."},CODE_ERROR_INEXISTENTE);
	}
	
	//TODO: ver si es mejor borrar por completo de la db o setear la fecha de baja y mantener los datos
	db.skills.destroy({"id":skill.id}, function(err, skill){
		if (err){
			console.log(err);
 			return common.handleError(res,{code:0,message:"Error al eliminar la habilidad"},CODE_ERROR_UNEXPECTED);
 		}

 		res.send(CODE_DELETE_OK);
	});

};

exports.updateSkill = function (req, res) {
	var old_category = req.params.category;
	var old_name = req.params.name;

	var new_name = req.body.name;
	var new_description = req.body.description;
	var new_category = req.body.category;

	if ((typeof new_name === "undefined") || (typeof new_description === "undefined") || (typeof new_category === "undefined")){
		return common.handleError(res,{code:0,message:"Incumplimiento de precondiciones (parámetros faltantes)"},CODE_ERROR_INCLUMPLIMIENTO);
	}

	var id_old_category = db.categories.findOneSync({"name":old_category,"delete_date =":null});

	if (typeof id_old_category === "undefined"){
		return common.handleError(res,{code:0,message:"No existe el recurso solicitado: "+ old_category},CODE_ERROR_INEXISTENTE);
	}

	id_old_category = id_old_category.id;

	var skill = db.skills.findOneSync({"name":old_name,"id_category":id_old_category,"delete_date =":null});

	if (typeof job === "undefined"){
		return common.handleError(res,{code:0,message:"No existe el recurso solicitado " + old_name},CODE_ERROR_INEXISTENTE);
	}

	var id_new_category =  db.categories.findOneSync({"name":new_category,"delete_date =":null});

	if (typeof id_new_category === "undefined"){
		return common.handleError(res,{code:0,message:"No existe el recurso solicitado: "+ new_category},CODE_ERROR_INEXISTENTE);
	}

	var new_skill = {};
	new_skill["name"] = new_name;
	new_skill["description"] = new_description;
	new_skill["id_category"] = id_new_category;

	db.skills.insert(new_skill, function(err, skill){
		if (err){
			console.log(err);
 			return common.handleError(res,{code:0,message:"Error al modificar la habilidad"},CODE_ERROR_UNEXPECTED);
 		}

 		var result = {};
 		result["name"] = skill.name;
 		result["description"] = skill.description;
 		result["category"] = new_category;

 		res.send(CODE_UPDATE_OK,result);
	});
};

exports.categories = function (req, res) {

	db.categories.find({"delete_date =":null},{columns: ["name","description"]}, function(err, categories){
 		if (err){
 			return common.handleError(res,{code:0,message:"Error al seleccionar las categorias"},CODE_ERROR_UNEXPECTED);
 		}
		res.send(common.prepareResponse("categories",categories));
  	});
};

exports.addCategory = function (req, res) {
	
	var name = req.body.name;
	var description = req.body.description;

	var id_category = db.categories.findOneSync({"name":name,"delete_date =":null});

	if (typeof id_category !== "undefined"){
		return common.handleError(res,{code:2,message:"La categoría ya existe"},CODE_ERROR_UNEXPECTED);
	}

	var new_category = {};
	new_position["name"] = name;
	new_position["description"] = description;

	db.job_positions.insert(new_category, function(err, category){
		if (err){
			console.log(err);
 			return common.handleError(res,{code:0,message:"Error al agregar la categoría"},CODE_ERROR_UNEXPECTED);
 		}

 		var result = {};
 		result["name"] = category.name;
 		result["description"] = category.description;

 		res.send(CODE_ADD_OK,result);
	});	

};

exports.deleteCategory = function (req, res) {
	var category = req.params.category;

	var id_category = db.categories.findOneSync({"name":category,"delete_date =":null});

	if (typeof id_category !== "undefined"){
		return common.handleError(res,{code:0,message:"No existe el recurso solicitado "},CODE_ERROR_INEXISTENTE);
	}

	id_category = id_category.id;

	//verifico que no hay nada que pertenezca a esta categoría
	var count_skills = db.skills.countSync({"id_category":id_category});
	var count_jobs = db.job_positions.countSync({"id_category":id_category});
	
	if (count_jobs + count_skills > 0){
		return common.handleError(res,{code:1,message:"El la categoría se encuentra en uso, contiene " + count_skills + " skills y " + count_jobs +" jobs positions." },CODE_ERROR_UNEXPECTED);	
	}

	//TODO: ver si es mejor borrar por completo de la db o setear la fecha de baja y mantener los datos
	db.categories.destroy({"id":id_category}, function(err, category){
		if (err){
			console.log(err);
 			return common.handleError(res,{code:0,message:"Error al eliminar la categoría"},CODE_ERROR_UNEXPECTED);
 		}

 		res.send(CODE_DELETE_OK);
	});

};

exports.updateCategory = function (req, res) {
	var category = req.params.category;
	
	var name = req.body.name;
	var description = req.body.description;

	if ((typeof name === "undefined") || (typeof description === "undefined")){
		return common.handleError(res,{code:0,message:"Incumplimiento de precondiciones (parámetros faltantes)"},CODE_ERROR_INCLUMPLIMIENTO);
	}

	var id_category = db.categories.findOneSync({"name":category,"delete_date =":null});

	if (typeof id_category === "undefined"){
		return common.handleError(res,{code:0,message:"No existe el recurso solicitado "},CODE_ERROR_INEXISTENTE);
	}

	id_category = id_category.id;

	//verifico que no hay nada que pertenezca a esta categoría
	var count_skills = db.skills.countSync({"id_category":id_category});
	var count_jobs = db.job_positions.countSync({"id_category":id_category});
	
	if (count_jobs + count_skills > 0){
		return common.handleError(res,{code:1,message:"El la categoría se encuentra en uso, contiene " + count_skills + " skills y " + count_jobs +" jobs positions." },CODE_ERROR_UNEXPECTED);	
	}

	//TODO: ver si es mejor borrar por completo de la db o setear la fecha de baja y mantener los datos
	db.categories.update({"id":id_category,"name":name,"description":description}, function(err, category){
		if (err){
			console.log(err);
 			return common.handleError(res,{code:0,message:"Error al modificar la categoría"},CODE_ERROR_UNEXPECTED);
 		}

 		var result = {};
 		result["name"] = category.name;
 		result["description"] = category.description;

 		res.send(CODE_UPDATE_OK,result);
	});

};
