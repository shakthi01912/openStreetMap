// Initialize the map centered on London
const map = L.map('map').setView([51.5074, -0.1278], 12); // Centered on London

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Initialize variables to hold marker locations
let markers = [];

// Add event listener for map click to drop markers
map.on('click', function(e) {
    const lat = e.latlng.lat;
    const lng = e.latlng.lng;

    // Limit to 2 markers
    if (markers.length < 2) {
        const marker = L.marker([lat, lng]).addTo(map);
        markers.push([lat, lng]); // Store the coordinates
    } else {
        alert("You can only drop two markers.");
    }
});

// Function to calculate distance between the two points
function calculateDistance() {
    fetch('/calculate_distance', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ point1: markers[0], point2: markers[1] }),
    })
    .then(response => response.json())
    .then(data => {
        const resultDiv = document.getElementById('result');
        resultDiv.innerText = "Distance between points: " + data.distance.toFixed(2) + " km";
    })
    .catch(error => console.error('Error:', error));
}

// Function to get the best route using OSRM
function getRoute(start, end) {
    const startCoord = start[1] + ',' + start[0]; // OSRM needs 'lng,lat'
    const endCoord = end[1] + ',' + end[0];

    fetch(`http://router.project-osrm.org/route/v1/walking/${startCoord};${endCoord}?overview=full`)
    .then(response => response.json())
    .then(data => {
        console.log(data); // Log the entire response for debugging
        if (data.routes && data.routes.length > 0) {
            const route = data.routes[0].geometry.coordinates;

            // Create a polyline for the route
            const routeLine = L.polyline(route.map(coord => [coord[1], coord[0]]), {color: 'blue'}).addTo(map);
            map.fitBounds(routeLine.getBounds()); // Adjust map view to fit the route
        } else {
            alert("Route not found.");
        }
    })
    .catch(error => console.error('Error:', error));
}

// Add event listener to the button to find the route
document.getElementById('find-route').addEventListener('click', function() {
    if (markers.length === 2) {
        calculateDistance(); // Calculate distance
        getRoute(markers[0], markers[1]); // Get and display route
    } else {
        alert("Please drop two markers to find the route.");
    }
});