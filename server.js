var express 			= require('express'),
		logger 				= require('morgan'),
		mongoose 			= require('mongoose'),
		fs 						= require('fs');

// all environments
var app = express();
app.use(logger('dev'));
app.use(express.static('public'));
app.use(express.static(`${__dirname}/public`));

//Connect to mongodb in the cloud server or local server database
var mongoUrl = process.env.MONGOLAB_URI || 'mongodb://localhost/energy-data';
mongoose.connect(mongoUrl, function (err) {
  if(err){
    console.log(err);
  }else {
    console.log('connection successful');
  }
});

//Set up the port to listen
var port = (parseFloat(process.env.PORT)) || 3000;
app.listen(port, function () {
  console.log('App listening on port '+port+'...');
});

//use fs to load controller file
fs.readdirSync('./controllers').forEach(function (file) {
  if(file.substr(-3) == '.js') {
      route = require('./controllers/' + file);
      route.controller(app);
  }
});
