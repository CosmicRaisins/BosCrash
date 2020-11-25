// setting the access token for MapBox
mapboxgl.accessToken = "pk.eyJ1IjoiY29zbWljcmFpc2lucyIsImEiOiJja2dscHQ3emowMXc5MzJtbHFxZGZwdGh5In0.Vr7PfvCmbLSOAXxvG1g9WA"
// setting mapbox parameters
let map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/dark-v8",
  center: [-71.0589, 42.3601],
  zoom: 10.5
});



// select the map container in HTML and append d3 svg overlay
let container = map.getCanvasContainer();
let svg = d3
  .select(container)
  .append("svg")
  .attr("width", "100%")
  .attr("height", "500")
  .style("position", "absolute")
  .style("z-index", 2);

// connect d3 geocoding to mapboxgl
function project(d) {
  return map.project(new mapboxgl.LngLat(d.lon, d.lat));
}

// append the tooltip
let mapTip = d3.select("body").append("div")
  .attr("class", "tooltip-map")
  .style("opcacity", 0)

// load data
d3.csv("data/SimpleDataSample.csv").then(function (data) {

  let sizeValue = d => d.num
  // define a size scale for the points
  let sizeMax = 2
  let sizeScale = d3.scaleSqrt().range([-1, sizeMax])

// append the points
  let dots = svg
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("r", d => sizeScale(sizeValue(d)))
    .attr("fill", "#ff3859")
    .attr("opacity", "0.75")
    .on("mouseover", function(event,d) {
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
  dots.on("mouseout", function(event, d) {
    d3.select(event.currentTarget)
      // return the points to regular size
      .transition()
      .delay(50)
      .duration(200)
      .attr("r", d => sizeScale(sizeValue(d)))
      .style("fill", "#ff3859")
      .style("opacity", "0.75");
    // remove tooltip
    mapTip.transition()
      .delay(100)
      .duration(500)
      .style("opacity", 0);
  })


// reposition dots in d3 overlay when mapbox is interacted
  function render() {
    dots
      .attr("cx", function(d) {
        return project(d).x;
      })
      .attr("cy", function(d) {
        return project(d).y;
      });
  }

// reposition dots in d3 overlay when mapbox is interacted
  map.on("viewreset", render);
  map.on("move", render);
  map.on("moveend", render);
  render(); // Call once to render
})
