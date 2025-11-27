/* PLEASE DO NOT CHANGE THIS FRAMEWORK ....
the get requests are all implemented and working ... 
so there is no need to alter ANY of the existing code: 
rather you just ADD your own ... */

window.onload = function () {
  document.querySelector("#queryChoice").selectedIndex = 0;
  //create once :)
  let description = document.querySelector("#Ex4_title");
  //array to hold the dataPoints
  let dataPoints = [];

  // /**** GeT THE DATA initially :: default view *******/
  // /*** no need to change this one  **/
  runQueryDefault("onload");

  /***** Get the data from drop down selection ****/
  let querySelectDropDown = document.querySelector("#queryChoice");

  querySelectDropDown.onchange = function () {
    console.log(this.value);
    let copyVal = this.value;
    console.log(copyVal);
    runQuery(copyVal);
  };

  /******************* RUN QUERY***************************  */
  async function runQuery(queryPath) {
    // // //build the url -end point
    const url = `/${queryPath}`;
    try {
      let res = await fetch(url);
      let resJSON = await res.json();
      console.log(resJSON);

      //reset the
      document.querySelector("#childOne").innerHTML = "";
      description.textContent = "";
      document.querySelector("#parent-wrapper").style.background =
        "rgba(51,102,255,.2)";

      switch (queryPath) {
        case "default": {
          displayAsDefault(resJSON);
          break;
        }
        case "one": {
          //sabine done
          displayInCirclularPattern(resJSON);
          break;
        }
        case "two": {
          //sabine done
          displayByGroups(resJSON, "weather", "eventName");
          break;
        }
        /***** TO DO FOR EXERCISE 4 *************************
         ** 1: Once you have implemented the mongodb query in server.py,
         ** you will receive it from the get request (THE FETCH HAS ALREADY BEEN IMPLEMENTED:: SEE ABOVE) 
         ** and will automatically will enter into the correct select case
         **  - based on the value that the user chose from the drop down list...)
         ** You need to design and call a custom display function FOR EACH query that you construct ...
         ** 4 queries - I want 4 UNIQUE display functions - you can use the ones I created
         ** as inspiration ONLY - DO NOT just copy and change colors ... experiment, explore, change ...
         ** you can create your own custom objects - but NO images, video or sound... (will get 0).
         ** bonus: if your visualizations(s) are interactive or animate.
         ****/
        case "three": {
          displayFire(resJSON);
          break;
        }
        case "four": {
          displayAir(resJSON);
          break;
        }

        case "five": {
          displayEarth(resJSON);
          break;
        }
        case "six": {
          displayWater(resJSON);
          break;
        }
        default: {
          console.log("default case");
          break;
        }
      } //switch
    } catch (err) {
      console.log(err);
    }
  }
  //will make a get request for the data ...

  /******************* RUN DEFAULT QUERY***************************  */
  async function runQueryDefault(queryPath) {
    // // //build the url -end point
    const url = `/${queryPath}`;
    try {
      let res = await fetch(url);
      let resJSON = await res.json();
      console.log(resJSON);
      displayAsDefault(resJSON);
    } catch (err) {
      console.log(err);
    }
  }
  /*******************DISPLAY AS GROUP****************************/

  function displayByGroups(resultObj, propOne, propTwo) {
    dataPoints = [];
    let finalHeight = 0;
    //order by WEATHER and Have the event names as the color  ....

    //set background of parent ... for fun ..
    document.querySelector("#parent-wrapper").style.background =
      "rgba(51, 153, 102,1)";
    description.textContent = "BY WEATHER AND ALSO HAVE EVENT NAMES {COLOR}";
    description.style.color = "rgb(179, 230, 204)";

    let coloredEvents = {};
    let resultSet = resultObj.results;

    //reget
    let possibleEvents = resultObj.events;
    let possibleColors = [
      "rgb(198, 236, 217)",
      "rgb(179, 230, 204)",
      "rgb(159, 223, 190)",
      "rgb(140, 217, 177)",
      "rgb(121, 210, 164)",
      "rgb(102, 204, 151)",
      "rgb(83, 198, 138)",
      "rgb(64, 191, 125)",
      "rgb(255, 204, 179)",
      "rgb(255, 170, 128)",
      "rgb(255, 153, 102)",
      "rgb(255, 136, 77)",
      "rgb(255, 119, 51)",
      "rgb(255, 102, 26)",
      "rgb(255, 85, 0)",
      "rgb(230, 77, 0)",
      "rgb(204, 68, 0)",
    ];

    for (let i = 0; i < possibleColors.length; i++) {
      coloredEvents[possibleEvents[i]] = possibleColors[i];
    }

    let offsetX = 20;
    let offsetY = 150;
    // find the weather of the first one ...
    let currentGroup = resultSet[0][propOne];
    console.log(currentGroup);
    let xPos = offsetX;
    let yPos = offsetY;

    for (let i = 0; i < resultSet.length - 1; i++) {
      dataPoints.push(
        new myDataPoint(
          resultSet[i].dataId,
          resultSet[i].day,
          resultSet[i].weather,
          resultSet[i].start_mood,
          resultSet[i].after_mood,
          resultSet[i].after_mood_strength,
          resultSet[i].event_affect_strength,
          resultSet[i].event_name,
          //map to the EVENT ...
          coloredEvents[resultSet[i].event_name],
          //last parameter is where should this go...
          document.querySelector("#childOne"),
          //which css style///
          "point_two"
        )
      );

      /** check if we have changed group ***/
      if (resultSet[i][propOne] !== currentGroup) {
        //update
        currentGroup = resultSet[i][propOne];
        offsetX += 150;
        offsetY = 150;
        xPos = offsetX;
        yPos = offsetY;
      }
      // if not just keep on....
      else {
        if (i % 10 === 0 && i !== 0) {
          xPos = offsetX;
          yPos = yPos + 15;
        } else {
          xPos = xPos + 15;
        }
      } //end outer else

      dataPoints[i].update(xPos, yPos);
      finalHeight = yPos;
    } //for

    document.querySelector("#childOne").style.height = `${finalHeight + 20}px`;
  } //function

  /*****************DISPLAY IN CIRCUlAR PATTERN:: <ONE>******************************/
  function displayInCirclularPattern(resultOBj) {
    //reset
    dataPoints = [];
    let xPos = 0;
    let yPos = 0;
    //for circle drawing
    let angle = 0;
    let centerX = window.innerWidth / 2;
    let centerY = 350;

    let scalar = 300;
    let yHeight = Math.cos(angle) * scalar + centerY;

    let resultSet = resultOBj.results;
    let coloredMoods = {};

    let possibleMoods = resultOBj.moods;
    let possibleColors = [
      "rgba(0, 64, 255,.5)",
      "rgba(26, 83, 255,.5)",
      "rgba(51, 102, 255,.7)",
      "rgba(51, 102, 255,.4)",
      "rgba(77, 121,255,.6)",
      "rgba(102, 140, 255,.6)",
      "rgba(128, 159, 255,.4)",
      "rgba(153, 179, 255,.3)",
      "rgba(179, 198, 255,.6)",
      "rgba(204, 217, 255,.4)",
    ];

    for (let i = 0; i < possibleMoods.length; i++) {
      coloredMoods[possibleMoods[i]] = possibleColors[i];
    }

    //set background of parent ... for fun ..
    document.querySelector("#parent-wrapper").style.background =
      "rgba(0, 26, 102,1)";
    description.textContent = "BY AFTER MOOD";
    description.style.color = "rgba(0, 64, 255,.5)";

    for (let i = 0; i < resultSet.length - 1; i++) {
      dataPoints.push(
        new myDataPoint(
          resultSet[i].dataId,
          resultSet[i].day,
          resultSet[i].weather,
          resultSet[i].start_mood,
          resultSet[i].after_mood,
          resultSet[i].after_mood_strength,
          resultSet[i].event_affect_strength,
          resultSet[i].event_name,
          //map to the day ...
          coloredMoods[resultSet[i].after_mood],
          //last parameter is where should this go...
          document.querySelector("#childOne"),
          //which css style///
          "point_two"
        )
      );
      /*** circle drawing ***/
      xPos = Math.sin(angle) * scalar + centerX;
      yPos = Math.cos(angle) * scalar + centerY;
      angle += 0.13;

      if (angle > 2 * Math.PI) {
        angle = 0;
        scalar -= 20;
      }
      dataPoints[i].update(xPos, yPos);
    } //for

    document.querySelector("#childOne").style.height = `${yHeight}px`;
  } //function

  /*****************DISPLAY AS DEFAULT GRID :: AT ONLOAD ******************************/
  function displayAsDefault(resultOBj) {
    //reset
    dataPoints = [];
    let xPos = 0;
    let yPos = 0;
    const NUM_COLS = 50;
    const CELL_SIZE = 20;
    let coloredDays = {};
    let resultSet = resultOBj.results;
    possibleDays = resultOBj.days;
    /*
  1: get the array of days (the second entry in the resultOBj)
  2: for each possible day (7)  - create a key value pair -> day: color and put in the
  coloredDays object
  */
    console.log(possibleDays);
    let possibleColors = [
      "rgb(255, 102, 153)",
      "rgb(255, 77, 136)",
      "rgb(255, 51, 119)",
      "rgb(255, 26, 102)",
      "rgb(255, 0, 85)",
      "rgb(255, 0, 85)",
      "rgb(255, 0, 85)",
    ];

    for (let i = 0; i < possibleDays.length; i++) {
      coloredDays[possibleDays[i]] = possibleColors[i];
    }
/* for through each result
1: create a new MyDataPoint object and pass the properties from the db result entry to the object constructor
2: set the color using the coloredDays object associated with the resultSet[i].day
3:  put into the dataPoints array.
**/
    //set background of parent ... for fun ..
    document.querySelector("#parent-wrapper").style.background =
      "rgba(255,0,0,.4)";
    description.textContent = "DEfAULT CASE";
    description.style.color = "rgb(255, 0, 85)";

    //last  element is the helper array...
    for (let i = 0; i < resultSet.length - 1; i++) {
      dataPoints.push(
        new myDataPoint(
          resultSet[i].dataId,
          resultSet[i].day,
          resultSet[i].weather,
          resultSet[i].start_mood,
          resultSet[i].after_mood,
          resultSet[i].after_mood_strength,
          resultSet[i].event_affect_strength,
          resultSet[i].evnet_name,
          //map to the day ...
          coloredDays[resultSet[i].day],
          //last parameter is where should this go...
          document.querySelector("#childOne"),
          //which css style///
          "point"
        )
      );

      /** this code is rather brittle - but does the job for now .. draw a grid of data points ..
//*** drawing a grid ****/
      if (i % NUM_COLS === 0) {
        //reset x and inc y (go to next row)
        xPos = 0;
        yPos += CELL_SIZE;
      } else {
        //just move along in the column
        xPos += CELL_SIZE;
      }
      //update the position of the data point...
      dataPoints[i].update(xPos, yPos);
    } //for
    document.querySelector("#childOne").style.height = `${yPos + CELL_SIZE}px`;
  } //function

  /***********************************************/

/* -------------------- FLARE/FIRE (Three) -------------------- */
function displayFire(resultObj) {
  dataPoints = [];
  const res = resultObj.results;
  const total = res.length;

  const flameColours = {
    'happy': 'rgba(234, 71, 35, 1)',
    'calm': 'rgba(227, 107, 22, 1)',
    'serene': 'rgba(238, 29, 29, 1)', 
    'neutral': 'rgba(222, 174, 30, 1)',
    'well': 'rgba(241, 151, 25, 1)'
};

  const centerX = window.innerWidth / 2;
  const centerY = 400;

  document.querySelector("#parent-wrapper").style.background = "#763732ff";
  description.textContent = "Positive Mood - Flare/Fire";
  description.style.color = "orange";

  for (let i = 0; i < total; i++) {    
    const colour = flameColours[res[i].after_mood];
    const dp = new myDataPoint(
      res[i].dataId, res[i].day, res[i].weather,
      res[i].start_mood, res[i].after_mood,
      res[i].after_mood_strength,
      res[i].event_affect_strength,
      res[i].event_name,
      colour,
      document.querySelector("#childOne"),
      "point_two"
    );

    /* AI Helped to Create Flame Shape */
    const flameHeight = Math.random() * 300 + 50; // adjust flame height
    const angle = (Math.random() - 0.5) * Math.PI / 1.5; // left/right
    const radius = flameHeight * 0.7 * Math.random(); // decrease width with height

    const x = centerX + radius * Math.sin(angle);
    const y = centerY - flameHeight;
    /* */

    dp.update(x, y);

    dataPoints.push(dp);
  }
}


/* -------------------- CLOUDS/AIR (Four) -------------------- */
function displayAir(resultObj) {
  dataPoints = [];
  const res = resultObj.results;
  const total = res.length;

  const centerY = 200;

  document.querySelector("#parent-wrapper").style.background = "#a6daffff";
  description.textContent = "Per Event - Clouds/Air";
  description.style.color = "black";

  const airColours = [
    '#ffffff',
    '#e2e2e2',
    '#cfcdcd',
    '#bab9b9',
    '#999999',
    '#848484'
  ];

  const cloudsCount = 10;
  const pointsPerCloud = 10;

   for (let c = 0; c < cloudsCount; c++) {
    const cloudCenterX = Math.random() * window.innerWidth * 0.8 + window.innerWidth * 0.1;
    const cloudCenterY = centerY + (Math.random() - 0.5) * 50;

    for (let i = 0; i < pointsPerCloud; i++) {
      const colour = airColours[Math.floor(Math.random() * airColours.length)];

      const dp = new myDataPoint(
        res[i % total].dataId,
        res[i % total].day,
        res[i % total].weather,
        res[i % total].start_mood,
        res[i % total].after_mood,
        res[i % total].after_mood_strength,
        res[i % total].event_affect_strength,
        res[i % total].event_name,
        colour,
        document.querySelector("#childOne"),
        "point_two"
      );

      const offsetX = (Math.random() - 0.5) * 100;
      const offsetY = (Math.random() - 0.5) * 50;

      const x = cloudCenterX + offsetX;
      const y = cloudCenterY + offsetY;

      dp.update(x, y);
      dataPoints.push(dp);
    }
  }
}

/* -------------------- EARTH (Five) -------------------- */
function displayEarth(resultObj) {
  dataPoints = [];
  const res = resultObj.results;

  const centerY = 400;
  const width = window.innerWidth;
  const leftGrass = width / 2;
  const rightGrass = width / 2;

  document.querySelector("#parent-wrapper").style.background = "#3e2723";
  description.textContent = "Monday (Brown) vs Tuesday (Green) - Ground/Earth";
  description.style.color = "#ffffff";

  const earthColours = ["#6d4c41", "#795548", "#8d6e63", "#a1887f", ];
  const grassColours = ["#40826D", "#228B22", "#8A9A5B", "#71cf12ff"]

  const monday = res.filter(item => item.day === "Monday");
  const tuesday = res.filter(item => item.day === "Tuesday");


  monday.forEach((item) => {
    const strength = parseInt(item.event_affect_strength) || 1;
    const colorIndex = Math.min(strength - 1, earthColours.length - 1);
    const colour = earthColours[colorIndex];

    const dp = new myDataPoint(
      item.dataId,
      item.day,
      item.weather,
      item.start_mood,
      item.after_mood,
      item.after_mood_strength,
      item.event_affect_strength,
      item.event_name,
      colour,
      document.querySelector("#childOne"),
      "point_two"
    );

    const x = Math.random() * leftGrass;
    const bladeHeight = 10 + strength * 5;
    const y = centerY - bladeHeight;

    dp.container.style.width = "8px";
    dp.container.style.height = `${bladeHeight}px`;
    dp.container.style.borderRadius = "1px";
    dp.container.style.background = colour;

    dp.update(x, y);
    dataPoints.push(dp);
  });

  tuesday.forEach((item) => {
    const strength = parseInt(item.event_affect_strength) || 1;
    const colorIndex = Math.min(strength - 1, grassColours.length - 1);
    const colour = grassColours[colorIndex];

    const dp = new myDataPoint(
      item.dataId,
      item.day,
      item.weather,
      item.start_mood,
      item.after_mood,
      item.after_mood_strength,
      item.event_affect_strength,
      item.event_name,
      colour,
      document.querySelector("#childOne"),
      "point_two"
    );

    const x = leftGrass + Math.random() * rightGrass;
    const bladeHeight = 50 + strength * 10;
    const y = centerY - bladeHeight;

    dp.container.style.width = "8px";
    dp.container.style.height = `${bladeHeight}px`;
    dp.container.style.borderRadius = "1px";
    dp.container.style.background = colour;

    dp.update(x, y);
    dataPoints.push(dp);
  });
}


/* -------------------- RAIN/WATER (Six) -------------------- */
function displayWater(resultObj) {
  dataPoints = [];
  const res = resultObj.results;

  document.querySelector("#parent-wrapper").style.background = "#2f2f2f";
  description.textContent = "Negative Moods — Rain/Water";
  description.style.color = "#fff";

  const rainColours = {
    'sunny': '#a0c4ff',
    'clear': '#8ecfff',
    'cloudy': '#74b9ff',
    'snowing': '#4c8cff',
    'fog': '#1e6bff',
    'raining': '#0050cc',
    'grey': '#003399',
    'stormy': '#002878'
  };

  const negative_moods = ['sad','angry','neutral','calm','anxious','moody','hurt'];

  const filtered = res.filter(item => 
    negative_moods.includes(item.start_mood) &&
    negative_moods.includes(item.after_mood)
  );

  filtered.forEach(item => {
    const colour = rainColours[item.weather];

    const dp = new myDataPoint(
      item.dataId,
      item.day,
      item.weather,
      item.start_mood,
      item.after_mood,
      item.after_mood_strength,
      item.event_affect_strength,
      item.event_name,
      colour,
      document.querySelector("#childOne"),
      "point_two"
    );

    const x = Math.random() * window.innerWidth;

    const dropletHeight = 20 + Math.random() * 10; 
    const y = Math.random() * 400;

    dp.container.style.width = "2px";
    dp.container.style.height = `${dropletHeight}px`;
    dp.container.style.borderRadius = "1px";
    dp.container.style.background = colour;

    dp.update(x, y);
    dataPoints.push(dp);
  });
}

};