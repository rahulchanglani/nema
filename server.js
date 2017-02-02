// *** require modules ***
var express        = require('express'),
	app            = express(),
	mongoose       = require('mongoose'),
	bodyParser     = require('body-parser'),
	methodOverride = require('method-override'),
	morgan		   = require('morgan'),
	fs 	       	   = require('fs'),
	path     	   = require('path'),
	ir      	   = require('image-resizer'),
	env     	   = ir.env,
	Img     	   = ir.img,
	streams 	   = ir.streams,
	https   	   = require('https'),
	glob 		   = require('glob'),
	config 		   = require('./config/config'),
	async		   = require('async'),
	schedule 	   = require('node-schedule'),
	chalk		   = require('chalk'),
	device 		   = require('express-device');


// *** mongoose connection db ***
mongoose.connect(config.db);
//mongoose.connect('mongodb://localhost:27017/nema-db',{ server: { socketOptions: { keepAlive: 1 } } });

var db = mongoose.connection;
db.on('error', function () {
	console.log(chalk.bold.red('ERROR in connecting MongoDB'));
	throw new Error('unable to connect to database at ' + config.db);
});


// *** require db models ***
var models = glob.sync(config.root + '/models/*.js');
console.log(chalk.bold.blue('\nGlob Perform a synchronous glob search.') + chalk.blue.underline.bold('\n\n\tmodels'),models);//
models.forEach(function (model) {
  require(model);
});

var app = express();


/*--- Add a handler to inspect the req.secure flag (see
http://expressjs.com/api#req.secure). This allows us
to know whether the request was via http or https.---*/

// app.use(function(req, res, next) {
// 	console.log('secure or not ??',req.secure);
// 	console.log('\n hostname---',req.hostname);
// 	//console.log('next()....',next);	

//     if (req.secure || req.hostname.indexOf('api') == 0) {
//         // request was via https, continue
//         next();
//     } else {
//         // request was via http, so redirect to https
//         res.redirect('https://' + (req.hostname.indexOf('www') != 0 ? 'www.' : '') + req.headers.host.split(':')[0] + ':' + config.portSecure + req.url);
//     }


//  //    if (req.hostname == 'm.localhost') {
//  //    	console.log('\n redirect to mobile website---');
//  //    	res.redirect('http://m.cricbuzz.com/');
//  //    }
//  //    next();    
// });



// --- express detect device 

app.use(device.capture());

app.get('/',function(req, res, next) {
  //console.log('~~~~~~',JSON.stringify(req.device));
  console.log('*******',req.device.type.toUpperCase());

  	if (req.device.type.toUpperCase() != 'DESKTOP' && req.device.type.toUpperCase() == 'PHONE') {
    	//console.log('\n redirect to mobile website---');
    	res.redirect('http://m.cricbuzz.com/');
    }
    next();
});


//---Image-Resizer setup

// app.directory = __dirname+'/public';
//ir.expressConfig(app);


/*
Return an image modified to the requested parameters
  - request format:
    /:modifers/path/to/image.format:metadata
    eg: https://my.cdn.com/s50/sample/test.png
*/

// app.get('/cdn/*?', function(request, response){
// 		var image = new Img({path:request.path.replace('/cdn/','/')});
// 	  image.getFile()
// 	    .pipe(new streams.identify())
// 	    .pipe(new streams.resize())
// 	    .pipe(new streams.filter())
// 	    .pipe(new streams.optimize())
// 	    .pipe(streams.response(request, response));
// });


// require('./config/express')(app, config);

app.listen(config.port, function () {
  console.log('\n\t\t\t\tExpress server listening on port ' + config.port);
  console.log('\nNormalize a string path, taking care of .. and . parts. When multiple slashes are found, they are replaced by a single one; when the path contains a trailing slash, it is preserved. On windows backslashes are used. __dirname is not actually a global but rather local to each module. \n\n\t Root path...',config.root); 
});



// ---- https server

// var key = fs.readFileSync('./key.pem');
// var cert = fs.readFileSync('./cert.pem')
// var https_options = {
//     key: key,
//     cert: cert
// };

// server = https.createServer(https_options, app).listen(config.portSecure, function(){
//   console.log('Express server secure listening on port ' + config.portSecure);
// });






// -- node scheduler

var task = schedule.scheduleJob({hour: 17, minute: 47, dayOfWeek: 4}, function(){
    console.log('\n\n\tnode-schedule working.....');
});

var rule = new schedule.RecurrenceRule();
// rule.dayOfWeek = [0, new schedule.Range(4, 6)];
// rule.hour = 17;
// rule.minute = 0;
rule.second = 3;
 
var j = schedule.scheduleJob(rule, function(){
  console.log('\n\n\tevery hour....',new Date());
});

var startTime = new Date() + 500;
var endTime = startTime + 5000;
var kk = schedule.scheduleJob({ start: startTime, end: endTime, rule: '*/1 * * * * *' }, function(){
  console.log('\n\n\tTime for tea!');
});





// -- chalk

// style a string 
console.log(chalk.blue('\n\n\nHello world!'));
 
// combine styled and normal strings 
console.log(chalk.blue('Hello') + 'World' + chalk.red('!') + chalk.magenta('???????????'));
 
// compose multiple styles using the chainable API 
console.log(chalk.blue.bgRed.bold('Hello world!'));
 
// pass in multiple arguments 
console.log(chalk.blue('Hello', 'World!', 'Foo', 'bar', 'biz', 'baz'));
 
// nest styles 
console.log(chalk.red('Hello', chalk.underline.bgBlue('world') + '!'));
 
// nest styles of the same type even (color, underline, background) 
console.log(chalk.green(
    'I am a green line ' +
    chalk.blue.underline.bold('with a blue substring') +
    ' that becomes green again!'
));


var name = 'Sindre';
console.log(chalk.yellow('Hello %s'), name);


console.log(chalk.styles.red);
//=> {open: '\u001b[31m', close: '\u001b[39m'} 
 
console.log(chalk.styles.cyan.open + 'Hello' + chalk.styles.cyan.close + '\n\n');