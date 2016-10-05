var db = null;
var logger = null;

exports.config = function(config){
	db = config.db;
	logger = config.logger;
};

var getConfigValue = exports.getConfigValue = function(nam){
	
	if (db == null){
		logger.fatal("Error, base de datos nula en common");
		return;
	}

	//var val = db.config.findOneSync({"name":nam});

	return "0.1";//val.value;
};

exports.prepareResponse = function(name,data){ 
	if (db == null){
		logger.fatal("Error, base de datos nula en common");
		return;
	}
			
	var version = getConfigValue("version");
	
	var response = {};

	response[name] = data;
	response["metadata"] = {"version":version,"count":data.length};
		
	return response;
};

exports.handleError = function(res,err,cod) {
    return res.status(cod).send({code:err.code, error: err.message});
};

exports.checkDefinedParameters = function(parameters,context){
	for (var i = 0; i < parameters.length ; i++) {
		if (typeof parameters[i] === "undefined"){
			logger.error('Error al '+ context +' faltan parámetros, sólo llegaron -> '+ parameters);
			return false;
		}
	}
	return true;
};


//on not find category return -1
exports.findIdCategory = function(nameCategory){

	var category = db.categories.findOneSync({"name":nameCategory,"delete_date =":null});

	if (typeof category === "undefined"){
		return -1;
	}

	return category.id;

};

exports.JobPositionDefined = function(job_position){

	if (typeof job_position === "undefined"){
		return false;
	}

	return true;

};

exports.SkillDefined = function(skill){

	if (typeof skill === "undefined"){
		return false;
	}

	return true;

};

exports.categoryInUse = function(id_category){

	var count_skills = db.skills.countSync({"id_category":id_category});
	var count_jobs = db.job_positions.countSync({"id_category":id_category});
	
	if (count_jobs + count_skills > 0){
		return true;
	}

	return false;
};