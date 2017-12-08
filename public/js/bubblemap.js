/////////////////Render Bubble Map Function////////////////////////////
var renderBubble = function (data, circles, projection, countries_arr) {
    bubble = true;
    console.log('render bubble map');
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
                countries_arr.forEach(function (country) {
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