from flask import Flask, render_template, request, jsonify
import json, os

app = Flask(__name__)

# Path to the JSON file that stores voting data (Fixed using ChatGPT)
RESULTS_FILE = os.path.join(os.path.dirname(__file__), "files/results.json")

# Helper functions

def load_results():
    # Reads the results from the JSON file
    with open(RESULTS_FILE, "r") as f:
        return json.load(f)

def save_results(results):
    # Writes the results back into the JSON file
    with open(RESULTS_FILE, "w") as f:
        json.dump(results, f, indent=2)

# Flask routes

@app.route("/")
def index():
    """Renders the main webpage containing the 'This or That' quiz."""
    return render_template("index.html")

@app.route("/submit_vote", methods=["POST"])
def submit_vote():
    # Receives the clientside input and updates the corresponding count in results.json
    data = request.get_json()
    question = data["question"]
    choice = data["choice"]

    results = load_results()
    # Increment the tally for the selected choice

    # Fixed using ChatGPT #
    if question in results:
        if choice in results[question]:
            results[question][choice] += 1
        else:
            results[question][choice] = 1
    else:
        # If the question doesn’t exist then create it
        results[question] = {choice: 1}
    # #

    save_results(results)
    return jsonify({"status": "success"})

@app.route("/get_results", methods=["GET"])
def get_results():
    # Returns all voting results from the serverside to display on the clientside
    results = load_results()
    return jsonify(results)

if __name__ == "__main__":
    app.run(debug=True)