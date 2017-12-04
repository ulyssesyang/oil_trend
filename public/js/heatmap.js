$(document)
				.ready(function () {

								console.log("onload");
								//////////////////////Global Variable Initialize//////////////////////////////
								var arrayChoropleth = [];
								var array2000 = [];
								var data_selection = "Total Petroleum Consumption";
								var last_url;
								var year;
								var arrayYears = new Array("1980", "1981", "1982", "1983", "1984", "1985", "1986", "1987", "1988", "1989", "1990", "1991", "1992", "1993", "1994", "1995", "1996", "1997", "1998", "1999", "2000", "2001", "2002", "2003", "2004", "2005", "2006", "2007", "2008", "2009", "2010", "2011", "2012", "2013", "2014");
								var refreshData = function (callback) {
												arrayChoropleth = [];
												populateArray(callback);
								};
								var loadingState = false;

								//////////////////////Showing Loading Status//////////////////////////////
								function loadingStatus(changeState) {
												if (changeState) {
																loadingState = changeState;
																$("body").append("<div id=\"loading\"><img id=\"loading_img\" src=\"/images/loading.gif\" height=" +
																								"\"64px\" width=\"64px\"></div>");
												} else {
																$("#loading").remove();
																loadingState = changeState;
												}
								}

								//////////////////Initialize Dropdown list//////////////////////
								var selObj = $("#dropdown");
								for (var i = 0; i < arrayYears.length; ++i) {
												addOption(selObj, arrayYears[i], arrayYears[i]);
								}

								function addOption(selectbox, text, value) {
												selectbox.append($("<option/>", {
																value: value,
																text: text
												}));
								}

								////////////////Use Search to get year //////////////////////
								$("#year_search_bnt")
												.on("click", function () {
																$("#dropdown").val($("#input_year").val());
																refreshData();
												});

								////////////////Play History Data/////////////////////////////
								$(function () {
												$(".navbar-form")
																.submit(function () {
																				return false;
																}); //prevent submit search form
								});

								$("#history_revew_bnt").on("click", function () {
												// recursive to call all year by adding i
												var iterate = function (i, next, callback) {
																if (i++ < arrayYears.length) {
																				console.log(data_selection + ": " + arrayYears[i]);
																				$("#dropdown :selected").text(arrayYears[i]);
																				$("#input_year").val(arrayYears[i]);
																				refreshData(function (error) {
																								if (error) {
																												callback(error);
																								} else {
																												// set timer to delay
																												setTimeout(function () {
																																next(i, next, callback);
																												}, 500);
																								}
																				});
																} else {
																				callback();
																}
												};
												//after recursive all years, will return to year 2000
												iterate(0, iterate, function () {
																year = 2000;
																$("#dropdown :selected").text(year);
																$("#input_year").val(year);
																$("#data_title").text(data_selection + ": " + year);
																refreshData();
												});
								});

								////////////////Data type selection///////////////////////////
								$(".dropdown-menu li").on("click", function (argument) {
												data_selection = $(this).text();
												$(".data-selection-label").text(data_selection);
												refreshData();
								});

								//////////////////Initialize D3 SVG MAP///////////////////////////////////
								d3
												.select(window)
												.on("resize", throttle);
								// setup zoom scale
								var zoom = d3
												.behavior
												.zoom()
												.scaleExtent([1, 1])
												.on("zoom", move);

								// setup map size
								var width = document
												.getElementById("mapcontainer")
												.offsetWidth;
								// var height = width / 1.5;
								var height = $(window).height() - $(".navbar.navbar-default").height() * 2;
								var topo,
												projection,
												path,
												svg,
												g,
												circles;
								var tooltip = d3
												.select("#container")
												.append("div")
												.attr("class", "tooltip hidden");

								setup(width, height);

								function setup(width, height) {
												projection = d3
																.geo
																.mercator()
																.translate([0, 80])
																.scale(width / 1.75 / Math.PI); //the width / # determines how zoomed in it is

												path = d3
																.geo
																.path()
																.projection(projection);

												svg = d3
																.select("#mapcontainer")
																.append("svg")
																.attr("class", "map")
																.attr("width", width)
																.attr("height", height)
																.append("g")
																.attr("transform", "translate(" + width / 2.3 + "," + height / 2.2 + ")") //the number you divide by width changes how the map is translated in the window
																.call(zoom);

												g = svg
																.append("g")
																.attr("id", "countries");

												circles = svg
																.append("svg:g")
																.attr("id", "circles");

								}

								///////////////////////////update Heat Map base on input year///////
								$("#input_year")
												.change(function () {
																$("#dropdown").val($(this).val());
																refreshData();
												});

								///////////////////////////Initialize world topo map/////////////////
								d3.json("data/world-topo.json", function (error, world) {
												var countries = topojson
																.feature(world, world.objects.countries)
																.features;
												topo = countries;
												draw(topo);
								});

								var populateArray = function (callback) {
												var year = $("#dropdown :selected").text();
												// debugger
												if (year === "Year List") {
																year = 2000;
												}

												$
																.ajax({
																				url: "/" + year + `?selection=${data_selection}`,
																				method: "GET",
																				dataType: "json"
																})
																.done(function (data) {
																				pushToArray(data);
																				redraw(topo);
																				renderBubble(data);
																				// topic title update
																				$("#data_title").text(data_selection + ": " + year);
																				// update top countries list
																				if (data.length > 0) {
																								$(".top_countries").empty();
																								$(".top_countries").append("<li><p>World: " + data[0].value + "</p></li>");
																								//default top 16 countries
																								var listNum = 16;
																								//if less than 16 countries data, then just list all countries in the data
																								if (data.length < listNum) {
																												listNum = data.length;
																								}
																								for (var i = 1; i < listNum; i++) {
																												if (data[i].country_name[0] != undefined) {
																																$("ul.top_countries").append("<li><p>" + data[i].country_name[0] + ": " + data[i].value + "</li></p>");
																												} else {
																																$("ul.top_countries").append("<li><p>" + data[i].country[0] + ": " + data[i].value + "</li></p>");
																												}
																								}
																				}
																				if (callback && typeof callback === "function") {
																								callback();
																				}
																});
								};

								var pushToArray = function (data) {
												data
																.forEach(function (country) {
																				arrayChoropleth.push(country);
																});
								};
								window.populateArray = populateArray;

								populateArray();

								function populate2000Array() {
												last_url = `/2000?selection=${data_selection}`;
												$
																.ajax({url: "/2000", method: "GET", dataType: "json"})
																.done(pushTo2000Array);
								}

								var pushTo2000Array = function (data) {
												loadingStatus(false);
												console.log("initial loading all countries data in year 2000");
												data.forEach(function (country) {
																array2000.push(country);
												});
								};
								loadingStatus(true);
								populate2000Array();

								/////////////////////Redraw Topo map////////////////////////////
								function redraw() {
												d3
																.select(".map")
																.remove();
												setup(width, height);
												draw(topo);
								}

								function move() {
												var t = d3.event.translate;
												var s = d3.event.scale;
												var h = height / 3;

												t[0] = Math.min(width / 2 * (s - 1), Math.max(width / 2 * (1 - s), t[0]));
												t[1] = Math.min(height / 2 * (s - 1) + h * s, Math.max(height / 2 * (1 - s) - h * s, t[1]));

												zoom.translate(t);
												g
																.style("stroke-width", 1 / s)
																.attr("transform", "translate(" + t + ")scale(" + s + ")");

								}

								///////////////////////Set timer for redraw topo map////////////
								var throttleTimer;

								function throttle() {
												window.clearTimeout(throttleTimer);
												throttleTimer = window.setTimeout(function () {
																redraw();
												}, 200);
								}

								/////////////////////draw topo graph//////////////////////////
								function draw(topo) {
												var country = g
																.selectAll(".country")
																.data(topo);
												// debugger
												country
																.enter()
																.insert("path")
																.attr("class", "country")
																.attr("d", path)
																.attr("id", function (d, i) {
																				return d.id;
																})
																.style("fill", function (d, i) {
																				return d.properties.color;
																})
																.attr("title", function (d, i) {
																				return d.properties.name;
																})
																.transition() // animation feature
																.duration(100) //control speed of draw map
																.style("fill", function (d, i) {
																				var col;
																				var scaled = 0; //initialize as empty color each time
																				arrayChoropleth.forEach(function (country) {
																								// match topo country name with data country name
																								if (country.country_name[0] === d.properties.name) {
																												// scale topo country color based on data value
																												scaled = d3
																																.scale
																																.linear()
																																.domain([0, 1000])
																																.range([0, 4000]);
																												col = "hsl(45," + scaled(country.value / 100) + "%,50%)";
																								}
																				});
																				d.properties.color = col;
																				// console.log('color_scale done: '+col);
																				return d.properties.color;
																});
												//offsets plus width/height of transform
												var offsetL = document
																.getElementById("worldmap")
																.offsetLeft + (width / 2.75);
												var offsetT = document
																.getElementById("worldmap")
																.offsetTop + (height / 2);

												//get country info when mouse over
												country.on("mousemove", function (d, i) {
																var mouse = d3
																				.mouse(svg.node())
																				.map(function (d) {
																								// debugger
																								return parseInt(d);
																				});
																array2000.forEach(function (country) {
																				if (typeof(d.properties.color) === "undefined") {

																								tooltip
																												.classed("hidden", false)
																												.attr("style", "left:" + (mouse[0] + offsetL + 400) + "px;top:" + (mouse[1] + offsetT) + "px")
																												.html(d.properties.name);

																				} else {
																								tooltip
																												.classed("hidden", false)
																												.attr("style", "left:" + (mouse[0] + offsetL + 200) + "px;top:" + (mouse[1] + offsetT) + "px")
																												.html(function () {
																																var value;
																																arrayChoropleth.forEach(function (country) {
																																				if (country.country_name[0] === d.properties.name) {
																																								value = country.value;
																																				}
																																});
																																//based upon drop down selection get that year's price data
																																if ($("#dropdown :selected").text() != "Now") {
																																				return "<u>" + d.properties.name + "</u><br><strong> Value:</strong> " + value;
																																} else {
																																				return "<u>" + d.properties.name + "</u><br><strong> Value:</strong> " + value;
																																}
																												});
																				}
																});
												}) //end mousemove
																.on("mouseout", function (d, i) {
																				tooltip.classed("hidden", true); //hide country info when mouth out
																});

												//call country history line graph function when click
												country.on("click", function (d, i) {
																if (d.properties.color !== undefined && !loadingState) {
																				showGraphContainer(d, i);
																}
												});
								}

								/////////////////////Redraw Map Whenver Select Year//////////////////
								$("select").on("change", refreshData);

								/////////////////////Render Country History Line Graph////////////////
								var showGraphContainer = function (d, i) {
												var mouse = d3
																.mouse(svg.node())
																.map(function (d) {
																				return parseInt(d);
																});
												loadingStatus(true);
												last_url = `/countries/${d.properties.name}?selection=${data_selection}`;
												$
																.ajax({
																				url: "/countries/" + d.properties.name + "?selection=" + data_selection,
																				method: "GET",
																				dataType: "json"
																})
																.done(function (data) {
																				renderLineChart(data);
																				loadingStatus(false);
																});
												// $.getJSON(`/countries/${d.properties.name}`, renderAllGraphs);
								};

								//////////////////////World Line Graph//////////////////////////////
								$("#world_trend").on("click", function () {
												$(".overlay").empty();
												var worldGraph = function () {
																loadingStatus(true);
																last_url = `/countries?selection=${data_selection}`;
																$
																				.ajax({
																								url: "/countries?selection=" + data_selection,
																								method: "GET",
																								dataType: "json"
																				})
																				.done(function (data) {
																								renderWorld(data);
																								loadingStatus(false);
																				});
												};
												worldGraph();
												$("img#loading").remove();
												$(".overlay").css("display", "inline-block");
												$("#mapcontainer").on("click", function () {
																$(".overlay").empty();
												});
								});

								/////////////////Render Bubble Map Function////////////////////////////
								var renderBubble = function (data) {
												bubble = true;
												d3.csv("data/countries.csv", function (csv) {
																var scalefactor = 1 / 10;

																circles
																				.selectAll("circle")
																				.data(csv)
																				.enter()
																				.append("svg:circle")
																				.transition(100)
																				.duration(100)
																				.ease("linear")
																				.attr("cx", function (d, i) {
																								return projection([ + d["longitude"], + d["latitude"]
																								])[0];
																				})
																				.attr("cy", function (d, i) {
																								return projection([ + d["longitude"], + d["latitude"]
																								])[1];
																				})
																				.attr("id", function (d) {
																								return d.name;
																				})
																				.attr("class", "node")
																				.attr("fill", "#3B5671")
																				.attr("opacity", 0.5)
																				.attr("r", function (d) {
																								var radius = 0;
																								arrayChoropleth.forEach(function (country) {
																												// debugger
																												if (country.country_name[0] === d.name && country.value > 0) {
																																radius = country.value * scalefactor;
																																// console.log(country.value*scalefactor);
																												}
																								});
																								return (+ radius) * scalefactor;
																				});
												});
								};

								///////////////////Show Bubble Map///////////////////////////
								$(".bubble_map").on("click", function (argument) {
												console.log("Show Bubble Map");
												refreshData();
												circles.classed("hidden", false);
								});

								/////////////////Remove Bubble Map////////////////////////////
								$(".heat_map").on("click", function (argument) {
												console.log("Hide Bubble Map");
												circles.classed("hidden", true);
								});

				}); //end onload