
// load data from csv
// TODO: Update Data Column Names
// TODO: More Cleaning
d3.csv("data/time.csv").then(data => {

  // General event type for selections, used by d3-dispatch
  // https://github.com/d3/d3-dispatch
  const dispatchString = 'selectionUpdated';

  // Create a line chart given x and y attributes, labels, offsets;
  // a dispatcher (d3-dispatch) for selection events;
  // a div id selector to put our svg in; and the data to use.
  let hourlyLineChart = linechart()
    .width(850)
    .height(320)
    .x(d => +d.CRASH_HOUR)
    .xLabel("Hour of Day")
    .y(d => +d.num)
    .yLabel("Trend of Crashes in Boston by Hour")
    .selectionDispatcher(d3.dispatch(dispatchString))
    ("#vis-svg-1", data);
})

d3.csv("data/COUNTY_DATA.csv").then(data => {

  // General event type for selections, used by d3-dispatch
  // https://github.com/d3/d3-dispatch
  const dispatchString = 'selectionUpdated';

  // Create a line chart given x and y attributes, labels, offsets;
  // a dispatcher (d3-dispatch) for selection events;
  // a div id selector to put our svg in; and the data to use.
  let barChart = barchart()
    .width(850)
    .height(320)
    .x(d => d.COUNTY)
    .xLabel("County")
    .y(d => d.Numbers)
    .yLabel("Number of Crashes by County")
    .selectionDispatcher(d3.dispatch(dispatchString))
    ("#vis-svg-2", data);
})
