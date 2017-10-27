var width = 960,
    height = 150;

var thechartsStart = 5;
var marginTop = 10;

createCharts(thechartsStart);


function createCharts(thecharts) {

    d3.select("#chart-container").remove();
    d3.select("#horizon-chart").append("div").attr("id", "chart-container");


    var charts = Array();

    var svgs = Array();

    for (var n = 0; n < thecharts; n++) {
        var chart = d3.horizon()
            .width(width)
            .height(height)
            .bands(6)
            .mode("offset")
            .interpolate("basis");


        var svg = d3.select("#chart-container").append("svg")
            .attr("width", width)
            .attr("height", height)
            .style("margin-top", marginTop);

        charts.push(chart);
        svgs.push(svg);
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

                svgs[i].data([data]).call(charts[i]);

            })(i);
        }
    });

    // Enable bands buttons. 
    //****** TO DO: Animate area to horizon chart better
    d3.selectAll("#horizon-bands button").on("click", function() {
        (this.className === 'area') ? n = 1: n = 6;
       // this.adilass('selected');

        for (var i = 0; i < 5; i++) {
            svgs[i].call(charts[i].duration(2000).bands(n).height(height));
        }
    });
}