let margin = {
    top: 100,
    left: 50,
    right: 30,
    bottom: 0
  },
  width = 900 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;

//Define data for bar chart
d3.csv('data/weather.csv', function(d) {
  return {
    weather: d.Weather,
    count: +d.Count
  };
}).then(barChart);

// function to draw bar chart
function barChart(data) {

  // choose color of the bar based on the country's continent
  function chooseColor(w) {
    if(w == 'Clear') {
      return "#00FFFF";
    }
    if(w == 'Cloudy') {
      return "#5F9EA0";
    }
    if(w == 'Rain') {
      return '#A9A9A9';
    }
    if(w == 'Cloudy/Rain') {
      return '#696969';
    }
    if(w == 'Snow') {
      return '#D3D3D3';
    }
    return "#000080";
  }

  // first visualization
  let svg1 = d3.select('#vis-svg-2')
  .append('svg')
  .attr('preserveAspectRatio', 'xMidYMid meet') // this will scale your visualization according to the size of the page.
  .attr('width', '100%') // this is now required by Chrome to ensure the SVG shows up at all
  .style('background-color', '#ccc') // change the background color to white
  .attr('viewBox', [0, 0, width + margin.left + margin.right, height + margin.top + margin.bottom].join(' '))
  .classed('svg-content', true);


  // vertical scale
  let yScale = d3.scaleLinear()
    .domain([1000, 105000])
    .range([height - margin.bottom, margin.top]);

  // horizontal scale
  let xScale = d3.scaleBand()
    .domain(
      data.map(function(d) {
        return d.weather;
      })
    )
    .range([margin.left, width - margin.right])
    .padding(0.4);

  // add y-axis
  let yAxisBar = svg1
    .append('g')
    .attr('transform', `translate(${margin.left},0)`)
    .call(d3.axisLeft().scale(yScale))

    //Add label
    .append('text')
    .attr('y', 80)
    .attr('x', 130)
    .style('stroke', 'black')
    .style('font-size', '20px')
    .text('Number of Crashes');

  // add x-axis
  let xAxisBar = svg1
    .append('g')
    .attr('transform', `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom().scale(xScale))
    .selectAll('text')
    .style('text-anchor', 'end')
    .attr('dx', '0.5em')
    .attr('dy', '0.1em')
    .attr('transform', 'rotate(-30)')


    //Add label
    .append('text')
    .attr('x', width)
    .attr('y', -10)
    .style('stroke', 'black')
    .style('font-size', '20px')
    .text('Weather Condition');

  //Draw bars
  let barChart = svg1
    .selectAll('rect')
    .data(data)
    .enter()
    .append('rect')
    .attr('x', function(d) {
      return xScale(d.weather);
    })
    .attr('y', function(d) {
      return yScale(d.count);
    })
    .attr('width', xScale.bandwidth())
    .attr('fill', function(d) {return chooseColor(d.weather)})
    .attr('height', function(d) {
      return height - margin.bottom - yScale(d.count);
    })
    .on('mouseenter', function(d) {
      d3.select(this).attr('opacity', 0.5)
    })
    .on('mouseleave', function(d) {
      d3.select(this).attr('opacity', 1)
    });

    // add title of the visualization
  svg1.append('text')
    .attr('x', 260)
    .attr('y', 80)
    .attr('text-anchor', 'right')
    .text('Number of Crashes Under Different Weather Condition')
    .style('font-color', 'white')
    .style('font-size', '25px');



}
