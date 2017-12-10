import {projection, circles} from './d3_object/d3_init.js';
import {getLatLong} from '../data_service/data_prepare.js';

// Render Bubble Map Function
export function renderBubble(countries_arr, callback) {
    getLatLong(function (LatLong) {
        let scalefactor = 1 / 10;
        circles
            .selectAll("circle")
            .data(LatLong)
            .enter()
            .append("svg:circle")
            .transition(100)
            .duration(100)
            .ease("linear")
            .attr("cx", function (d, i) {
                return projection([ + d.longitude, + d.latitude
                ])[0];
            })
            .attr("cy", function (d, i) {
                return projection([ + d.longitude, + d.latitude
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
                    if (country.country_name[0] === d.name && country.value > 0) {
                        radius = country.value * scalefactor;
                    }
                });
                return (+ radius) * scalefactor;
            });

        if (callback && typeof callback === "function") {
            callback(true);
        }
    });
}