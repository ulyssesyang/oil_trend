var express = require("express"),
  logger = require("morgan"),
  mongoose = require("mongoose");

// all environments
var app = express();
app.use(logger("dev"));
app.use(express.static("public"));
app.use(express.static(`${__dirname}/public`));

// Connect to mongodb in the cloud server or local server database
var mongoUrl = process.env.LOCALMONGO || process.env.MONGOLAB_URI;
mongoose.connect(mongoUrl, function (err) {
  if (err) {
    console.log(err);
  } else {
    console.log("connection successful");
  }
});

// Set up the port to listen
var port = (parseFloat(process.env.PORT)) || 3000;
app.listen(port, function () {
  console.log("App listening on port " + port + "...");
});

// Setup route for handling query
var route = require("./controllers/datacontroller");
route.controller(app);