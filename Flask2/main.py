from flask import Flask, render_template, request
app = Flask(__name__)

@app.route("/")
def default():
    return render_template("base.html")

@app.route("/index")
def index():
    passedDictionary={"fav_color":"fuscia", "fav_veg":"cauliflower", "fav_fruit":"kiwi", "fav_animal":"toucan"}
    return render_template("index.html", user={"username":"ethan"}, passedDictionary = passedDictionary, passedImg = "rowlet.jpg")

@app.route("/pineParent")
def pineParent():
    return render_template("pineappleParent.html")

@app.route("/about")
def about():
    return render_template("pineappleChild.html", dataPassedA = "test test test")

@app.route("/addPlantData")
def addPlantData():
    return render_template("addPlantData.html")

@app.route("/thank_you")
def thank_you():
    app.logger.info(request.args)
    return render_template("thankyou.html",owner_name = request.args["a_name"])

@app.errorhandler(404)
def page_not_found(e):
    return render_template("404.html"),404

app.run(debug=True)