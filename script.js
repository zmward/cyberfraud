//Width and height
var w = 600;
var h = 350;

//Add commas to numbers
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
//Creating a function to dispay number like: 1.2 Million
function niceNumber(x) {
    uglyNum = x;
    niceNum = x / 1000000;
    twoPlacedFloat = parseFloat(niceNum).toFixed(1);
    return twoPlacedFloat;

}
//Taking M# or F# and giving correct age range
function targetType(x) {
    target = x;

    if (target == "M1") {
        return ("Males Under 20");
    } else if (target == "M2") {
        return ("Males 20-29");
    } else if (target == "M3") {
        return ("Males 30-39");
    } else if (target == "M4") {
        return ("Males 40-49");
    } else if (target == "M5") {
        return ("Males 50-59");
    } else if (target == "M6") {
        return ("Males 60 & Over");
    } else if (target == "F1") {
        return ("Females Under 20");
    } else if (target == "F2") {
        return ("Females 20-29");
    } else if (target == "F3") {
        return ("Females 30-39");
    } else if (target == "F4") {
        return ("Females 40-49");
    } else if (target == "F5") {
        return ("Females 50-59");
    } else if (target == "F6") {
        return ("Females 60 & Over");
    } else {
        return ("Error");
    }

}



//Define map projection
var projection = d3.geo.albersUsa()
    .translate([w / 2, h / 2])
    .scale([700]);

//Define path generator
var path = d3.geo.path()
    .projection(projection);

//new function (from http://sureshlodha.github.io/SFvsLA/maps.js)
var Popcolor = d3.scale.quantize()
    .range(["#fef0d9", "#fdbb84", "#fc8d59", "#e34a33", "#b30000", "#7f0000"]);
//.domain([0.14, 3.33]);

//Define quantize scale to sort data values into buckets of color
var color = d3.scale.quantize()
    .range(["#fef0d9", "#fdbb84", "#fc8d59", "#e34a33", "#b30000", "#7f0000"]).domain([0, 6]);

//Colors taken from colorbrewer.js, included in the D3 download

//Create first map SVG element
var svg1 = d3.select("#section31")
    .append("svg")
    .style("height", 350)
    .style("width", 600)
    .style("background", "white")
    .style("float", "left");

//Create second map SVG element
var svg2 = d3.select("#section32")
    .append("svg")
    .style("height", 350)
    .style("width", 600)
    .style("float", "right")
    .style("background", "white");

//Create first pie chart SVG element
var svg3 = d3.select("#section311")
    .append("svg")
    .style("height", 200)
    .style("width", 300)
    .style("background", "white");

//Create second pie chart SVG element
var svg4 = d3.select("#section312")
    .append("svg")
    .style("height", 200)
    .style("width", 300)
    .style("background", "white");

//Create second pie chart SVG element
var svg5 = d3.select("#section321")
    .append("svg")
    .style("height", 200)
    .style("width", 300)
    .style("background", "white");

//Create second pie chart SVG element
var svg6 = d3.select("#section322")
    .append("svg")
    .style("height", 200)
    .style("width", 300)
    .style("background", "white");

//Create legend1
var svg7 = d3.select("#section33")
    .append("svg")
    .style("height", 350)
    .style("width", 80)
    .style("background", "white");

//Create legend2
var svg8 = d3.select("#section313")
    .append("svg")
    .style("height", 200)
    .style("width", 80)
    .style("background", "white");

//Define Tooltip
var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

d3.csv("datasetfor2012.csv", function (data) {

    //Set input domain for color scale
    color.domain([
					d3.min(data, function (d) {
            return d.value;
        })









        
        , d3.max(data, function (d) {
            return d.value;
        })
				]);

    //Load in GeoJSON data
    d3.json("us-states.json", function (json) {

        //Merge the ag. data and GeoJSON
        //Loop through once for each ag. data value
        for (var i = 0; i < data.length; i++) {

            //Grab state name
            var dataState = data[i].state;

            //Grabing Main Target and Main Target Loss
            var dataMainTarget = data[i].MainTarget;

            //Grab data value, and convert from string to float
            var dataValue = parseFloat(data[i].value);
            var dataMainTargetLoss = parseFloat(data[i].MainTargetLoss);
            var dataPopulation = parseFloat(data[i].Population);
            var dataTotalComplaints = parseFloat(data[i].total_complaints);

            //Find the corresponding state inside the GeoJSON
            for (var j = 0; j < json.features.length; j++) {

                var jsonState = json.features[j].properties.name;

                if (dataState == jsonState) {

                    //Copy the data value into the JSON
                    json.features[j].properties.value = dataValue;
                    json.features[i].properties.state = dataState;
                    json.features[i].properties.MainTarget = dataMainTarget;
                    json.features[i].properties.MainTargetLoss = dataMainTargetLoss;
                    json.features[i].properties.Population = dataPopulation;
                    json.features[i].properties.total_complaints = dataTotalComplaints;

                    //Stop looking through the JSON
                    break;

                }
            }
        }

        //Bind data and create one path per GeoJSON feature
        svg1.selectAll("path")
            .data(json.features)
            .enter()
            .append("path")
            .attr("class", "state-boundary")
            .attr("d", path)
            .style("fill", function (d) {
                //Get data value
                var value = d.properties.value;
                var state = d.properties.state;
                var MainTarget = d.properties.MainTarget;
                var Population = d.properties.Population;
                var complaints = d.properties.total_complaints;



                if (value) {
                    //If value exists…
                    return Popcolor(value / complaints);
                } else {
                    //If value is undefined…
                    return "#ccc";
                }
            })


        .on("mouseover", function (d) {
                tooltip.transition()
                    .duration(0)
                    .style("opacity", .9);
                tooltip.html("<center>" + d.properties.state + " $" + niceNumber(d.properties.value) + " Million" + "</center><br>" + "<span style='float:left;'>" + "Main Target: " + "</span>" + "<span style='float:right;'>" + targetType(d.properties.MainTarget) + "</span><br>" + "<span style='float:left;'>" + "Loss per capita: " + "</span>" + "<span style='float:right;'>" + "$" + (d.properties.value / d.properties.total_complaints).toFixed(2) + "</span>")
                    .style("left", (d3.event.pageX + 5) + "px")
                    .style("top", (d3.event.pageY - 28) + "px");
            })
            .on("mouseout", function (d) {
                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
            });


    });

});

d3.csv("datasetfor2014.csv", function (data) {

    //Set input domain for color scale
    color.domain([d3.min(data, function (d) {
            return d.value;
        })









        
        , d3.max(data, function (d) {
            return d.value;
        })
				]);

    //Load in GeoJSON data
    d3.json("us-states.json", function (json) {

        //Merge the ag. data and GeoJSON
        //Loop through once for each ag. data value
        for (var i = 0; i < data.length; i++) {

            //Grab state name
            var dataState = data[i].state;
            //Grabing Main Target and Main Target Loss
            var dataMainTarget = data[i].MainTarget;

            //Grab data value, and convert from string to float
            var dataValue = parseFloat(data[i].value);
            var dataMainTargetLoss = parseFloat(data[i].MainTargetLoss);
            var dataPopulation = parseFloat(data[i].Population);
            var dataTotalComplaints = parseFloat(data[i].total_complaints);

            //Find the corresponding state inside the GeoJSON
            for (var j = 0; j < json.features.length; j++) {

                var jsonState = json.features[j].properties.name;

                if (dataState == jsonState) {

                    //Copy the data value into the JSON
                    json.features[j].properties.value = dataValue;
                    json.features[i].properties.state = dataState;
                    json.features[i].properties.MainTarget = dataMainTarget;
                    json.features[i].properties.MainTargetLoss = dataMainTargetLoss;
                    json.features[i].properties.Population = dataPopulation;
                    json.features[i].properties.total_complaints = dataTotalComplaints;

                    //Stop looking through the JSON
                    break;

                }
            }
        }

        //Bind data and create one path per GeoJSON feature
        svg2.selectAll("path")
            .data(json.features)
            .enter()
            .append("path")
            .attr("class", "state-boundary")
            .attr("d", path)
            .style("fill", function (d) {
                //Get data value
                var value = d.properties.value;
                var state = d.properties.state;
                var MainTarget = d.properties.MainTarget;
                var Population = d.properties.Population;
                var complaints = d.properties.total_complaints;


                if (value) {
                    //If value exists…
                    return Popcolor(value / complaints);
                } else {
                    //If value is undefined…
                    return "#ccc";
                }
            })
            .on("mouseover", function (d) {
                tooltip.transition()
                    .duration(200)
                    .style("opacity", .9);
                tooltip.html("<center>" + d.properties.state + " $" + niceNumber(d.properties.value) + " Million" + "</center><br>" + "<span style='float:left;'>" + "Main Target: " + "</span>" + "<span style='float:right;'>" + targetType(d.properties.MainTarget) + "</span><br>" + "<span style='float:left;'>" + "Loss per capita: " + "</span>" + "<span style='float:right;'>" + "$" + (d.properties.value / d.properties.total_complaints).toFixed(2) + "</span>")
                    .style("left", (d3.event.pageX + 5) + "px")
                    .style("top", (d3.event.pageY - 28) + "px");
            })
            .on("mouseout", function (d) {
                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
            });


    });

});

///////////////////////////////// 2012 FEMALE PIE CHART ///////////////////////////////////////

var color1 = d3.scale.ordinal()
    .range(["#fef0d9", "#fdbb84", "#fc8d59", "#e34a33", "#b30000", "#7f0000"]);
//["#fff7ec", "#fee8c8", "#fdd49e", "#fdbb84", "#fc8d59", "#ef6548", "#d7301f", //"#b30000", "#7f0000"]
var radius = 125;

var arc = d3.svg.arc()
    .outerRadius(radius - 30)
    .innerRadius(0);

var labelArc = d3.svg.arc()
    .outerRadius(radius - 40)
    .innerRadius(radius - 40);

var pie = d3.layout.pie()
    .sort(null)
    .value(function (d) {
        return d.total;
    });


function type(d) {
    d.total = +d.total;
    return d;
}


function tweenPie(b) {
    b.innerRadius = 0;
    var i = d3.interpolate({
        startAngle: 0
        , endAngle: 0
    }, b);
    return function (t) {
        return arc(i(t));
    };
}

d3.csv("datasetfor2012female.csv", type, function (error, data) {
    if (error) throw error;


    var g = svg3.selectAll(".arc")
        .data(pie(data))
        .enter().append("g")
        .attr("class", "arc")
        .attr("transform", "translate(" + (radius + 30) + "," + (radius - 24) + ")");


    g.append("path")
        .attr("d", arc)
        .style("fill", function (d) {
            return color1(d.data.age);
        })
        .transition()
        .ease("spring")
        .duration(1000)
        .attrTween("d", tweenPie);
});

///////////////////////////////// 2012 MALE PIE CHART ///////////////////////////////////////


d3.csv("datasetfor2012male.csv", type, function (error, data) {
    if (error) throw error;


    var g = svg4.selectAll(".arc")
        .data(pie(data))
        .enter().append("g")
        .attr("class", "arc")
        .attr("transform", "translate(" + (radius + 30) + "," + (radius - 24) + ")");;


    g.append("path")
        .attr("d", arc)
        .style("fill", function (d) {
            return color1(d.data.age);
        })
        .transition()
        .ease("spring")
        .duration(1000)
        .attrTween("d", tweenPie);

});


///////////////////////////////// 2014 FEMALE PIE CHART ///////////////////////////////////////


d3.csv("datasetfor2014female.csv", type, function (error, data) {
    if (error) throw error;


    var g = svg5.selectAll(".arc")
        .data(pie(data))
        .enter().append("g")
        .attr("class", "arc")
        .attr("transform", "translate(" + (radius + 30) + "," + (radius - 24) + ")");;


    g.append("path")
        .attr("d", arc)
        .style("fill", function (d) {
            return color1(d.data.age);
        })
        .transition()
        .ease("spring")
        .duration(1000)
        .attrTween("d", tweenPie);

});

///////////////////////////////// 2014 MALE PIE CHART ///////////////////////////////////////

d3.csv("datasetfor2014male.csv", type, function (error, data) {
    if (error) throw error;


    var g = svg6.selectAll(".arc")
        .data(pie(data))
        .enter().append("g")
        .attr("class", "arc")
        .attr("transform", "translate(" + (radius + 30) + "," + (radius - 24) + ")");;


    g.append("path")
        .attr("d", arc)
        .style("fill", function (d) {
            return color1(d.data.age);
        })
        .transition()
        .ease("spring")
        .duration(1000)
        .attrTween("d", tweenPie);
});


//legend for maps
var map_col = ["#fef0d9", "#fdbb84", "#fc8d59", "#e34a33", "#b30000", "#7f0000"];
var map_numb = ["$0.00 - $0.70", "$0.71 - $1.20", "$1.21 - $1.74", "$1.75 - $2.20", "$2.20 - $3.00", "> $3.00"];

//legend creation attached to the svg
var legend = svg7.selectAll(".legend")
    .data(map_col, function (d) {
        return d;
    })
    .enter()
    .append("g")
    .attr("class", "legend");

legend.append("rect")
    //sets the location and width of each colored rectangles and adds the iteratively
    .attr("x", 0)
    .attr("y", function (d, i) {
        return (50 * i);
    })
    .attr("width", 80)
    .attr("height", 50)
    .attr("fill", function (d, i) {
        return map_col[i];
    })
    .style("stroke", "black")
    .style("stroke-width", "1px");

//appends the text in the legend color boxes
legend.append("text")
    .attr("x", 5)
    .attr("y", function (d, i) {
        return 45 + (50 * i);
    })
    .attr("width", 80)
    .attr("height", 30)
    .style("fill", "black")
    .style("font-weight", "bold")
    .style("font-color", "color:#525252")
    .text(function (d, i) {
        return map_numb[i];
    });

//legend for pies
var pay_col = ["#fef0d9", "#fdbb84", "#fc8d59", "#e34a33", "#b30000", "#7f0000"];
var pay_numb = ["under 20", "20 - 29", "30 - 39", "40 - 49", "50 - 59", "60 & over"];

//legend creation attached to the svg
var legend = svg8.selectAll(".legend")
    .data(pay_col, function (d) {
        return d;
    })
    .enter()
    .append("g")
    .attr("class", "legend");

legend.append("rect")
    //sets the location and width of each colored rectangles and adds the iteratively
    .attr("x", 0)
    .attr("y", function (d, i) {
        return (33 * i);
    })
    .attr("width", 80)
    .attr("height", 33)
    .attr("fill", function (d, i) {
        return pay_col[i];
    })
    .style("stroke", "black")
    .style("stroke-width", "1px");

//appends the text in the legend color boxes
legend.append("text")
    .attr("x", 5)
    .attr("y", function (d, i) {
        return 30 + (33 * i);
    })
    .attr("width", 80)
    .attr("height", 30)
    .style("fill", "black")
    .style("font-weight", "bold")
    .style("font-color", "color:#525252")
    .text(function (d, i) {
        return pay_numb[i];
    });