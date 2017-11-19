/***************
Author: Danielle Carrick
www.daniellecarrick.com
****************/

var outter_width = document.getElementById('wrapper').clientWidth;

var numberOfCharts = 5;
var paddingTop = 5;

var margin = { top: -10, right: 40, bottom: 20, left: 20 };

var width = outter_width - margin.right,
    height = 90;

function drawAll() {
    outter_width = document.getElementById('wrapper').clientWidth;
    width = outter_width - margin.right;
    drawAxis();
    drawCharts(numberOfCharts);
}

function drawAxis() {
    d3.select("#visual-container #long-axis").remove();
    d3.select("#visual-container").insert("div").attr("id", "long-axis");

    // This is just for the full scale x-axis
    var axis_svg = d3.select('#long-axis').insert('svg')
        .attr('class', 'axis x-axis')
        .attr('width', width)
        .attr('height', ((height + margin.top + (paddingTop * numberOfCharts)) * numberOfCharts))
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
            var activeClass = "selected";
            d3.select('button.selected').classed('selected', false);
            var alreadyIsActive = d3.select(this).classed(activeClass);
            d3.select(this).classed(activeClass, !alreadyIsActive);
            // remove elements otherwise they'll redraw on top of themselves
            function removeElements() {
                d3.selectAll('.svg-tooltip').remove();
                d3.selectAll('.y-axis').remove();
                d3.selectAll('.tooltip-container').remove();
                d3.selectAll('.title-container').remove();
                console.log('removed elements');
            };
            removeElements();
            for (var i = 0; i < numberOfCharts; i++) {
                //svg_arr[i].call(charts_arr[i].duration(2000).bands(n));
                if (n === 1) {
                    svg_arr[i].call(charts_arr[i].duration(2000).bands(n).height(height));
                } else {
                    //setTimeout(svg_arr[i].call(charts_arr[i].duration(1000).bands(2).height(height)), 10);
                    //   removeElements();

                    //   setTimeout(svg_arr[i].call(charts_arr[i].duration(1000).bands(4).height(height)), 20);

                    svg_arr[i].call(charts_arr[i].duration(2000).bands(6).height(height));

                }

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

drawAll();


// Redraw based on the new size whenever the browser window is resized.
window.addEventListener("resize", drawAll);