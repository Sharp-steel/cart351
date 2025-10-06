from flask import Flask

app = Flask(__name__)

@app.route("/")
def index():
    return '<h1> Hello CART 351!</h1>'

@app.route("/about")
def about():
    return '<h1 style = "color:purple"> About Cart 351!</h1>'

@app.route("/user/<name>")
def user_profile(name):
    # we will use templates sooN!
    return f"<h2> This is <span style = 'color:orange'>{name}'s</span> profile page</h2>"

@app.route("/another/<dynamicVar>")
def another_route(dynamicVar):
    # we will use templates sooN!
    return f"<h2> the 100th letter of {dynamicVar} is {dynamicVar[99]}</h2>"

@app.route("/cats/<catname>")
def cats(catname):
    if catname.endswith('y'):
        catNewName = catname[:-1]
        catNewName = "iful"
    else:
        catNewName = catname + "y"
    return f"<h2> The name of my cat {catname} is <span style = 'color:orange'>{catname}{catNewName}</span></h2>"


app.run()