var width = 700,
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
        .domain([2007, 2017])
        .range([20, width-40]);

    var xAxis = d3.svg.axis()
        .scale(xScale)
       // .ticks(14)
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


function createCharts(thecharts) {
console.log('drawing the charts');
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
            .style("margin-top", marginTop);

    var titles = ["Hacking, Skimming, and Phishing", "Insider Theft", "Weak Corporate Internet Security", "Data Breaches from Lost/Stolen Devices", "Leak by Outside Vendor"];

    var the_title = titles[n];
   
   svg.append('p').html(the_title)
      //.attr('x', 0)
      //.attr('y', function(d) {return titles.indexOf(d) * (height + 20)})
      //.attr("transform", "translate(0,40)")
      .attr('class', 'titles');

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