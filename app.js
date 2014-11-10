/**
 * Module dependencies.
 */

var express = require('express'), routes = require('./routes'), user = require('./routes/user'), travel = require('./routes/travel'), pictures = require('./routes/pictures'), http = require('http'), path = require('path');

var app = express();
var formidable = require('formidable');
var mysql = require('mysql');

var http = require('http');
var path = require('path');

// all environments
app.set('port', process.env.PORT || 3333);
app.set('views', path.join(__dirname, 'views'));

app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
// app.get('/user', function(req, res, next) {
// res.render('index', {});
//
// });
// app.listen(3000);
// development only
if ('development' == app.get('env')) {
	app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);
app.post('/login', user.login);
app.post('/add_user', user.add);
app.post('/user_info', user.info);
app.post('/write_save', travel.save);
app.post('/travel_list', travel.list);
app.post('/send_email', user.send_email);
app.post('/piclist/:id', pictures.piclist);
app.use(express.json());
app.use(express.urlencoded());
app.use(express.multipart());

// app.use('/upload', express.static(__dirname + "/uploads"));

app.use('/views', express.static(__dirname + "/views"));
app.use('/views/js', express.static(__dirname + "/views/js"));
app.use('/views/webgl', express.static(__dirname + "/views/webgl"));
app.use('/uploads', express.static(__dirname + "/uploads"));
app.use('/video', express.static(__dirname + "/video"));

http.createServer(app).listen(app.get('port'), function() {
	console.log('Express server listening on port ' + app.get('port'));
});
// ------------------------------------------

var fs = require('fs');
var request = require('request');

// middleware set
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(app.router); // page rout
app.use(express.static(path.join(__dirname, '../public')));

app.use(express.cookieParser());

// connect.limit() will be removed in connect 3.0
// app.use(express.limit('10mb'));
app.use(express.urlencoded({
	limit : '1000mb'
}));

// connect.multipart() will be removed in connect 3.0
// app.use(express.bodyParser({upload: 'multipart'}));
app.use(express.urlencoded({
	upload : 'multipart'
}));

// router set

app.post('/upload/:id', function(req, res) {
	var app_res = res;
	var dbconn = mysql.createConnection({
		host : 'localhost',
		user : 'root',
		password : '920808',
		database : 'fly_earth'
	});

	console.log(req.params.id);
	console.log(req.files); // undefined
	console.log(req.body); // {}

	// files와 body대신에 formimable middleware를 써준다.
	var form = new formidable.IncomingForm();
	form.uploadDir = __dirname + '/uploads';
	form.keepExtensions = true;

	form.on('error', function(err) {
		console.log('err:' + err);
		throw err;
	})

	.on('field', function(field, value) {
		// receive form fields here
		console.log(field, value);
	})

	/* this is where the renaming happens */
	.on(
			'fileBegin',
			function(name, file) {
				// rename the incoming file to the file's name
				var d = new Date();
				var type = file.name.split(".");
				console.log(type);
				// file.path = form.uploadDir + "/" + file.name;
				file.name = req.params.id + "_" + d.getTime() + "."
						+ type[type.length - 1];
				file.path = form.uploadDir + "/" + file.name;

				console.log(file.path + "");
			})

	.on(
			'file',
			function(field, file) {
				// On file received
				// console.log(file);
				var pic = {
					'travel_id' : req.params.id,
					'pic_url' : file.name,
					'org_url' : file.path,

				}
				// obj.search_citylist
				var query = dbconn.query('insert into pictures set ? ', pic,
						function(err, result) {

							if (err) {
								console.error(err);
								throw err;
							}
							this.result = result;
							// res.send(result.insertId,'insertId');
							// res.send(result.insertId,'insertId');
						});
			})

	.on('progress', function(bytesReceived, bytesExpected) {
		// self.emit('progess', bytesReceived, bytesExpected)
		console.log('progress');
		var percent = (bytesReceived / bytesExpected * 100) | 0;
		process.stdout.write('Uploading: %' + percent + '\r');
	}).on('end', function(req, res) {
		app_res.status(200);
		console.log('form end:\n\n');

	});

	form.parse(req, function(err) {
		res.redirect('/');
		console.log('form parse :\n\n');
	});
});
