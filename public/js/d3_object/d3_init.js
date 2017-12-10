import {width, height} from '../data_service/data_prepare.js';

// translate graph base on width and height
function move() {
    let t = d3.event.translate,
        s = d3.event.scale,
        h = height / 3;

    t[0] = Math.min(width / 2 * (s - 1), Math.max(width / 2 * (1 - s), t[0]));
    t[1] = Math.min(height / 2 * (s - 1) + h * s, Math.max(height / 2 * (1 - s) - h * s, t[1]));

    zoom.translate(t);

    g
        .style("stroke-width", 1 / s)
        .attr("transform", "translate(" + t + ")scale(" + s + ")");

}

/**
 * Initialize D3 SVG MAP
 * setup zoom scale the width determines how zoomed in
 */
const zoom = d3
    .behavior
    .zoom()
    .scaleExtent([1, 1])
    .on("zoom", move);

export const projection = d3
    .geo
    .mercator()
    .translate([0, 80])
    .scale(width / 1.75 / Math.PI);

export const geo_path = d3
    .geo
    .path()
    .projection(projection);

//the number you divide by width changes how the map is translated in the window
export const svg = d3
    .select("#mapcontainer")
    .append("svg")
    .attr("class", "map")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + width / 2.3 + "," + height / 2.2 + ")")
    .call(zoom);

export const g = svg
    .append("g")
    .attr("id", "countries");

export const circles = svg
    .append("svg:g")
    .attr("id", "circles");

export const tooltip = d3
    .select("#container")
    .append("div")
    .attr("class", "tooltip hidden");
