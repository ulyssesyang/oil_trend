var mongoose = require('mongoose');
pry = require('pryjs');

var CountrySchema = mongoose.Schema({
	name: String,
  year: Date,
  value: Number,
  country: [String],
  country_name: [String],
  unit: String
});


var Country = mongoose.model("series", CountrySchema);

// eval(pry.it);

module.exports = Country;