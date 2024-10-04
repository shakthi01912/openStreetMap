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

        // If we have 2 markers, calculate the distance
        if (markers.length === 2) {
            calculateDistance();
        }
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