function renderHeatmap(g, topo, geo_path, countries_arr, tooltip, showGraphContainer) {
				var country = g
								.selectAll(".country")
								.data(topo);
				country
								.enter()
								.insert("path")
								.attr("class", "country")
								.attr("d", geo_path)
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
												countries_arr.forEach(function (country) {
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
																return parseInt(d);
												});
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
																				countries_arr.forEach(function (country) {
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