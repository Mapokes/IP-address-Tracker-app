const ipSite = document.querySelector(".ip-adress");
const locationSite = document.querySelector(".location");
const timezoneSite = document.querySelector(".timezone");
const ispSite = document.querySelector(".isp");
const userInput = document.getElementById("user-input");

// proxy for laoding ipify
const proxyForIpify = "https://cors-anywhere.herokuapp.com/";
const ipifySite = "geo.ipify.org/api/v2/country,city?apiKey=";
const apiIpifyKey = "at_f1M7O86WAUnz81HopSxgwRSsok7VH&";

// resets user input on page load
userInput.value = "";

// gets inputed IP or domain adress and returns according site string
function getIpOrDomain(userInputSearch) {
  const userInputValue = userInputSearch.toLowerCase().trim();
  const dotRegex = /\./g;
  const dotNumber = userInputValue.match(dotRegex);
  const keyIp = `ipAddress=${userInputSearch}`;
  const keyDomain = `domain=${userInputSearch}`;

  if (dotNumber.length == 3) {
    return keyIp;
  } else {
    return keyDomain;
  }
}

// gets JSON from IP Geolocation API by IPify and changes map and marker accordingly
function getInputs() {
  try {
    fetch(`${proxyForIpify}${ipifySite}${apiIpifyKey}${getIpOrDomain(userInput.value)}`, {
      cache: "no-cache",
    })
      .then((response) => response.json())
      .then((data) => {
        ipSite.textContent = data.ip;
        locationSite.textContent = `${data.location.country} ${data.location.region} ${data.location.city}`;
        timezoneSite.textContent = `UTC ${data.location.timezone}`;
        ispSite.textContent = data.isp;

        let locationLat = data.location.lat;
        let locationLong = data.location.lng;

        map.panTo([locationLat, locationLong]);
        marker.setLatLng([locationLat, locationLong]);
      });
  } catch {
    alert("Please enter valid adress");
  }
}

//========================================
//Submiting variants
//========================================

const submitButton = document.getElementById("submit-btn");

submitButton.addEventListener("click", () => {
  validate(userInput.value);
});

userInput.addEventListener("keypress", (e) => {
  if (e.key == "Enter") {
    validate(userInput.value);
  }
});

//========================================
//Validate User Input
//========================================
let arrayOfUserInputs = [];

// checks if user didn't submit same adress as the last time to prevent proxy timeout
function validate(userText) {
  if (userText != arrayOfUserInputs[0]) {
    getInputs();
    arrayOfUserInputs.unshift(userInput.value);
    if (arrayOfUserInputs.length > 1) {
      arrayOfUserInputs.pop();
    }
  } else {
    alert("Enter different IP/domain");
  }
}

//========================================
//MAP - LeafletJS API
//========================================

// loads map and sets to London
let map = L.map("map", { zoomControl: false }).setView([51.505, -0.09], 13);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  zoomControl: false,
  maxZoom: 19,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

// loads and sets marek to London
let marker = L.marker([51.5, -0.09]).addTo(map);

// changes marker to custom one
const customMarker = document.querySelector(".leaflet-marker-icon");

customMarker.src = "./images/icon-location.svg";
customMarker.style.width = 46 + "px";
customMarker.style.height = 56 + "px";
