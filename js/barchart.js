/* global D3 */

// Initialize a line chart. Modeled after Mike Bostock's
// Reusable Chart framework https://bost.ocks.org/mike/chart/
function barchart() {

  // Based on Mike Bostock's margin convention
  // https://bl.ocks.org/mbostock/3019563
  let margin = {
      top: 60,
      left: 50,
      right: 30,
      bottom: 35
    },
    title = "Default Title",
    width = 500 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom,
    xValue = d => d[0],
    yValue = d => d[1],
    xLabelText = '',
    yLabelText = '',
    yLabelOffsetPx = 0,
    xScale = d3.scaleBand(),
    yScale = d3.scaleLinear(),
    ourBrush = null,
    selectableElements = d3.select(null),
    dispatcher;

  // Create the chart by adding an svg to the div with the id
  // specified by the selector using the given data
  function chart(selector, data) {
    let svg = d3.select(selector)
      .append('svg')
      .attr('preserveAspectRatio', 'xMidYMid meet')
      .attr('viewBox', [0, 0, width + margin.left + margin.right, height + margin.top + margin.bottom].join(' '))
      .classed('svg-content', true);

    svg = svg.append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    //Define scales
    xScale
      .domain(d3.group(data, xValue).keys())
      .rangeRound([margin.left, width])
      .padding(0.5);

    yScale
      .domain([
        d3.min(data, d => yValue(d)),
        d3.max(data, d => yValue(d))
      ])
      .rangeRound([height, 0]);

    // X axis
    let xAxis = svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom().scale(xScale))
      .selectAll('text')
      .style('text-anchor', 'end')
      .attr('transform', 'rotate(-20)');
    //TODO: does not work
    // .ticks(0, 22, 12));

    // X axis label
    svg.append('text')
      .attr('class', 'axisLabel')
      .attr('x', -300)
      .attr('y', 870)
      .attr('transform', 'rotate(-90)')
      .text(xLabelText);

    let yAxis = svg.append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft().scale(yScale));


    // Y axis label, act like the title for the graph
    yAxis = svg.append('text')
      .attr('class', 'axisLabel')
      .attr('transform', 'translate(' + yLabelOffsetPx + ', -25)')
      .text(yLabelText);

    let barTip = d3.select("body").append("div")
      .attr("class", "tooltip-line")
      .style("opcacity", 0);


    let bar = svg.selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", function(d) {
        return xScale(d.Weather);
      })
      .attr("width", xScale.bandwidth())
      .attr("y", function(d) {
        return yScale(d.Count);
      })
      .attr("height", function(d) {
        return height - yScale(d.Count);
      })
      .style('fill', '#9370DB')
      .on("mouseover", function(event,d) {
        // enlarge points on hover
        d3.select(event.currentTarget)
          .classed("highlighted", true)
          .transition()
          .duration(200)
          .style("fill", 'blue')
        // show tooltips on hover
        barTip.transition()
          .duration(200)
          .style("opacity", 1);
        barTip.html(d.Weather + "<br/>" + "<br/>" + d.Count +" crashes")
          .style("left", (event.pageX + 15) + "px")
          .style("top", (event.pageY + 15) + "px");
      });


      bar.on("mouseout", function(event, d) {
        // declass point as highlighted
        d3.select(event.currentTarget)
          .classed("highlighted", false)
          // return the points to regular size
          .transition()
          .delay(50)
          .duration(200)
          .style("fill", '#9370DB')
        // remove tooltip
        barTip.transition()
          .delay(100)
          .duration(500)
          .style("opacity", 1);
      })
      .on("click", function (event, d) {
        if (d3.select(event.currentTarget).classed("selected")) {
          d3.select(event.currentTarget).classed("selected", false)
        } else {
          d3.select(event.currentTarget).classed("selected", true)
        }
      })


      selectableElements = bar;






    // svg.call(brush);
    //
    // // Highlight points when brushed
    // function brush(g) {
    //   const brush = d3.brush()
    //     .on('start brush', highlight)
    //     .on('end', brushEnd)
    //     .extent([
    //       [-margin.left, -margin.bottom],
    //       [width + margin.right, height + margin.top]
    //     ]);
    //
    //   ourBrush = brush;
    //
    //   g.call(brush); // Adds the brush to this element
    //
    //   // Highlight the selected circles.
    //   function highlight(event, d) {
    //     if (event.selection === null) return;
    //     const [
    //       [x0, y0],
    //       [x1, y1]
    //     ] = event.selection;
    //     points.classed('selected', d =>
    //       x0 <= X(d) && X(d) <= x1 && y0 <= Y(d) && Y(d) <= y1
    //     );
    //
    //     // Get the name of our dispatcher's event
    //     let dispatchString = Object.getOwnPropertyNames(dispatcher._)[0];
    //
    //     // Let other charts know
    //     dispatcher.call(dispatchString, this, svg.selectAll('.selected').data());
    //   }
    //
    //   function brushEnd(event, d) {
    //     // We don't want infinite recursion
    //     if(event.sourceEvent !== undefined && event.sourceEvent.type!='end'){
    //       d3.select(this).call(brush.move, null);
    //     }
    //   }
    // }

    return chart;
  }

  // The x-accessor from the datum
  function X(d) {
    return xScale(xValue(d));
  }

  // The y-accessor from the datum
  function Y(d) {
    return yScale(yValue(d));
  }

  chart.margin = function (_) {
    if (!arguments.length) return margin;
    margin = _;
    return chart;
  };

  chart.width = function (_) {
    if (!arguments.length) return width;
    width = _;
    return chart;
  };

  chart.height = function (_) {
    if (!arguments.length) return height;
    height = _;
    return chart;
  };

  chart.x = function (_) {
    if (!arguments.length) return xValue;
    xValue = _;
    return chart;
  };

  chart.y = function (_) {
    if (!arguments.length) return yValue;
    yValue = _;
    return chart;
  };

  chart.xLabel = function (_) {
    if (!arguments.length) return xLabelText;
    xLabelText = _;
    return chart;
  };

  chart.yLabel = function (_) {
    if (!arguments.length) return yLabelText;
    yLabelText = _;
    return chart;
  };

  chart.yLabelOffset = function (_) {
    if (!arguments.length) return yLabelOffsetPx;
    yLabelOffsetPx = _;
    return chart;
  };

  // TODO: Brushing temporarily removed.
  // Gets or sets the dispatcher we use for selection events
  chart.selectionDispatcher = function (_) {
    if (!arguments.length) return dispatcher;
    dispatcher = _;
    return chart;
  };

  // Given selected data from another visualization
  // select the relevant elements here (linking)
  chart.updateSelection = function (selectedData) {
    if (!arguments.length) return;

    // Select an element if its datum was selected
    selectableElements.classed('selected', d =>
      selectedData.includes(d)
    );
  };

  return chart;
}
