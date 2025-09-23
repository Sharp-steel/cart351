import requests # Import the library
token = "f69a340f1c8d286f1e9d061674955c97f2595f9a" # My API key
url = "https://api.waqi.info/search/" # URL that fetches all of the search commands
response = requests.get(url, params={"token": token, "keyword": "montreal"}) # Making the request for Search
results = response.json() # Get the response as json
# print(results) # Prints the data from the json file onto the terminal

# ----------------- STEP 5 --------------------- #

print(type(results)) # Returns as <class 'dict'>
print(results.keys()) # Returns as dict_keys(['status', 'data'])

responseData = results['data']
print(responseData) # Returns all of the subcategories under data
print(type(responseData)) # Returns as <class 'list'>

for item in responseData:
    print(item) # Each item represents a different part of Montreal
    print(type(item)) # Returns as <class 'dict'>
    print(item.keys()) # Returns as dict_keys(['uid', 'aqi', 'time', 'station'])
    print(item['station']['name']) # Prints the name of each location from the station data
    print(item['station']['geo']) # Prints the geolocation in latitude and longitude of each location from the station data
    print(item['aqi']) # Prints the current Air Quality Index Value of each location
    print(item['uid']) # Prints the UID Value of each location

# ----------------- STEP 6 --------------------- #

url_feed = "https://api.waqi.info/feed/@5468"
response_feed = requests.get(url_feed, params={"token": token})
results_feed = response_feed.json()
print(results_feed)

response_data_feed = results_feed['data']
print(type(response_data_feed)) # Returns as <class 'dict'>

for item in response_data_feed:
    print(item) # Accesses each key inside of response_data_feed

# print(type(item)) # Returns as <class 'str'>
aqi = (response_data_feed['aqi']) # Accesses the aqi and stores it in a variable
dominentpol = (response_data_feed['dominentpol']) # Accesses the dominentpol and stores it in a variable
iaqi = (response_data_feed['iaqi']) # Accesses iaqi and stores it in a variable
print(aqi) # Represents Live Air Quality
print(dominentpol) # Represents the Dominent Pollutent Value key and returns it as a string
print(iaqi.keys()) # All of the elements listed as keys

print(type(dominentpol)) # Returns as <class 'str'>
print(type(iaqi)) #Returns as <class 'dict'>

dominent_value = iaqi[dominentpol]['v'] # Takes the data stored in the iaqi variable, as well as the dominent poll variable and takes the value from the corresponding v key
print(dominent_value) # Returns the value of 24

# ----------------- STEP 7 --------------------- #

# The process to access the dominant pollutant value from different cities would be to request both the feed and the search URLs
# simultaneously to then pull both data values from each API and store it in a single variable. You can then use the variable to
# access whichever key you'd like from both datasets.