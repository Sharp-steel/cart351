window.onload = function() {
  const height = Math.max(window.innerHeight - 64, 420);

  const globeID = "#globe";
  const modalWrapper = "#modal";
  const title = "#modal-title";
  const descriptionList = "#descriptions-ul";
  const descriptionBox = "#description-input";
  const userBox = "#username-input";
  const submit = "#submit";
  const close = "#modal-close";

  const maxBrightCount = 5;
  const rotationSpeed = -0.02;

  const globe = d3.select(globeID)
    .attr("width", window.innerWidth)
    .attr("height", height);

  // 3D/Orthographic projection
  const projection = d3.geoOrthographic()
    .scale(height / 2.3)
    .translate([window.innerWidth / 2, height / 2])
    .clipAngle(90);

  const path = d3.geoPath().projection(projection);

  const g = globe.append("g");
  const sphere = g.append("path")
    .datum({ type: "Sphere" })
    .attr("class", "sphere")
    .attr("fill", "#3d6095"); // Ocean Colour

  const countriesLayer = g.append("g").attr("id", "countries-layer");
  const bordersLayer = g.append("g").attr("id", "borders-layer");

  let countryData = [];
  let activeCountry = null;
  let isDragging = false;

  /** Retrieve country name from GeoJSON **/
  function getCountryName(country) {
    const name = country.properties?.name
    return name ? [name.toUpperCase()] : [];
}

  /** Searches for Country Data to match GeoJSON Country Name **/
  function findCountryData(country) {
    const names = getCountryName(country);
    for (const rec of countryData) {
      const nameUpper = rec.name ? rec.name.toUpperCase() : null;
      if (nameUpper && names.includes(nameUpper)) return rec;
    }
    return null;
  }

  /** Color intensity based on description count **/
  function getCountryFill(descriptionsCount) {
    const count = descriptionsCount || 0;
    const t = Math.min(count / maxBrightCount, 1);
    const dark = [28, 28, 28];
    const bright = [255, 209, 94];
    const r = Math.round(dark[0] + (bright[0] - dark[0]) * t);
    const g = Math.round(dark[1] + (bright[1] - dark[1]) * t);
    const b = Math.round(dark[2] + (bright[2] - dark[2]) * t);
    return `rgb(${r}, ${g}, ${b})`;
  }

  /** Modal menu helpers **/
  const modal = d3.select(modalWrapper);
  const modalTitle = d3.select(title);
  const descriptionsUl = d3.select(descriptionList);
  const descriptionInput = d3.select(descriptionBox);
  const userInput = d3.select(userBox)
  const submitButton = d3.select(submit);
  const closeButton = d3.select(close);

  // Determine if new Description was added //
  function newDescriptionAdded(country) {
    activeCountry = country;
    const data = findCountryData(country);
    const titleText = (data && data.name) ? data.name : (country.properties && country.properties.name) ? country.properties.name : "Unknown";
    modalTitle.text(titleText);

    descriptionsUl.selectAll("li").remove();
    if (data && Array.isArray(data.descriptions) && data.descriptions.length > 0) {
      data.descriptions.forEach(d => {
        descriptionsUl.append("li").text(`${d.user}: ${d.text}`);
      });
    } else {
      descriptionsUl.append("li").text("Nothing so far, be the one to rewrite this country's culture & history!");
    }

    descriptionInput.property("value", "");
    modal.classed("hidden", false);
    descriptionInput.node().focus();
  }

  function closeModal() {
    modal.classed("hidden", true);
    activeCountry = null;
  }

  /** User's description sent to Mongo **/
  async function submitDescription() {
    if (!activeCountry) return;
    const user = userInput.property("value").trim();
    const text = descriptionInput.property("value").trim();
    if (!user || !text) return;

    const nameToSend = activeCountry.properties?.name;
    if (!nameToSend) {
      alert("Couldn't determine country.");
      return;
    }

    try {
      const resp = await fetch('/descriptions/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: nameToSend, text, user })
      });
      const result = await resp.json();
      if (result.status === "success") {
        const updatedCountries = await fetch('/countries').then(r => r.json());
        countryData = updatedCountries;

        newDescriptionAdded(activeCountry);
        colorCountry(activeCountry);
        userInput.property("value", "");
        descriptionInput.property("value", "");

      } else {
        alert("Failed to save description.");
      }
    } catch (err) {
      console.error("Error posting description:", err);
      alert("Network or server error while saving description.");
    }
  }

  /** Draws the 3D Map using GeoJSON **/
  function drawWorld(geojson) {
    // Draw the ocean
    sphere.attr("d", path);

    // Draw the countries
    countriesLayer.selectAll("path.country")
      .data(geojson.features)
      .join("path")
      .attr("class", "country")
      .attr("d", path)
      .attr("fill", d => {
        const data = findCountryData(d);
        const descCount = data && Array.isArray(data.descriptions) ? data.descriptions.length : 0;
        return getCountryFill(descCount);
      })
      // Event Listener for Country Click
      .on("click", (event, d) => {
        event.stopPropagation();
        newDescriptionAdded(d);
      })
      .on("mouseenter", function() {
        d3.select(this).raise();
      });
  }

  // Color the Country after adding Descriptions //
  function colorCountry(feature) {
  const featureName = feature.properties?.name?.toUpperCase();
  countriesLayer.selectAll("path.country")
    .filter(d => {
      const dName = d.properties?.name?.toUpperCase();
      return dName === featureName;
    })
    .transition()
    .duration(400)
    .attr("fill", d => {
      const data = findCountryData(d);
      const count = data && Array.isArray(data.descriptions) ? data.descriptions.length : 0;
      return getCountryFill(count);
    });
}

  /** Drag & Zoom **/
  // DRAG
  const drag = d3.drag()
    .on("start", () => { isDragging = true; })
    .on("drag", (event) => {
      const rotate = projection.rotate();
      const long = rotate[0] + event.dx * 0.25;
      const lat = rotate[1] - event.dy * 0.25;
      projection.rotate([long, lat]);
      // Update all paths on drag
      countriesLayer.selectAll("path.country").attr("d", path);
      sphere.attr("d", path);
      // Update borders
      bordersLayer.selectAll("path").attr("d", path);
    })
    .on("end", () => { isDragging = false; });

  globe.call(drag);

  // ZOOM
  const zoom = d3.zoom()
    .scaleExtent([0.6, 6]) // Adjust zoom level
    .on("zoom", (event) => {
      projection.scale((height / 2.3) * event.transform.k);
      // Update paths
      countriesLayer.selectAll("path.country").attr("d", path);
      sphere.attr("d", path);
      bordersLayer.selectAll("path").attr("d", path);
    });

  globe.call(zoom);

  /** Rotation Loop **/
  let lastTime = Date.now();
  function rotationLoop() {
    if (!isDragging && rotationSpeed !== 0) {
      const now = Date.now();
      const dt = now - lastTime;
      lastTime = now;
      const rotate = projection.rotate();
      const long = rotate[0] + rotationSpeed * (dt / 16.666);
      projection.rotate([long, rotate[1]]);
      countriesLayer.selectAll("path.country").attr("d", path);
      sphere.attr("d", path);
      bordersLayer.selectAll("path").attr("d", path);
    } else {
      lastTime = Date.now();
    }
    requestAnimationFrame(rotationLoop);
  }

  /** Fetch data from Mongo & GeoJSON **/
  Promise.all([
    // load GeoJSON map
    d3.json('https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson'),
    fetch('/countries').then(r => r.json())
  ]).then(([geojson, backendCountries]) => {
    console.log(geojson.features[0].properties);
    countryData = backendCountries || [];

    // Draw world and start rotation loop
    drawWorld(geojson);
    rotationLoop();
  }).catch(err => {
    console.error("Error loading geojson or backend data:", err);
    alert("Failed to load world map or country data.");
  });

  closeButton.on("click", () => closeModal());
  submitButton.on("click", () => submitDescription());
};