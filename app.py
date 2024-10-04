from flask import Flask, request, jsonify, render_template
from geopy.distance import geodesic

app = Flask(__name__)

# Coordinates for London (latitude, longitude)
locations = {
    "London": (51.5074, -0.1278)  # London
}

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/calculate_distance', methods=['POST'])
def calculate_distance():
    data = request.get_json()
    point1 = data.get("point1") 
    point2 = data.get("point2")  

    # Calculate distance using geopy
    distance = geodesic(point1, point2).kilometers
    return jsonify({"distance": distance})

if __name__ == '__main__':
    app.run(debug=True)