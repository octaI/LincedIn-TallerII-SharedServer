function funcion1(){
console.log("Arranca el script");
var Massive=require("massive");
var connectionString = "postgres://"+process.env['PGUSER_USER']+":"+process.env['PGUSER_PASSWORD']+	"@"+process.env['DATABASE_URL']+"/lincedb";
var db = Massive.connectSync({connectionString : connectionString});



db.users.find({first : "Mala"}, function(err,result){
	console.log(result);  
});	
}


setTimeout(funcion1,10000);
