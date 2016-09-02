var db = null;

var getConfigValue = function(nam){
	
	if (db == null){
		return;
	}

	var val = db.config.findOneSync({"name":nam});
	
	return val.value;
};

module.exports = {

	setdb: function(_db){
		db = _db;
	},
	getConfigValue: getConfigValue,
	
	prepareResponse: function(name,data){ 

		if (db == null){
			return;
		}

		var version = getConfigValue("version");


		var response = {};

		response[name] = data;
		response["metadata"] = {"version":version,"count":data.length};
			
		return response;
	},
	handleError: function(res,err,cod) {
        res.send(cod,{code:err.code, error: err.message});
    }
}