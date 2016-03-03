// var renderBubble = function(g, data) {
//   var country = g.selectAll(".country").data(topo);
//   debugger

//   var node = d3.select("svg .map")
//   .selectAll("g")
//   .data(data.features)
//   .enter().append("g")
//   .attr("id", function(d){ return d.properties.name;});
         
//   node
//   .append("circle")
//   .attr("transform", function(d) { return "translate(" + xy(d.geometry.coordinates) + ")"; })
//   .attr("id", function(d){ return d.id;})
//   .attr("class", "node")
//   .attr('fill','blue')
//   .attr('opacity',0.5)
//   .attr('r', function(d) { return d.properties.value/100})
//   .call(force.drag);

//   force.on("tick", function() {
//     node.attr( "transform", 
//     function(d) { return "translate(" + d.x + "," + d.y + ")"; });
//   });
// };
