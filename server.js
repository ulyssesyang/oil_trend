var express 			= require('express'),
		logger 				= require('morgan'),
		bodyParser 		= require('body-parser'),
		mongoose 			= require('mongoose'),
		fs 						= require('fs'),
		app 					= express();

// all environments
app.use(logger('dev'));
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(express.static(`${__dirname}/public`));

//Connect to mongodb
var mongoUrl = process.env.MONGOLAB_URI || 'mongodb://localhost/energy-data';
mongoose.connect(mongoUrl, function (err) {
  if(err){
    console.log(err);
  }else {
    console.log('connection successful');
  }
});

//Set up the port to listen
app.listen((parseFloat(process.env.PORT)) || 3000, function () {
  console.log('App listening on port 3000...');
});

// Controllers
fs.readdirSync('./controllers').forEach(function (file) {
  if(file.substr(-3) == '.js') {
      route = require('./controllers/' + file);
      route.controller(app);
  }
});
