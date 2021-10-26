// variables
var inputEl = document.querySelector('input[name="cityName"]');
var btnSearch = document.querySelector("#btnSearch");
var prvCityCont = document.querySelector("#prev-City");
var mainCont = document.querySelector("#mainCont");
var weather = document.querySelector("#weather");
var formInput = document.querySelector("form");
var pastSearches = [];

var apiKey = "966a86c8bd69d14a621d45a4cd70fed2";
var rootURL = "https://api.openweathermap.org/";


// Main function Should be able to break it down 
function getWeather(city){
    mainCont.innerHTML = "";
    weather.innerHTML = "";

    // Set up values for OpenWeather API Geolocation
    var cityURL ="https://api.openweathermap.org/geo/1.0/direct?q=" + city + ",US&limit=5&appid=" + apiKey;

  // API fetch of data from OpenWeatherMap-Geolocation
  fetch(cityURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      var citydata = data[0];
      console.log(citydata);

      //set up values for weather API OneCall 
      var weatherURL ="https://api.openweathermap.org/data/2.5/onecall?lat=" + citydata.lat + "&lon=" + citydata.lon + "&exclude=minutely,hourly&units=imperial&appid=" + apiKey;

      // API fetch of data from OpenWeatherMap-OneCall
      fetch(weatherURL)
        .then(function (response) {
          return response.json();
        })
        
        .then(function (wData) {
            // Create H2 element and save name & current time
            var cityName = document.createElement("h2");
            cityName.className = "card-header bg-secondary bg-gradient ";
            cityName.textContent = city.toUpperCase() + " "+  moment.unix(wData.current.sunrise).format("DD/MM/YYYY");
            // get icon from API and save to variable
            var iWeather = document.createElement("img");
            iWeather.setAttribute("src", "https://openweathermap.org/img/w/" + wData.current.weather[0].icon + ".png");
            
            // append icon to cityName, then append cityName to main container
            cityName.append(iWeather);
            mainCont.append(cityName);

          
            // create ul item to hold data
            var weatherNode = document.createElement("ul");
            weatherNode.className = "list-group";
            
            //create list item and save as temperature, append to ul element
            var temperature = document.createElement("li");
            temperature.textContent = "temperature: " + wData.current.temp + "\u00B0F";
            temperature.className = "list-group-item rounded";   
            weatherNode.append(temperature);

            //create list item and save as wind, append to ul element
            var wind = document.createElement("li");
            wind.textContent = "Wind speed: " + wData.current.wind_speed + " mph";
            wind.className = "list-group-item";   
            weatherNode.append(wind);

            //create list item and save as humidity, append to ul element
            var humidity = document.createElement("li");
            humidity.textContent = "Humidty: " + wData.current.humidity + "%";
            humidity.className = "list-group-item rounded";   
            weatherNode.append(humidity);

            //create list item and save as uvIndex, append to ul element
            var uvIndex = document.createElement("li");
            uvIndex.textContent = "UV index: " + wData.current.uvi;
            uvIndex.className = "list-group-item rounded";   
            weatherNode.append(uvIndex);

            // append entire ul element to main container
            mainCont.append(weatherNode); 
            
            // Create New title for another section
            var wTitle = document.createElement("h2");
            wTitle.textContent = "Weather Forecast for the next 5 days:";
            wTitle.className = "card-title";

            // append title to weather container
            weather.append(wTitle);

            // loop through 5 day length and gather all the information needed
            for(var i = 0; i < wData.daily.length; i ++){
                // for this day[i], create a ul element and give it a day
                var dayX = wData.daily[i];
                var dayXList = document.createElement("ul");
                dayXList.className = "card-body bg-info bg-gradient bg-opacity-50 border border-dark"
                
                // make date, and append to il element
                var date = moment.unix(dayX.sunrise).format("DD-MM-YYYY");
                dayXList.append(date);

                // create icon and set attributes, append to ul element
                var icon = document.createElement("img");
                icon.setAttribute("src", rootURL + "/img/w/" + dayX.weather[0].icon + ".png");
                dayXList.append(icon);

                //create list item and save as temperature, append to ul element
                var temperature = document.createElement("li");
                temperature.textContent = "Temperature: "+ dayX.temp.day + "\u00B0F";
                temperature.className = "list-group-item rounded";
                dayXList.append(temperature);

                //create list item and save as wind, append to ul element
                var wind = document.createElement("li");        
                wind.textContent = "Wind: " + dayX.wind_speed +" MPH";  
                wind.className = "list-group-item rounded";   
                dayXList.append(wind);

                //create list item and save as humidity, append to ul element
                var humidity = document.createElement("li");   
                humidity.textContent ="Humidity: " + dayX.humidity + "%";     
                humidity.className = "list-group-item rounded";
                dayXList.append(humidity);

                //append ul element to weather container
                weather.append(dayXList);
            }
        
        });

    })
}

// goes through past history and creates buttons
function showHistory(){
  
  // go through list of past searches and create buttons for them
  for (var i = 0; i < pastSearches.length; i++){
    
    const pastCities = pastSearches[i];
    var newBtn = document.createElement("button");

    newBtn.textContent = pastCities;
    newBtn.setAttribute("dataVals", pastCities);
   
    newBtn.addEventListener("submit", function () {
        console.log("I am in the EventListener function within showHistory");
        var searchCity = this.getAttribute("dataVals");
        getWeather(searchCity);
      });

      prvCityCont.appendChild(newBtn);
}

console.log(pastSearches);
localStorage.setItem("previousSearches", JSON.stringify(pastSearches));
}

// Event handler for click event
// checks if input is made
// calls getWeather function and showHistory function
formInput.addEventListener("submit", function(e) {
    e.preventDefault();
    
    var srchVal = inputEl.value.trim();
  
    if (!srchVal) {
      return;
    }

    // document.getElementById("hideme").classList.remove("visually-hidden");
    pastSearches.push(srchVal);
    getWeather(srchVal);
    showHistory();
  });

// Looks for any past searches in local storage and parses them variable
//  function calls showHistory
function startSearch(){
    
    var pastHistory = localStorage.getItem("previousSearches");

    if(pastHistory) {
        console.log("There were previous searches made");
        previousSearches = JSON.parse(pastHistory);
        showHistory();
    } 
}

// function call sto begin program
startSearch();