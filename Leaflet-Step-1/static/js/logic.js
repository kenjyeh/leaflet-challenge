// Create map object
var myMap = L.map("map", {
    center: [33.98, -39.17],
    zoom: 3
  });


// Store API query URL
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson";



// Add a tile layer (the background map image) to our map
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
}).addTo(myMap);


// plot the markers on map
d3.json(url, function(data) {

    for (var i = 0; i < data.features.length; i++) {
        
        // Extract coordinates, magnitude, location name, and date of earthquakes
        var coord = data.features[i].geometry.coordinates;
        var mag = data.features[i].properties.mag;
        var date = new Date(data.features[i].properties.time);
        var loc_name = data.features[i].properties.place;

        // Circle markers
        L.circle([coord[1], coord[0]], {
            color: "#E3E3E3",
            weight: 1,
            fillColor: getColor(mag),
            fillOpacity: 0.5,
            radius: mag * 50000 // Adjust radius size
        }).bindPopup("<h2>" + loc_name + "</h2><hr><h3> Magnitude: " + mag + "</h3>" + "<p>" + date + "</p>") // Add tooltip
        .addTo(myMap);
    }
});

// Function to set marker color based on magnitude using a ternary operator
function getColor(mag){
    return mag > 8 ? "#FF0000":
        mag > 7 ? "#FF7F50" :
        mag > 6 ? "#FF8C00":
        mag > 5 ? "#FFFF00":
        mag > 4 ? "#008000":
        "#006400";
}



// Create magnitude legend
var legend = L.control({ position: "bottomright" }); // Add layer control

legend.onAdd = function(map) {
    var div = L.DomUtil.create("div", "legend");
    div.innerHTML += "<h4>Magnitude</h4>";
    div.innerHTML += "<i style='background: #006400'></i><span>0-4</span><br>";
    div.innerHTML += "<i style='background: #008000'></i><span>4-5</span><br>";
    div.innerHTML += "<i style='background: #FFFF00'></i><span>5-6</span><br>";
    div.innerHTML += "<i style='background: #FF8C00'></i><span>6-7</span><br>";
    div.innerHTML += "<i style='background: #FF7F50'></i><span>7-8</span><br>";
    div.innerHTML += "<i style='background: #FF0000'></i><span>8+</span><br>";
    return div;
  };

legend.addTo(myMap);