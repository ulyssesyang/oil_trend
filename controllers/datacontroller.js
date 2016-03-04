console.log('datacontroller loaded');

pry = require('pryjs');
var mongoose = require('mongoose');
var CountryModel = require('../models/countries.js');

module.exports.controller = function(app) {

  // data query based on data type name using regex function
  var regex = (req) => new RegExp((req.query.selection || 'Total Petroleum Consumption'), 'ig')

  //get by world
  app.get('/countries', function(req, res) {
    res.set('content-type', 'application/json');
    CountryModel.find({name: regex(req), year: {$lt: new Date('2014'), $gt: new Date(1980)}, country: /WLD/ig, unit: /Thousand Barrels Per Day/ig }).sort('year').exec(function(err, countries) {
      if (err) return next(err);
      // eval(pry.it);
      console.log(countries);
      res.send(countries);
    });
  });

  //get by country
	app.get('/countries/:country', function(req,res){
    res.set('content-type', 'application/json');
	  CountryModel.find({name: regex(req), year: {$lt: new Date('2014'), $gt: new Date(1980)}, country: { $size: 1 } , unit: /Thousand Barrels Per Day/ig , country_name: [req.params.country] }).sort('year').exec(function (err, coun) {
			if (err) return next(err);
      // eval(pry.it);
      console.log(coun);
	    res.send(coun);
	  });
	});

  //get by year
  app.get('/:year', function(req,res){
    res.set('content-type', 'application/json');
    CountryModel.find({name: regex(req), country: { $size: 1 } , unit: /Thousand Barrels Per Day/ig , year: new Date(req.params.year)}).sort('value').exec(function (err, coun) {
      if (err) return next(err);
      // eval(pry.it);
      console.log(coun);
      res.send(coun);
    });
  });

};

