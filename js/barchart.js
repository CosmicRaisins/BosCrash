

d3.csv("data/location.csv").then(data => {
  mapboxgl.accessToken = "pk.eyJ1IjoiY29zbWljcmFpc2lucyIsImEiOiJja2dscHQ3emowMXc5MzJtbHFxZGZwdGh5In0.Vr7PfvCmbLSOAXxvG1g9WA"
// setting mapbox parameters


  let sizeValue = d => d.num
  // define a size scale for the points
  let sizeMax = 2
  let sizeScale = d3.scaleSqrt().range([-1, sizeMax])
  let selectableElements;

  let map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/dark-v8",
    center: [-71.0589, 42.3601],
    zoom: 10.5
  });


// select the map container in HTML and append d3 svg overlay
  let container = map.getCanvasContainer();
  let scatterplot = d3
    .select(container)
    .append("svg")
    .attr("width", "100%")
    .attr("height", "500")
    .style("position", "absolute")
    .style("z-index", 3);

// Color scale: give me a specie name, I return a color
  let color = d3.scaleOrdinal()
    .domain(["BRISTOL", "MIDDLESEX", "PLYMOUTH", "SUFFOLK", "ESSEX", "NORFOLK", "WORCESTER"])
    .range(["#8F89C1", "#B883B8", "#DA8CAE", "#F8A0A4", "#FAB89E", "#FAC484", "#F7DD92"])

// connect d3 geocoding to mapboxgl
  function project(d) {
    return map.project(new mapboxgl.LngLat(d.LON, d.LAT));
  }

// append the tooltip
  let mapTip = d3.select("body").append("div")
    .attr("class", "tooltip-map")
    .style("opcacity", 0)




// append the points
  let dots = scatterplot
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("r", d => sizeScale(sizeValue(d)))
    .attr("fill", function (d) {
      return color(d.CNTY_NAME)
    })
    .attr("opacity", "0.75")
    .on("mouseover", function (event, d) {
      // enlarge points on hover
      d3.select(event.currentTarget)
        .transition()
        .duration(200)
        .style("fill", "white")
        .style("opacity", "1")
        .attr("r", 10);

      // shows tool tip on hover
      mapTip.transition()
        .duration(200)
        .style("opacity", 1);
      mapTip.html(
        "County: " + d.CNTY_NAME + "<br/>" + "<br/>"
        + "City: " + d.CITY_TOWN_NAME + "<br/>" + "<br/>"
        + d.num + " crashes")
        .style("left", (event.pageX + 15) + "px")
        .style("top", (event.pageY + 15) + "px");
    })




  // handles mouseout events for the points on line
  dots.on("mouseout", function (event, d) {
    d3.select(event.currentTarget)
      // return the points to regular size
      .transition()
      .delay(50)
      .duration(200)
      .style("fill", function (d) {
        return color(d.CNTY_NAME)
      })
      .style("opacity", "0.75")
      .attr("r", d => sizeScale(sizeValue(d)));
    // remove tooltip
    mapTip.transition()
      .delay(100)
      .duration(500)
      .style("opacity", 0);
  })


// reposition dots in d3 overlay when mapbox is interacted
  function render() {
    dots
      .attr("cx", function (d) {
        return project(d).x;
      })
      .attr("cy", function (d) {
        return project(d).y;
      });
  }

// reposition dots in d3 overlay when mapbox is interacted
  map.on("viewreset", render);
  map.on("move", render);
  map.on("moveend", render);
  render(); // Call once to render

  // function updateSelection(selectedData) {
  //   scatterplot
  //     .selectAll("circle")
  //     .data(data.filter(function (d) {return selectedData.includes(d.CNTY_NAME)}))
  //     .exit().remove()
  //
  //   scatterplot.selectAll("circle").enter().append("circle")
  //     .style("r", 1)
  //     .style("fill", "white")
  //     .style("opacity", "0.75")
  //
  //   scatterplot.selectAll("circle")
  //     .transition(200)
  //     .style("r", d => sizeScale(sizeValue(d)))
  //     .style("fill", function (d) { return color(d.CNTY_NAME)})




  //TODO:BAR
  bardata = data.filter((d, i) => i !== 'columns');
  bardata = data.map((d) => {
    return {CNTY_NAME: d.CNTY_NAME, num: d.num}
  });

  let temp = d3.rollup(bardata, v => d3.sum(v, d => d.num), d => d.CNTY_NAME);

  bardata = Array.from(temp, ([key, value]) => ({key, value}));

  // Based on Mike Bostock's margin convention
  // https://bl.ocks.org/mbostock/3019563
  let margin = {
      top: 60,
      left: 50,
      right: 30,
      bottom: 35
    },
    title = "Default Title",
    width = 850 - margin.left - margin.right,
    height = 320 - margin.top - margin.bottom,
    xValue = d => d.key
  yValue = d => d.value
  xLabelText = "County",
    yLabelText = "Number of Crashes by County",
    yLabelOffsetPx = 0,
    xScale = d3.scaleBand(),
    yScale = d3.scaleLinear()

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
      .domain([3000, 0])
      .rangeRound([0, height]);

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
      .attr("class", "tooltip-bar")
      .style("opcacity", 0);

    // Color scale: give me a specie name, I return a color
    let color1 = d3.scaleOrdinal()
      .domain(["BRISTOL", "MIDDLESEX", "PLYMOUTH", "SUFFOLK", "ESSEX", "NORFOLK", "WORCESTER" ])
      .range([ "#8F89C1", "#B883B8", "#DA8CAE", "#F8A0A4", "#FAB89E", "#FAC484", "#F7DD92"])

    let bar = svg.selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", function(d) {
        return xScale(d.key);
      })
      .attr("width", xScale.bandwidth())
      .attr("y", function(d) {
        return yScale(d.value);
      })
      .attr("rx", 3)
      .attr("ry", 3)
      .attr("height", function(d) {
        return height - yScale(d.value);
      })
      .style("fill", function (d) { return color1(d.key)})
      .style("stroke", function (d) { return color1(d.key)})
      .style("stroke-width", 2)
      .classed("selected", true)
      .on("mouseover", function(event,d) {
        // enlarge points on hover
        d3.select(event.currentTarget)
          .classed("highlighted", true)
          .transition()
          .duration(200)
        // .style("fill", "white")
        // show tooltips on hover
        barTip.transition()
          .duration(200)
          .style("opacity", 1);
        barTip.html(d.key + "<br/>" + "<br/>" + d.value +" crashes")
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
      // .style("fill", function (d) { return color1(d.COUNTY)})
      // remove tooltip
      barTip.transition()
        .delay(100)
        .duration(500)
        .style("opacity", 0);
    })



      .on("click", function (event, d) {

        let selected = []

        if (d3.select(event.currentTarget).classed("selected")) {
          d3.select(event.currentTarget)
            .classed("selected", false)
            .transition()
            .duration(150)
            .style("fill", "#2D2D2D");

          // get all the counties curretly selected
          let temp = svg.selectAll('.selected').data()
          temp.forEach(element => selected.push(element["key"]));
          // Let other charts know

        } else {
          d3.select(event.currentTarget)
            .classed("selected", true)
            .transition()
            .duration(100)
            .style("fill", function (d) { return color1(d.key)});


          // get all the counties curretly selected
          let temp = svg.selectAll('.selected').data()
          temp.forEach(element => selected.push(element["key"]));
        }
        updateMap(selected)
        console.log(data)
      })
    return chart;
  }
  chart("#vis-svg-2", bardata)

  let updateMap = function (counties) {
    let newdata = data.filter(function (d) {return counties.includes(d.CNTY_NAME)})
    scatterplot.selectAll("circle")
      .data(newdata)
      .attr("fill", function (d) {return color(d.CNTY_NAME)})
      .attr("r", d => sizeScale(sizeValue(d)))
      .attr("opacity", 0.75)
    render();


  }
})