/*
 * GET users listing.
 */
var mysql = require('mysql');

var dbconn = mysql.createConnection({
	host : 'localhost', // �⺻��Ʈ�� 3306���� �Ǿ��ִ� ��쿡�� ��Ʈ ������ �ʿ����.
	user : 'root',
	password : '920808',
	database : 'fly_earth'
});

exports.list = function(req, res) {
	dbconn.query('SELECT * FROM fly_earth.user WHERE id_user=1', function(err,
			result) {
		if (err)
			throw err;
		console.log(result[0]); // Column1 as a result
		console.log(result[1]); // Column2 as a result
		console.log(result[2]); // Column3 as a result
		res.send(result);
	});
	// res.send({ title: 'Express', view_engin: 'ejs', author: 'saebyeok'}); //
	// �̺κ��� responseBody�� json���� ��µǴ� ���� Ȯ���ϱ� ���ؼ� ������ �ô�.
};
exports.info = function(req, res) {
	dbconn.query('SELECT * FROM fly_earth.user WHERE id_user='
			+ req.body.id_user, function(err, result) {
		if (err)
			throw err;
		console.log(result[0]); // Column1 as a result

		res.send(result);
	});
	// res.send({ title: 'Express', view_engin: 'ejs', author: 'saebyeok'}); //
	// �̺κ��� responseBody�� json���� ��µǴ� ���� Ȯ���ϱ� ���ؼ� ������ �ô�.
};

exports.add = function(req, res) {
	var user = {
		'id_user' : req.body.id_user,
		'email_id' : req.body.email_id,
		'name' : req.body.name,
		'password' : req.body.password
	};
	console.log(req.body.email_id);
	var query1 = dbconn.query("select * from user where email_id = '"
			+ req.body.email_id + "'", function(err, result) {

		if (err) {
			cosole.error(err);
			throw err;
		}
		// console.log(result);
		if (result.length < 1) {
			var query = dbconn.query('insert into user set ? ', user, function(
					err, result) {

				if (err) {
					cosole.error(err);
					throw err;
				}
				console.log(query);
				res.send(200, result.insertId + '');
				// res.send(result.insertId,'insertId');
				// res.send(result.insertId,'insertId');
			});

		} else
			res.send(205, 'same_id');// �ߺ� id
		// result=null;
	});

};

exports.login = function(req, res) {
	// DB ���� �κ�
	var user = {
		'email_id' : req.body.email_id,
		'password' : req.body.password
	};
	console.log(user); // Column1 as a result

	dbconn.query(
			"SELECT * FROM fly_earth.user where email_id = '"
					+ req.body.email_id + "'and password = '"
					+ req.body.password + "'", function(err, result) {
				if (err)
					throw err;
				console.log(result[0]); // Column1 as a result
				
				res.send(result);
			});
};


exports.send_email = function(req, res) {

	
		function randNum() {
			var ALPHA = [ 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k',
					'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w',
					'x', 'y', 'z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9' ];
			var rN = '';
			for (var i = 0; i < 8; i++) {
				var randTnum = Math.floor(Math.random() * ALPHA.length);
				rN += ALPHA[randTnum];
			}
			return rN;
		}
		var newPassw = randNum();
		var query =	dbconn.query("UPDATE fly_earth.user SET password = '" + newPassw
				+ "'WHERE email_id = '" + req.body.email_id + "'", function(err,
				result) {
			if (err)
				throw err;
			console.log(query); // Column1 as a result

			var nodemailer = require('nodemailer');

			// create reusable transporter object using SMTP transport
			var transporter = nodemailer.createTransport({
			    service: 'Gmail',
			    auth: {
			    	user: 'jij9190@gmail.com',
					pass: '9108jin08'
			    }
			});

			// NB! No need to recreate the transporter object. You can use
			// the same transporter object for all e-mails

			// setup e-mail data with unicode symbols
			var mailOptions = {
			    from: 'FlyEarth  <jij9190@gmail.com>', // sender address
			    to:  req.body.email_id, // list of receivers
			    subject: 'Hello ? FlytotheEarth!', // Subject line
			    text: 'Hello world ✔', // plaintext body
			    html: '<b>새 비밀번호는  ✔ '+newPassw+'</b>' // html body
			};

			// send mail with defined transport object
			transporter.sendMail(mailOptions, function(error, info){
			    if(error){
			        console.log(error);
			    }else{
			        console.log('Message sent: ' + info.response);
			    }
			});
			
			
			
			
			
			
			
			
			
			res.send(result);
		});
	
	
	
	
	

};
