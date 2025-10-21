from flask import Flask,render_template,request
import os
app = Flask(__name__)


# the default route
@app.route("/")
def index():
      return render_template("index.html")

#*************************************************

#Task: Variables and JinJa Templates
@app.route("/t1")
def t1():
      the_topic = "donuts"
      number_of_donuts = 28
      donut_data= {
      "flavours":["Regular", "Chocolate", "Blueberry", "Devil's Food"],
      "toppings": ["None","Glazed","Sugar","Powdered Sugar",
                   "Sprinkle","Chocolate","Maple"]
                   }
      icecream_flavors = ["Vanilla","Raspberry","Cherry", "Lemon"]
      return render_template("t1.html", imgOne = "donut_a.png", imgTwo = "donut_c.png", flavours = donut_data["flavours"], toppings = donut_data["toppings"])

#*************************************************

#Task: HTML Form get & Data 
@app.route("/t2")
def t2():
    return render_template("t2.html")

@app.route("/thank_you_t2")
def thank_you_t2():
    app.logger.info(request.args)

    name = request.args["name"]
    animal = request.args["animal"]
    reasoning = request.args["reasoning"]

    singleString = f"Looking over the results, it seems as if {name} likes: {animal} because {reasoning}"
    singleStringNoVowels = ""

    for letter in singleString:
         
         if (letter in "aeiou"):
              singleStringNoVowels += "*"
        
         else:
            singleStringNoVowels += letter

    return render_template("thank_you_t2.html", singleString=singleString,  singleStringNoVowels=singleStringNoVowels, name=name)

#*************************************************

#run
app.run(debug=True)