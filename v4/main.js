var width = 1000,
    height = 160;

var numberOfCharts = 5;
var marginTop = 10;
var paddingTop = 10;

createCharts(numberOfCharts);

d3.select('#horizon-chart').append('svg')
    .attr('class', 'x-axis')
    .attr('width', width);

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
            .interpolate("basis");


        var svg = d3.select("#chart-container").append("svg")
            .attr("width", width)
            .attr("height", height + 10)
            .style('padding-top', paddingTop)
            .style("margin-top", marginTop);

        charts_arr.push(chart);
        svg_arr.push(svg);
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