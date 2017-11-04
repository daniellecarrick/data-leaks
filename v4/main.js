var width = window.innerWidth,
    height = 90;

var numberOfCharts = 5;
var marginTop = 0;
var paddingTop = 5;

function drawAxis() {
    console.log('drawing the axis');
    // This is just for the full scale x-axis
    var axis_svg = d3.select('#long-axis').insert('svg')
        .attr('class', 'axis x-axis')
        .attr('width', width)
        .attr('height', ((height + marginTop + (paddingTop * 5)) * numberOfCharts));

    var xScale = d3.scale.linear()
        .domain([2006, 2016])
        .range([20, width - 40]);

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

drawAxis();
createCharts(numberOfCharts);

function createLegend() {
    d3.select("#legend-chart").append("div").attr("id", "legend-container");
    var chart = d3.horizon()
            .width(width*.75)
            .height(height)
            .bands(1)
            .mode("offset")
            .interpolate("cardinal");

      var svg = d3.select("#legend-container").append("svg")
            .attr("width", width*.75)
            .attr("height", height + 10)
            .style('padding-top', paddingTop)
            .style("margin-top", marginTop);

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
var click_counter = 0;
         // Enable bands buttons.
  d3.selectAll("#legend-bands button").data([-1, 1]).on("click", function(d) {
    click_counter++;
    var n = Math.max(1, chart.bands() + d);
    if (click_counter === 0) {
        var legend_text = "Horizon charts are created by dividing an area chart into bands and overlaying the bands. Press next to add bands.";
        var button_text = "Next";
        n = 1
    }
    else if (click_counter === 1) {
        var legend_text = "The area chart is now a horizon chart with 3 bands. Click next to add a few more bands.";
        var button_text = "Next";
        n = 3
    } else if (click_counter === 2) {
        var legend_text = "Now we have a horizon chart with 6 bands.";
        var button_text = "Reset";
        n = 6
         click_counter = -1;
    }

    d3.select("#horizon-bands-value").text(legend_text);
    d3.select(".last").text(button_text);
    svg.call(chart.duration(2000).bands(n).height(height));
  });
}

createLegend();

function createCharts(thecharts) {
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
            .attr('class', 'svg' + n)
            .style('padding-top', paddingTop)
            .style("margin-top", marginTop);

        charts_arr.push(chart);
        svg_arr.push(svg);

        // shows the axis on hover
      svg.on('mouseover', function() {
            d3.select(this).select('.y-axis').attr('display', 'block');
        }).on('mouseout', function() {
            d3.select(this).select('.y-axis').attr('display', 'none');
        })

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


    // Enable bands buttons.
    //****** TO DO: Animate area to horizon chart better
    d3.selectAll("#horizon-bands button").on("click", function() {
        (this.className === 'area') ? n = 1: n = 6;
        // this.adilass('selected');

        for (var i = 0; i < numberOfCharts; i++) {
            svg_arr[i].call(charts_arr[i].duration(2000).bands(n).height(height));
        }
    });
}