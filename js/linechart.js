/* global D3 */

// Initialize a line chart. Modeled after Mike Bostock's
// Reusable Chart framework https://bost.ocks.org/mike/chart/
function linechart() {

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
    xScale = d3.scalePoint(),
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
      .rangeRound([0, width]);

    yScale
      .domain([
        d3.min(data, d => yValue(d)),
        d3.max(data, d => yValue(d))
      ])
      .rangeRound([height, 0]);

    // X axis
    let xAxis = svg.append('g')
      .attr('transform', 'translate(0,' + (height + 35) + ')')
      .call(d3.axisBottom(xScale));
    //TODO: does not work
        // .ticks(0, 22, 12));

    // X axis label
    xAxis.append('text')
      .attr('class', 'axisLabel')
      .attr('transform', 'translate(' + (width - 70) + ',-10)')
      .text(xLabelText);

    // Y axis label, act like the title for the graph
    let yAxis = svg.append('text')
      .attr('class', 'axisLabel')
      .attr('transform', 'translate(' + yLabelOffsetPx + ', 0)')
      .text(yLabelText);


    // Add the line
    svg.append('path')
      .datum(data)
      .attr('class', 'linePath')
      .attr('d', d3.line()
        // curving the jagged line path
        .curve(d3.curveCardinal)
        .x(X)
        .y(Y)
      );

    // append the tooltip
    let lineTip = d3.select("body").append("div")
      .attr("class", "tooltip-line")
      .style("opcacity", 0)

    // Add the points
    let points = svg.append('g')
      .selectAll('.linePoint')
      .data(data);

    points.exit().remove();

    points = points.enter()
      .append('circle')
      .attr('class', 'point linePoint')
      .merge(points)
      .attr('cx', X)
      .attr('cy', Y)
      .attr('r',7)
      // mouse over events on points
      .on("mouseover", function(event,d) {
        // enlarge points on hover
        d3.select(event.currentTarget)
          .classed("highlighted", true)
          .transition()
          .duration(200)
          .attr("r", 12)
        // show tooltips on hover
        lineTip.transition()
          .duration(200)
          .style("opacity", 1);
        lineTip.html(d.hour + ":00" + " - " + (d.hour + 1) + ":00" + "<br/>" + "<br/>" + d.records +" crashes")
          .style("left", (event.pageX + 15) + "px")
          .style("top", (event.pageY + 15) + "px");
      })

    // handles mouseout events for the points on line
      points.on("mouseout", function(event, d) {
        // declass point as highlighted
        d3.select(event.currentTarget)
          .classed("highlighted", false)
          // return the points to regular size
          .transition()
          .delay(50)
          .duration(200)
          .attr("r", 7)
        // remove tooltip
        lineTip.transition()
          .delay(100)
          .duration(500)
          .style("opacity", 0);
      })


      // a click selector for the line chart
      .on("click", function (event, d) {
        if (d3.select(event.currentTarget).classed("selected")) {
          d3.select(event.currentTarget).classed("selected", false)
        } else {
          d3.select(event.currentTarget).classed("selected", true)
        }
      })




    selectableElements = points;

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