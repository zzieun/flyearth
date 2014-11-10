var mysql = require('mysql');
//var formidable = require('formidable');
//var path = require('path');
var dbconn = mysql.createConnection({
	host : 'localhost',
	user : 'root',
	password : '920808',
	database : 'fly_earth'
});

exports.piclist = function(req, res) {
	dbconn.query('SELECT * FROM fly_earth.pictures WHERE travel_id='
			+ req.params.id, function(err, result) {
		if (err)
			throw err;
		console.log(result[0]); // Column1 as a result
		console.log(result[1]); // Column2 as a result
		console.log(result[2]); // Column3 as a result
		res.send(result);
	});

};

