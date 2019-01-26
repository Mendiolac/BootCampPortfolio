// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"

var query2 = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_month.geojson"

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {


  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
  }

  

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: function (feature, latlng) {
      function getColor(d) {
        return d < 1 ? '	rgb(64, 255, 0)' :
        d < 2  ? 'rgb(64, 255, 0)' :
        d < 3  ? 'rgb(255, 255, 0)' :
        d < 4  ? 'rgb(250, 183, 0)' :
        d < 5  ? 'rgb(255, 64, 0)' :
    
                    'rgb(255,0,0)';
      }
    
      
      var color = getColor(feature.properties.mag);
    
      
      var geojsonMarkerOptions = {
        radius: 4*feature.properties.mag,
        fillColor: color,
        color: "black",
        weight: 1,
        opacity: 1.5,
        fillOpacity: 1.5
      };
      return L.circleMarker(latlng, geojsonMarkerOptions);

      
    }
  });


  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
  
}

function createMap(earthquakes) {

  // Define streetmap and darkmap layers
var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets-basic",
  accessToken: API_KEY
});

  var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [streetmap, earthquakes]

  });

  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);


  function getColor(d) {
    return d < 1 ? '	rgb(64, 255, 0)' :
    d < 2  ? 'rgb(255, 255, 0)' :
    d < 3  ? 'rgb(64, 255, 0)' :
    d < 4  ? 'rgb(191, 255, 0)' :
    d < 5  ? 'rgb(255, 64, 0)' :

                'rgb(255,0,0)';
  }

  // Create a legend to display information about our map
  var legend = L.control({position: 'bottomright'});

  legend.onAdd = function (map) {
  
      var div = L.DomUtil.create('div', 'info legend'),
      grades = [0, 1, 2, 3, 4, 5],
      labels = [];
      
      
      div.innerHTML+='Magnitude<br><hr>'
      
      // loop through our density intervals and generate a label with a colored square for each interval
      for (var i = 0; i < grades.length; i++) {
          div.innerHTML +=
              '<i style="background:' + getColor(grades[i] + 1) + '">&nbsp&nbsp&nbsp&nbsp</i> ' +
              grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');

  }
  
  return div;
  };
  
  legend.addTo(myMap);

}