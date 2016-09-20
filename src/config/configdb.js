exports.jsonConfigDB = function(){
	var json_db = {};

	//si está definido es docker
	if (typeof process.env['PGDATABASE'] !== 'undefined'){
		json_db = {
	    	"name"		  : "DOCKER",
	        "db"          : process.env['PGDATABASE'],
	        "user"        : process.env['PGUSER_USER'],
	        "password"    : process.env['PGUSER_PASSWORD'],
	        "host"        : process.env['DATABASE_URL'],
	        "timeToWaitDB": 40000,
	        "addons"      : ""
	    };

	} else { // es heroku
		json_db = {
	    	"name"		  : "HEROKU",
	        "db"          : "d5uretjrtlehmp",
	        "user"        : "lthaghpcskkrpu",
	        "password"    : "4PKMzgLy-_Dvlx-FZktuNQivSN",
	        "host"        : "ec2-54-221-245-174.compute-1.amazonaws.com:5432",
	        "timeToWaitDB": 0,
	        "addons"      : "?ssl=true"
	    };
	}

	return json_db;
};
