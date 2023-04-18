



d3.json("project3/testfile.geojson")
  .then(function(data) {
    // code to handle the loaded data
    console.log(data);
  })
  .catch(function(error) {
    console.log(error);
  });

////////////////////////////

var myMap = L.map("map", {
  center: [ 41.878, -87.629],
  zoom: 13
});


L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

function createMap(property_name) {

  // Create the tile layer that will be the background of the map.
  var streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });


  // Create a baseMaps object to hold the streetmap layer.
  var baseMaps = {
    "Street Map": streetmap
  };

  // Create an overlayMaps object to hold the property_name layer.
  var overlayMaps = {
    "Property Name": property_name
  };

  // Create the map object with options.
  var map = L.map("map-id", {
    center: [41.878, -87.629],
    zoom: 12,
    layers: [streetmap, property_name]
  });

  // Create a layer control, and pass it baseMaps and overlayMaps. Add the layer control to the map.
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(map);
}


// Set the dimensions of the map
var width = 800;
var height = 600;
// Create a Leaflet map centered on Chicago
var myMap = L.map('map').setView([41.8781, -87.6298], 10);
// Add a tile layer from OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);
// Load the GeoJSON file of Chicago zip codes
d3.json('chicago-zipcodes.geojson', function(geojson) {
  // Load the dataset with electricity usage by zip code
  d3.csv('electricity-usage.csv', function(data) {
    // Define the color scale for the choropleth map
    var colorScale = d3.scaleQuantize()
      .domain([0, d3.max(data, function(d) { return +d.usage; })])
      .range(['#FEF0D9', '#FDCC8A', '#FC8D59', '#E34A33', '#B30000']);
    // Create a Leaflet GeoJSON layer with the zip code data
    L.geoJSON(geojson, {
      style: function(feature) {
        // Find the electricity usage for the current zip code
        var usage = data.find(function(d) { return d.zipcode === feature.properties.ZIP; }).usage;
        // Set the fill color of the zip code based on the usage
        return {
          fillColor: colorScale(+usage),
          weight: 1,
          opacity: 1,
          color: 'white',
          fillOpacity: 0.8
        };
      },
      onEachFeature: function(feature, layer) {
        // Add a popup with the zip code and electricity usage
        var usage = data.find(function(d) { return d.zipcode === feature.properties.ZIP; }).usage;
        layer.bindPopup('Zip Code: ' + feature.properties.ZIP + '<br>Electricity Usage: ' + usage + ' kWh');
      }
    }).addTo(myMap);
  });
});













//////////////////////
////Bar chart
// Load the JSON data
d3.json("project3/testfile.geojson", function(data){
  console.log(data);
})

d3.json("project3/project3/testfile.geojson").then(function(data) {
 
  // Define the dropdown options based on the available years in the data
  var yearOptions = d3.set(data.map(function(d) { return d.data_year; })).values();
  yearDropdown.selectAll('option')
    .data(yearOptions)
    .enter()
    .append('option')
    .text(function(d) { return d; });

  // Define the initial data to display
  var activeY = 'electricity_use';
  var groupedData = d3.nest()
    .key(function(d) { return d.primary_property_type; })
    .entries(data);

  var initialData = groupedData.map(function(group) {
    var yValues = group.values.map(function(d) {
      return d[activeY];
    });
    var averageY = d3.mean(yValues);
    return {
      x: group.key,
      y: averageY
    };
  });

  // Define the plot layout and data
  var plotLayout = {
    title: 'Average Energy Use by Property Type',
    xaxis: {
      title: 'Property Type'
    },
    yaxis: {
      title: 'Energy Use (kBTU/sf)'
    }
  };
  var plotData = [{
    x: initialData.map(function(d) { return d.x; }),
    y: initialData.map(function(d) { return d.y; }),
    type: 'bar'
  }];

  // Create the plot
  Plotly.newPlot('plot', plotData, plotLayout);

  // Update the plot based on the selected year
  yearDropdown.on('change', function() {
    // Get the selected year from the dropdown
    var selectedYear = this.value;

    // Extract the x and y data for the selected year
    var selectedYearData = groupedData.map(function(group) {
      var yearData = group.values.filter(function(d) {
        return d.data_year == selectedYear;
      });

      // Calculate the average of the selected y-values for the current x-value
      var yValues = yearData.map(function(d) {
        return d[activeY];
      });
      var averageY = d3.mean(yValues);

      return {
        x: group.key,
        y: averageY
      };
    });

    // Update the plot with the new data
    var update = {
      x: [selectedYearData.map(function(d) { return d.x; })],
      y: [selectedYearData.map(function(d) { return d.y; })]
    };
    Plotly.update('plot', update);
  });

});
