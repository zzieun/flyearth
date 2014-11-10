var mysql = require('mysql');
// var formidable = require('formidable');
// var path = require('path');
var dbconn = mysql.createConnection({
	host : 'localhost',
	user : 'root',
	password : '920808',
	database : 'fly_earth'
});
var http = require('http');

exports.save = function(req, res) {
	var trv_id;
	console.log(req.body.weather_set);
	var obj = JSON.parse(req.body.data);
	var weather_set=req.body.weather_set;
	console.log(obj[0]);
	
	var travel = {
		'user_id' : req.body.user_id,
		'travel_date' : req.body.travel_date,
		'title' : req.body.title,
		'memo' : req.body.memo
	}
	var query1 = dbconn.query('insert into travel set ? ', travel, function(
			err, result) {

		if (err) {
			console.error(err);
			throw err;
		}
		trv_id = result.insertId;
		console.log(trv_id);

		if (trv_id != null) {
			for (var i = 0; i < obj.length; i++)

			{

				var travel_loc = {

					'travel_id' : trv_id,
					'lat' : obj[i].lat,
					'lang' : obj[i].lang,
					'nation' : obj[i].nation,
					'city' : obj[i].city,
					'sub_address' : obj[i].formatted_address,
					'id_weather':weather_set. weather[0].id,
					'city_id':weather_set.id,
					'weather_icon':weather_set.weather[0].icon
				}
				console.log(weather_set. weather[0].id);
				var query = dbconn.query('insert into travel_loc set ? ',
						travel_loc, function(err, result) {

							if (err) {
								console.error(err);
								throw err;
							}
							console.log(result + "" + "!!!!");

							this.result = result;
							// res.send(result.insertId,'insertId');
							// res.send(result.insertId,'insertId');
						});
			}
			console.log(result + "");
			if (trv_id != null)
				res.send(200, trv_id + '');
		}
	});

};
getlocs=function(){}
exports.list = function(req, res) {

	var travels=[];
	var travle_locs=[];
	var travel_pluslocs=[];
	dbconn.query('SELECT * FROM fly_earth.travel t,fly_earth.travel_loc l where t.id_travel=l.travel_id and t.user_id='
			+ req.body.user_id, function(err, result) {
		console.log("result_list:" + result); // Column1 as a result

		if (err)
			throw err;

		res.send(result);
	});
};
/**
 * Create file upload
 */
// exports.fileup = function(req, res) {
//
// console.log("whar?? " + req.params.id);
// // console.log(req.files); // undefined
// // console.log(req.body); // {}
//
// // files와 body대신에 formimable middleware를 써준다.
// var form = new formidable.IncomingForm();
// form.uploadDir = __dirname + '/uploads';
// form.keepExtensions = true;
//
// form.on('error', function(err) {
// console.log('err');
// throw err;
// })
//
// .on('field', function(field, value) {
// // receive form fields here
// console.log(field, value);
// })
//
// /* this is where the renaming happens */
// .on('fileBegin', function(name, file) {
// // rename the incoming file to the file's name
// file.path = form.uploadDir + "/" + file.name;
// console.log(file.path + "");
// })
//
// .on(
// 'file',
// function(field, file) {
// // On file received
// // console.log(file);
// var pic = {
// 'travel_id' : req.params.id,
// 'pic_url' : file.path,
// 'org_url' : file.name,
//
// }
// // obj.search_citylist
// var query = dbconn.query('insert into pictures set ? ', pic,
// function(err, result) {
//
// if (err) {
// console.error(err);
// throw err;
// }
// this.result = result;
// // res.send(result.insertId,'insertId');
// // res.send(result.insertId,'insertId');
// });
// })
//
// .on('progress', function(bytesReceived, bytesExpected) {
// // self.emit('progess', bytesReceived, bytesExpected)
// console.log('progress');
// var percent = (bytesReceived / bytesExpected * 100) | 0;
// process.stdout.write('Uploading: %' + percent + '\r');
// }).on('end', function(req, res) {
// console.log('form end:\n\n');
//
// });
//
// form.parse(req, function(err) {
// res.redirect('/');
// console.log('form parse :\n\n');
// });
// };
// ----------------------------------------------------------
// exports.list = function(req, res) {
// dbconn.query('SELECT * FROM fly_earth.user WHERE id_user=1', function(err,
// result) {
// if (err)
// throw err;
// console.log(result[0]); // Column1 as a result
// console.log(result[1]); // Column2 as a result
// console.log(result[2]); // Column3 as a result
// res.send(result);
// });
//	
// };
// exports.info = function(req, res) {
// dbconn.query('SELECT * FROM fly_earth.user WHERE id_user='
// + req.body.id_user, function(err, result) {
// if (err)
// throw err;
// console.log(result[0]); // Column1 as a result
//
// res.send(result);
// });
// // res.send({ title: 'Express', view_engin: 'ejs', author: 'saebyeok'}); //
// // ̺κ responseBody json µǴ  Ȯϱ ؼ  ô.
// };
//
//
//
// exports.login = function(req, res) {
// // DB  κ
// var user = {
// 'email_id' : req.body.email_id,
// 'password' : req.body.password
// };
// console.log(user); // Column1 as a result
//
// dbconn.query(
// "SELECT * FROM fly_earth.user where email_id = '"
// + req.body.email_id + "'and password = '"
// + req.body.password + "'", function(err, result) {
// if (err)
// throw err;
// console.log(result[0]); // Column1 as a result
//				
// res.send(result);
// });
// };
