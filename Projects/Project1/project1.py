import requests
import random # Allows for random functionality
from rich.console import Console # Imports the Rich Console Library (Colours, Stylization, etc.)

token = "f69a340f1c8d286f1e9d061674955c97f2595f9a" # My API key
feed_url = "https://api.waqi.info/feed/" # URL that fetches the API commands for Feed
console = Console() # Initialize the Rich console so we can add stylized statements to the terminal

def fetch_aqi(city_name):
    url = f"{feed_url}{city_name}/?token={token}" # Fetches air quality data for a given city using the WAQI API
    response = requests.get(url) # Making the request for Feed
    results = response.json() # Get the response as json
    return results["data"]["aqi"] # Returns the AQI results

# Returns a color and emoji depending on the AQI value (The styling :])
def decorate(aqi):
    if aqi <= 50:
        return ("green", ":smiley: Good")
    elif aqi <= 100:
        return ("yellow", ":slightly_smiling_face: Moderate")
    elif aqi <= 150:
        return ("dark_orange", ":cloud:  Slightly Unhealthy")
    elif aqi <= 200:
        return ("red", ":nauseated_face: Unhealthy")
    elif aqi <= 300:
        return ("medium_violet_red", ":test_tube: Very Unhealthy")
    else:
        return ("grey53", ":skull: Hazardous")

# Returns the starting prompt within the terminal
console.print("\n[bold cyan]Welcome to Air Quality: Higher or Lower![/bold cyan]\n")
console.print("[bold]Which city around the world has the higher or lower Air Quality Index value? Earn a point for each correct guess![/bold]")
console.print("Enter 'h' if you think the second city has a higher number (Worse air quality) or enter 'l' if you think it's a lower number (Better air quality)")
console.print("Type [bold red]quit[/bold red] to quit at any point.\n")

score = 0

cities = ["Montreal", "Toronto", "Vancouver", "London", "Paris", "Los Angeles", "Berlin",
          "Tokyo", "Beijing", "Cairo", "Moscow", "Chicago", "Detroit", "Madrid", "Rome", 
          "Johannesburg", "Mumbai", "Shanghai", "Seoul", "Dubai", "Lagos", "Barcelona",
          "Atlanta", "Miami", "Amsterdam", "Stockholm", "Honolulu", "Ottawa", "Seattle", "Dallas", 
          "Liverpool", "Dublin", "Istanbul", "Athens", "Copenhagen", "Lisbon", "Wellington", "Sydney", 
          "Melbourne", "Helsinki", "Havana", "Bogota", "Cape Town", "Nairobi", "Jerusalem",
          "Anchorage", "Prague", "Bangkok", "Casablanca", "Jakarta", "Munich", "Geneva", "Vienna",
          "Riyadh", "Glasgow", "Edinburgh", "Oslo", "Warsaw", "Budapest", "Milan", "Tehran", "Baghdad", 
          "Damascus", "Chennai", "Chongqing", "Adelaide", "Canberra", "Perth", "Guangzhou", 
          "Wuhan", "Lima", "Bucharest", "Zagreb"]

# Main Input/Output
while True:
    city1, city2 = random.sample(cities, 2) # Takes 2 random cities by using the random function from the cities list
    aqi1, aqi2 = fetch_aqi(city1), fetch_aqi(city2) # Fetches and stores both randomly selected cities along with their corresponding data into unified variables
    
    colour1, emoji1 = decorate(aqi1) # Takes the colours and emojis from the decorate function and stores them within variables
    colour2, emoji2 = decorate(aqi2)
    console.print(f"\n[bold {colour1}]{city1}[/bold {colour1}] → AQI Value: [bold {colour1}]{aqi1}[/bold {colour1}] {emoji1}") # Prints the corresponding data

    # Input functionality
    userInput = input(f"Do you think {city2}'s AQI is Higher or Lower than {city1}? ").lower().strip()
    # Quits the game by entering quit and returning to the terminal
    if userInput == "quit":
        console.print(
            "\n[bold indian_red]Going so soon? Make sure to take a [italic]deep[/italic] breath and be aware of your surroundings! 💨[/bold indian_red]"
        )
        break
    # Checks if the answer is correct or not
    correct = (aqi2 > aqi1 and userInput == "h") or (aqi2 < aqi1 and userInput == "l")
    # Note: If you type anything other than h or l it will render as incorrect.
    if correct:
        score += 1 # Add a point if the answer is correct
        console.print(f"[bold green]Correct![/bold green] [bold {colour2}]{city2}[/bold {colour2}]'s AQI: [bold {colour2}]{aqi2}[/bold {colour2}]. Score: {score}")
    else:
        console.print(f"[bold red]Wrong![/bold red] [bold {colour2}]{city2}[/bold {colour2}]'s AQI: [bold {colour2}]{aqi2}[/bold {colour2}]. Final Score: {score}\n")
        score = 0
        again = input("Play again? (Type y/n or type quit): ").lower().strip()
        if again == "quit" or again == "n" or again != "y":
            console.print("\n[bold indian_red]Going so soon? Make sure to take a [italic]deep[/italic] breath and be aware of your surroundings! 💨[/bold indian_red]")
            break