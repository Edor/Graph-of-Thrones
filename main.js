var svg = d3.select("svg");
var width = window.innerWidth;//+svg.attr("width"),
var height = window.innerHeight;// +svg.attr("height");
svg.attr("width", width + "px");
svg.attr("height", height + "px");
var node;
var color = d3.scaleOrdinal(d3.schemeCategory20);
var di;
var radius = 7;
var house_radius = 16;
var simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(function id(d) {
        return d.id;
    }).distance(function (d) {
        return d.value;
    }))
    .force("charge", d3.forceManyBody().strength(-60))
    .force("center", d3.forceCenter(width / 2, height / 2))
    .force('collision', d3.forceCollide().radius(function(d) {
        return node.nodes()[d.id].getAttribute("r");
      }));
d3.json("data3.json", function (error, graph) {
    if (error) throw error;
    var link = svg.append("g")
        .selectAll("line")
        .data(graph.links)
        .enter().append("line")
        .style("stroke", getLinkStroke)
        .attr("class", getLinkClass)
        .attr("stroke-width", function (d) {
            return 4 / Math.sqrt(d.value) + 1;
        });
    node = svg.append("g")
        .selectAll("circle")
        .data(graph.nodes)
        .enter().append("circle")
        .attr("r", function(d){
           return getRadius(d);
        })
        .attr("id",function (d) {
            return d.id;
        })
        .style("stroke", getNodeStroke)
        .attr("fill", getNodeFill)
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended))
        .on("mouseover", handleMouseOver)
        .on("mouseout", handleMouseOut);

    node.append("title")
        .text(function (d) {
            return d.name;
        });
    simulation
        .nodes(graph.nodes)
        .on("tick", ticked);
    simulation.force("link")
        .links(graph.links);
    function getRadius(d){
            if (d.type == "house"){
                return house_radius;
            }else{
                return radius;
            }
    }

    function ticked() {
        link
            .attr("x1", function (d) {
                return d.source.x;
            })
            .attr("y1", function (d) {
                return d.source.y;
            })
            .attr("x2", function (d) {
                return d.target.x;
            })
            .attr("y2", function (d) {
                return d.target.y;
            });
        node
            .attr("cx", function (d) {
                d3.select("image#image"+d.id).attr("x", d.x - 32);
                d = validate(d);
                return d.x;
            })
            .attr("cy", function (d) {
                d3.select("image#image"+d.id).attr("y", d.y - 32);
                d = validate(d);
                return d.y;
            });

    }
    function validate(d){
        rad = radius;
         if(d.x - rad < 0){
            d.x = rad;
         }
         if(d.y - rad < 0){
            d.y = rad;
         }
         if(d.x + rad > width){
            d.x = width - rad;
         }
         if(d.y + rad > height){
            d.y = height - rad;
         }
         return d;
    }
    function handleMouseOver(d){
        node.nodes()[d.id].setAttribute("r",32);
        simulation.force('collision', d3.forceCollide().radius(function(d) {
            return node.nodes()[d.id].getAttribute("r");
        }));
        if (!d3.event.active) simulation.alphaTarget(0.1).restart();

        addImagePattern(d)
        node.nodes()[d.id].setAttribute("fill","url(#image)")

    }

     function handleMouseOut(d){
         simulation.force('collision', d3.forceCollide().radius(function(d) {
            return node.nodes()[d.id].getAttribute("r");
        }));
         if (!d3.event.active) simulation.alphaTarget(0);
        // if (!d3.event.active) simulation.alphaTarget(0.1).restart();

        node.nodes()[d.id].setAttribute("r",getRadius(d));
        removeImagePattern()
        node.nodes()[d.id].setAttribute("fill",getNodeFill(d))
    }
    function addImagePattern(d){
        d3.select('defs')
          .append('pattern')
          .attr('id', 'image')
          .attr('width', width)
          .attr('height', height)
          .attr('patternUnits', 'userSpaceOnUse')
          .append('image')
          .attr('x', d.x-32)
          .attr('y', d.y-32)
          .attr("id","image" + d.id)
          .attr('width', 64)
          .attr('height', 64)
          .attr('xlink:href', 'images/' + d.name + ".jpg");

    }
    function removeImagePattern(){
        d3.select('pattern').remove();
    }


});

function getNodeStroke(d) {
    if (d['group']) {
        return color(d['group']);
    } else if (d['house-marriage']) {
        return color(d['house-marriage']);
    } else if (d['house-birth']) {
        return color(d['house-birth']);
    } else if(d['type'] == 'house') {
        return color(d['name']);
    } else {
        return 'black';
    }
}
function getNodeFill(d) {
    if (d['group']) {
        return color(d['group']);
    } else if (d['house-marriage']) {
        return color(d['house-marriage']);
    } else if (d['house-birth']) {
        return color(d['house-birth']);
    } else if(d['type'] == 'house') {
        return color(d['name']);
    } else {
        return 'white';
    }

}
function getLinkStroke(d) {
    di =d;
    return d.stroke;
}
function getLinkClass(d){
    if (d.hasOwnProperty("relation")){
         return d.relation.replace("-","") + " links";
    }else{
        return "bound links";
    }

}

function dragstarted(d) {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
}

function dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
}

function dragended(d) {
    if (!d3.event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
}
// simulation.alphaTarget(0.3).restart();