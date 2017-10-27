var width = 960,
    height = 150;

var nbChartsStart = 5;
var marginCharts = 2;

createCharts(nbChartsStart);


function createCharts(nbCharts) {

    d3.select("#chartsDiv").remove();
    d3.select("#horizon-chart").append("div").attr("id", "chartsDiv");


    var charts = Array();

    var svgs = Array();

    for (var n = 0; n < nbCharts; n++) {
        var chart = d3.horizon()
            .width(width)
            .height(height)
            .bands(6)
            .mode("offset")
            .interpolate("basis");


        var svg = d3.select("#chartsDiv").append("svg")
            .attr("width", width)
            .attr("height", height)
            .style("margin-top", marginCharts);

        charts.push(chart);
        svgs.push(svg);
    }



    d3.json("data.json", function(dataOrig) {

        for (var dc = 0; dc < nbCharts; dc++) {
            (function(dc) {
                var data = dataOrig;
                var curData = data.data[dc];
                //console.log("for data "+curData);


                var offset = 0;
                var orig_data = curData;
                // var mean = curData.reduce(function(p, v) { return p + v; }, offset) / curData.length;

                data = curData.map(function(val, i) {
                    return [data.year[i], val];
                });

                svgs[dc].data([data]).call(charts[dc]);

            })(dc);
        }
    });

    // Enable bands buttons. ****** TO DO: Animate area to horizon chart better
    d3.selectAll("#horizon-bands button").on("click", function() {
        // console.log('this = ', this.className);
        (this.className === 'area') ? n = 1: n = 6;
        // console.log(this.className, n);
       // this.addClass('selected');

        for (var dc = 0; dc < 5; dc++) {
            svgs[dc].call(charts[dc].duration(1000).bands(n).height(height));
        }
    });
}