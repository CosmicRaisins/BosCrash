
// load data from csv
// TODO: Update Data Column Names
// TODO: More Cleaning
d3.csv("data/TestingData.json").then(data => {

  // General event type for selections, used by d3-dispatch
  // https://github.com/d3/d3-dispatch
  const dispatchString = 'selectionUpdated';

  // Create a line chart given x and y attributes, labels, offsets;
  // a dispatcher (d3-dispatch) for selection events;
  // a div id selector to put our svg in; and the data to use.
  let hourlyLineChart = linechart()
    .x(d => d.hour)
    .xLabel("Hour")
    .y(d => d.records)
    .yLabel('Number or Crashes')
    .yLabelOffset(40)
    .selectionDispatcher(d3.dispatch(dispatchString))
    ("#vis-svg-1", data);
})