var db = null;
var logger = null;

var getConfigValue = function(nam){
	
	if (db == null){
		logger.error("Error, base de datos nula en common");
		return;
	}

	//NO ESTÄ FUNCIONANDO LA VERSION
	//var val = db.config.findOneSync({"name":nam});

	return "0.1";//val.value;
};

module.exports = {
	
	config: function(config){
		db = config.db;
		logger = config.logger;
	},

	getConfigValue: getConfigValue,
	
	prepareResponse: function(name,data){ 
		if (db == null){
			logger.error("Error, base de datos nula en common");
			return;
		}
				
		var version = getConfigValue("version");
		
		var response = {};

		response[name] = data;
		response["metadata"] = {"version":version,"count":data.length};
			
		return response;
	},
	handleError: function(res,err,cod) {
        return res.status(cod).send({code:err.code, error: err.message});
    }
}