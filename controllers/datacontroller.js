console.log("datacontroller loaded");

var CountryModel = require("../models/countries.js");

module.exports.controller = function (app) {

  // data query based on data type name using regex function
  var regex = function (req) {
    return new RegExp((req.query.selection || "Total Petroleum Consumption"), "ig");
  };

  //get by world
  app.get("/countries", function (req, res) {
    CountryModel.find({
      name: regex(req),
      year: {
        $lt: new Date("2014"),
        $gt: new Date(1980)
      },
        country: /WLD/ig,
        unit: /Thousand Barrels Per Day/ig
      })
      .sort("year")
      .exec(function (err, countries) {
        if (err) 
          return res.send(err);
        
        console.log("get all countries of ", req.query.selection);
        res.send(countries);
      });
  });

  //get by country
  app.get("/countries/:country", function (req, res) {
    CountryModel.find({
      name: regex(req),
      year: {
        $lt: new Date("2014"),
        $gt: new Date(1980)
      },
      country: {
        $size: 1
      },
        unit: /Thousand Barrels Per Day/ig,
        country_name: [req.params.country]
    })
      .sort("year")
      .exec(function (err, country) {
        if (err) 
          return res.send(err);
        
        console.log("get data for only country: ", req.params.country, " of ", req.query.selection);
        res.send(country);
      });
  });

  //get by year
  app.get("/:year", function (req, res) {
    CountryModel.find({
      name: regex(req),
      country: {
        $size: 1
      },
        unit: /Thousand Barrels Per Day/ig,
        year: new Date(req.params.year)
      })
      .sort({value: -1})
      .exec(function (err, country) {
        if (err) 
          return res.send(err);
        
        console.log("get all countries of year: ", req.params.year, " of ", req.query.selection);
        res.send(country);
      });
  });

};
