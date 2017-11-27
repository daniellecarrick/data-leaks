 var counter = 0;
 (function() {
     d3.horizon = function() {

         var bands = 1, // between 1 and 5, typically
             mode = 'offset', // or mirror
             interpolate = 'linear', // or basis, monotone, step-before, etc.
             x = d3_horizonX,
             y = d3_horizonY,
             w = 960,
             h = 40,
             duration = 0;


         var color = d3.scale.linear()
             .domain([-1, 0, 0, 1])
             // .range(['#DAE8F3', '#1F77B4']);
             .range(['#000000', '#DAE8F3', '#DAE8F3', '#1F77B4']);


         var margin = { top: 0, right: 40, bottom: 20, left: 20 };

         // For each small multiple…
         function horizon(g) {
             g.each(function(d, i) {
                 var g = d3.select(this),
                     n = 2 * bands + 1,
                     xMin = Infinity,
                     xMax = -Infinity,
                     yMax = -Infinity,
                     x0, // old x-scale
                     y0, // old y-scale
                     id; // unique id for paths

                 // Compute x- and y-values along with extents.
                 var data = d.map(function(d, i) {
                     var xv = x.call(this, d, i),
                         yv = y.call(this, d, i);
                     if (xv < xMin) xMin = xv;
                     if (xv > xMax) xMax = xv;
                     if (-yv > yMax) yMax = -yv;
                     if (yv > yMax) yMax = yv;
                     return [xv, yv];
                 });

                 // Compute the new x- and y-scales, and transform.
                 var x1 = d3.scale.linear().domain([xMin, xMax]).range([0, w - margin.right]),
                     y1 = d3.scale.linear().domain([0, yMax]).range([0, h * bands]),
                     yScale = d3.scale.linear().domain([0, yMax]).range([height, 0]),
                     t1 = d3_horizonTransform(bands, h, mode);

                 // Retrieve the old scales, if this is an update.
                 if (this.__chart__) {
                     x0 = this.__chart__.x;
                     y0 = this.__chart__.y;
                     t0 = this.__chart__.t;
                     id = this.__chart__.id;
                 } else {
                     x0 = x1.copy();
                     y0 = y1.copy();
                     t0 = t1;
                     id = ++d3_horizonId;
                 }

                 // We'll use a defs to store the area path and the clip path.
                 var defs = g.selectAll('defs')
                     .data([null]);

                 // The clip path is a simple rect.
                 defs.enter().append('defs').append('clipPath')
                     .attr('id', 'd3_horizon_clip' + id)
                     .append('rect')
                     .attr('width', w)
                     .attr('height', h)
                     .attr('transform', 'translate(0,' + margin.top + ')');

                 defs.select('rect').transition()
                     .duration(duration)
                     .attr('width', w) //does nothing
                     .attr('height', h);

                 // We'll use a container to clip all horizon layers at once.
                 g.selectAll('g')
                     .data([null])
                     .enter().append('g')
                     .attr('clip-path', 'url(#d3_horizon_clip' + id + ')');

                 // Instantiate each copy of the path with different transforms.
                 var path = g.select('g').selectAll('path')
                     .data(d3.range(-1, -bands - 1, -1).concat(d3.range(1, bands + 1)), Number);

                 var d0 = d3_horizonArea
                     .interpolate(interpolate)
                     .x(function(d) { return x0(d[0]); })
                     .y0(h * bands)
                     .y1(function(d) { return h * bands - y0(d[1]); })
                     (data);


                 var d1 = d3_horizonArea
                     .x(function(d) { return x1(d[0]); })
                     .y1(function(d) { return h * bands - y1(d[1]); })
                     (data);

                 path.enter().append('path')
                     .style('fill', color)
                     .attr('transform', t0)
                     .attr('d', d0)
                     .on('mousemove', mousemove);

                 path.transition()
                     .duration(duration)
                     .style('fill', color)
                     .attr('transform', t1)
                     .attr('d', d1);

                 path.exit().transition()
                     .duration(duration)
                     .attr('transform', t1)
                     .attr('d', d1)
                     .remove();


                 /***************
                       Y-axis
                  ***************/
                 var yAxis = d3.svg.axis()
                     .orient('right')
                     .tickValues([0, yMax / 2, yMax])
                     .tickSize(0)
                     .tickPadding(5)
                     .scale(yScale);


                 g.append('g')
                     .attr('class', 'axis y-axis')
                     .attr('transform', 'translate(' + (w - margin.right) + ',0)')
                     .attr('display', 'none')
                     .call(yAxis);

                 /*******************
                  Titles generated here
                 ********************/

                 var parentClass = this.parentNode.id;

                 var titles_arr = ['Hacking, Skimming, and Phishing', 'Insider Theft', 'Weak Corporate Internet Security', 'Data Breaches from Lost/Stolen Devices', 'Leak by Outside Vendor'];
                 var title_bg_width_arr = [187, 77, 184, 222, 136];
                 var title_bg_width = title_bg_width_arr[counter];
                 var the_title = titles_arr[counter];

                 var titles = g.append('g')
                     .attr('transform', function(){
                       if(h == 120){
                        return 'translate(6, 95)';
                       }else{
                         return 'translate(6, 65)';
                       }

                     })
                     .attr('class', 'title-container');

                 titles.append('rect')
                     .attr('class', 'title-bg')
                     .attr('width', title_bg_width); // go here for more info: https://github.com/d3/d3/issues/252

                 titles.append('text')
                     .attr('class', 'titles')
                     .text(the_title)
                     .attr('transform', 'translate(5,12)');

                 /*******************
                       Annotations generated here
                ********************/

                 var annotations_arr = [{
                         "title": "Hacking, Skimming, Phishing",
                         "year": 2015.5
                     },
                     {
                         "title": "Insider Theft",
                         "year": 2009
                     },
                     {
                         "title": "Weak Corporate Internet Security",
                         "year": 2013.5
                     },
                     {
                         "title": "Lost Stolen Devices",
                         "year": 2015
                     }, {
                         "title": "Leak by Outside Vendor",
                         "year": 2013.5
                     }
                 ];

                 var translate_x = x1(annotations_arr[counter].year);
                 var translate_y = 50;

                 var annotations = g.append('g')
                     .attr('class', 'annotation-circles')
                     .attr('transform', 'translate(' + (translate_x) + ',' + translate_y + ')');

                 annotations.append('circle')
                     .attr('r', 9)
                     .attr('fill', 'white');

                 annotations.append('text')
                     .attr('transform', function(){
                       if(counter +1 == 1){
                         return 'translate(-2,3)';
                       } else{
                         return 'translate(-4,3)';
                       }

                     })
                    // .style('font-size', '10px')
                     .text(counter+1);


                 // since this gets redone on resize, need to reset counter
                 counter++;
                 if (counter === 5) {
                     counter = 0;
                 }


                 /*******************
                   Tooltip generated here
                 ********************/
                 var tooltip = g.append('g')
                     .attr('class', 'tooltip-container');

                 tooltip.append('line')
                     .attr('stroke', 'black')
                     .attr('class', 'tooltip-line-top');

                 tooltip.append('line')
                     .attr('stroke', 'black')
                     .attr('class', 'tooltip-line-bottom');

                 tooltip.append('line')
                     .attr('stroke', 'black')
                     .attr('class', 'line-nub-top');

                 tooltip.append('line')
                     .attr('stroke', 'black')
                     .attr('class', 'line-nub-bottom');

                 tooltip.append('text')
                     .attr('class', 'tooltip-text')
                     .attr('fill', 'black');

                 var date_arr = [2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017];

                 var bisect = d3.bisector(function(date_arr) { return date_arr; }).left;

                 function mousemove() {
                     // Find the x mouse position and use it to grab the y-value
                     var mouse_x = d3.mouse(this)[0],
                         x0 = x1.invert(d3.mouse(this)[0]);

                     // Add vertical lines, one on top of the text and one onthe bottom
                     d3.selectAll('.tooltip-line-top')
                         .attr('x1', mouse_x)
                         .attr('x2', mouse_x)
                         .attr('y1', 0)
                         .attr('y2', 50);

                     d3.selectAll('.line-nub-top')
                         .attr('x1', mouse_x + 2)
                         .attr('x2', mouse_x - 2)
                         .attr('y1', 50)
                         .attr('y2', 50);

                     d3.selectAll('.line-nub-bottom')
                         .attr('x1', mouse_x + 2)
                         .attr('x2', mouse_x - 2)
                         .attr('y1', 65)
                         .attr('y2', 65);

                     d3.selectAll('.tooltip-line-bottom')
                         .attr('x1', mouse_x)
                         .attr('x2', mouse_x)
                         .attr('y1', 65)
                         .attr('y2', 120);

                     // Add the data label
                     d3.selectAll('svg .tooltip-text').attr('x', mouse_x - 43).attr('y', 61)
                         .text(function(d, i) {
                             var z = bisect(date_arr, x0, 1);
                             var y_val = d[z - 1][1];
                             return y_val + " data leaks";
                         });
                 }

                 d3.select('#chart-container').on('mouseover', function() {
                     d3.selectAll('.tooltip-container').attr('display', 'block');
                 }).on('mouseout', function() {
                     d3.selectAll('.tooltip-container').attr('display', 'none');
                     // add code to hide tooltip container here
                 });

                 // Stash the new scales.
                 this.__chart__ = { x: x1, y: y1, t: t1, id: id };
             });
             d3.timer.flush();
         }

         horizon.duration = function(x) {
             if (!arguments.length) return duration;
             duration = +x;
             return horizon;
         };

         horizon.bands = function(x) {
             if (!arguments.length) return bands;
             bands = +x;
             color.domain([-bands, 0, 0, bands]);
             return horizon;
         };

         // when there are no negatives, this function works better with the colors
         /*  horizon.bands = function(x) {
               if (!arguments.length) return bands;
               bands = +x;
               color.domain([0, bands]);
               return horizon;
           };*/

         horizon.mode = function(x) {
             if (!arguments.length) return mode;
             mode = x + '';
             return horizon;
         };

         horizon.colors = function(x) {
             if (!arguments.length) return color.range();
             color.range(x);
             return horizon;
         };

         horizon.interpolate = function(x) {
             if (!arguments.length) return interpolate;
             interpolate = x + '';
             return horizon;
         };

         horizon.x = function(z) {
             if (!arguments.length) return x;
             x = z;
             return horizon;
         };

         horizon.y = function(z) {
             if (!arguments.length) return y;
             y = z;
             return horizon;
         };

         horizon.width = function(x) {
             if (!arguments.length) return w;
             w = +x;
             return horizon;
         };

         horizon.height = function(x) {
             if (!arguments.length) return h;
             h = +x;
             return horizon;
         };

         return horizon;
     };

     var d3_horizonArea = d3.svg.area(),
         d3_horizonId = 0;

     function d3_horizonX(d) {
         return d[0];
     }

     function d3_horizonY(d) {
         return d[1];
     }

     function d3_horizonTransform(bands, h, mode) {
         return mode == 'offset' ?
             function(d) { return 'translate(0,' + (d + (d < 0) - bands) * h + ')'; } :
             function(d) { return (d < 0 ? 'scale(1,-1)' : '') + 'translate(0,' + (d - bands) * h + ')'; };
     }
 })();
