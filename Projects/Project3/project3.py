from flask import Flask, request, jsonify, render_template
from flask_pymongo import PyMongo
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

db_user = os.getenv('MONGODB_USER')
db_pass = os.getenv('DATABASE_PASSWORD')
db_name = os.getenv('DATABASE_NAME')

uri = f"mongodb+srv://{db_user}:{db_pass}@cluster0.yjrglcs.mongodb.net/{db_name}?retryWrites=true&w=majority"
app.config["MONGO_URI"] = uri
mongo = PyMongo(app)
countries = mongo.db.countries  # Access the countries collection

@app.route('/')
def index():
    return render_template('index.html')

# Get all countries with description count
@app.route('/countries')
def get_countries():
    all_countries = list(countries.find({}, {"_id": 0, "name": 1, "descriptions": 1}))
    for country in all_countries:
        country["descriptionCount"] = len(country.get("descriptions", []))
    return jsonify(all_countries)

# Add a description
@app.route('/descriptions/add', methods=['POST'])
def add_description():
    data = request.json
    name = data.get("name")
    text = data.get("text")
    user = data.get("user")

    update = {
        "$push": {
            "descriptions": {
                "user": user,
                "text": text
            }
        }
    }

    countries.update_one(
        {"name": name},
        update, upsert=True
    )

    return jsonify({"status": "success"})

if __name__ == '__main__':
    app.run(debug=True)