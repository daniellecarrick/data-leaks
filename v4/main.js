/***************
Author: Danielle Carrick
www.daniellecarrick.com
****************/

var outter_width = document.getElementById('super-container').clientWidth;

var numberOfCharts = 5;
var paddingTop = 5;

var margin = { top: -10, right: 40, bottom: 20, left: 20 };

var width = outter_width - margin.right,
    height = 90;

function drawAll() {
    outter_width = document.getElementById('super-container').clientWidth;
    width = outter_width - margin.right;
    drawAxis();
    drawCharts(numberOfCharts);
    drawLegend();
}

function drawAxis() {
    d3.select("#visual-container #long-axis").remove();
    d3.select("#visual-container").insert("div").attr("id", "long-axis");

    // This is just for the full scale x-axis
    var axis_svg = d3.select('#long-axis').insert('svg')
        .attr('class', 'axis x-axis')
        .attr('width', width)
        .attr('height', ((height + margin.top + (paddingTop * 5)) * numberOfCharts))
        .attr('xmlns', 'http://www.w3.org/2000/svg');

    var xScale = d3.scale.linear()
        .domain([2007, 2017])
        .range([20, width - (margin.right / 2)]);

    var xAxis = d3.svg.axis()
        .scale(xScale)
        .tickValues([2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017])
        .tickSize(660)
        .tickFormat(d3.format('d'))
        .tickPadding(10)
        .orient('top');

    axis_svg.append('g')
        .attr("transform", "translate(0, 680)")
        .call(xAxis);
}

function drawCharts(thecharts) {
    d3.select("#chart-container").remove();
    d3.select("#horizon-chart").append("div").attr("id", "chart-container");

    var charts_arr = Array();
    var svg_arr = Array();

    for (var n = 0; n < thecharts; n++) {
        var chart = d3.horizon()
            .width(width)
            .height(height)
            .bands(6)
            .mode("offset")
            .interpolate("cardinal");

        var svg = d3.select("#chart-container").append("svg")
            .attr("width", width)
            .attr("height", height + 10)
            .style('padding-top', paddingTop)
            .style("margin-top", margin.top);

        charts_arr.push(chart);
        svg_arr.push(svg);

        // shows the axis on hover
        svg.on('mouseover', function() {
            d3.select(this).select('.y-axis').attr('display', 'block');
        }).on('mouseout', function() {
            d3.select(this).select('.y-axis').attr('display', 'none');
        })

        // Enable bands buttons.
        //****** TO DO: Animate area to horizon chart better
        d3.selectAll("#horizon-bands button").on("click", function() {
            (this.className === 'area') ? n = 1: n = 6;
            for (var i = 0; i < numberOfCharts; i++) {
                svg_arr[i].call(charts_arr[i].duration(2000).bands(n).height(height));
            }
        });

    }

    d3.json("data.json", function(dataOrig) {
        for (var i = 0; i < thecharts; i++) {
            (function(i) {
                var data = dataOrig;
                var formattedData = data.data[i];
                var orig_data = formattedData;
                data = formattedData.map(function(val, i) {
                    return [data.year[i], val];
                });

                svg_arr[i].data([data]).call(charts_arr[i]);
            })(i);
        }
    });
}


function drawLegend() {

    d3.select("#legend-container").remove();
    d3.select("#legend-chart").append("div").attr("id", "legend-container");

    var chart = d3.horizon()
        .width(width * 0.5)
        .height(height * 0.75)
        .bands(1)
        .mode("offset")
        .interpolate("cardinal");

    var svg = d3.select("#legend-container").append("svg")
        .attr("width", width * .5)
        .attr("height", height * 0.75)
        .style('padding-top', paddingTop)
        .style("margin-top", margin.top);

        // messing with the defs in the horizon.js
   svg.append('linearGradient')
        .attr('id', 'pathGradient')
        .attr("x1", 0).attr("y1", 1)
        .attr("x2", 0).attr("y2", 0)
        .selectAll('stop')
        .data([
            { offset: "0%", class: "stop1" },
            { offset: "5%", class: "stop2" },
            { offset: "10%", class: "stop3" }
        ])
        .enter().append('stop')
        .attr("offset", function(d) { return d.offset; })
        .attr("class", function(d) { return d.class; });

    d3.json("data.json", function(dataOrig) {
        for (var i = 0; i < 1; i++) {
            (function(i) {
                var data = dataOrig;
                var formattedData = data.data[i];
                var orig_data = formattedData;
                data = formattedData.map(function(val, i) {
                    return [data.year[i], val];
                });

                svg.data([data]).call(chart);
            })(i);
        }
    });
    d3.select('#legend-container path').attr('fill', 'url(#pathGradient) !important');
    var click_counter = 0;
    // Enable bands buttons.
    d3.selectAll("#legend-bands button").data([-1, 1]).on("click", function(d) {
        click_counter++;
        var n = Math.max(1, chart.bands() + d);
        if (click_counter === 0) {
            var legend_text = "Horizon charts are created by dividing an area chart into bands and overlaying the bands. Press next to add bands.";
            var button_text = "Next";
            n = 1
        } else if (click_counter === 1) {
            var legend_text = "The area chart is now a horizon chart with 3 bands. Click next to add a few more bands.";
            var button_text = "Next";
            d3.select('#legend-container path').attr('fill', 'inherit');
            n = 3
        } else if (click_counter === 2) {
            var legend_text = "Now we have a horizon chart with 6 bands.";
            var button_text = "Reset";
            n = 6
            click_counter = -1;
        }

        d3.select("#horizon-bands-value").text(legend_text);
        d3.select(".last").text(button_text);
        svg.call(chart.duration(2000).bands(n).height(height * 0.75));
    });
}

drawAll();

// Redraw based on the new size whenever the browser window is resized.
window.addEventListener("resize", drawAll);