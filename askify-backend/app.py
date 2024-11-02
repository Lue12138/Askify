from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/classify', methods=['POST', 'OPTIONS'])  # Allow POST and OPTIONS methods
def classify():
    if request.method == "OPTIONS":  # Handle preflight requests
        return jsonify({"status": "Preflight request successful"}), 200

    data = request.get_json()  # Get JSON data from the request
    url = data.get('url')  # Extract the URL

    if url:
        print("Received URL:", url)  # Print the URL to the console

        # Send the URL back in the response
        return jsonify({"received_url": url}), 200
    else:
        return jsonify({"error": "No URL provided"}), 400


if __name__ == '__main__':
    app.run(debug=True)
